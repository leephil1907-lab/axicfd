import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { createOAuthCallbackHandler } from "./kimi/auth.js";
import { getDb } from "./queries/connection.js";
import { transactions, tradingAccounts } from "@db/schema";
import { eq, and } from "drizzle-orm";

const api = new Hono();

api.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// OAuth callback
api.get("/oauth/callback", createOAuthCallbackHandler());

// ── Webhook: Stripe ─────────────────────────────────
api.post("/webhooks/stripe", async (c) => {
  const db = getDb();
  let event: any;
  const signature = c.req.header("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const apiKey = process.env.STRIPE_SECRET_KEY;

  try {
    const rawBody = await c.req.text();
    if (apiKey && webhookSecret && signature) {
      const StripeModule = await import("stripe");
      const stripeObj = new StripeModule.default(apiKey, { apiVersion: "2023-10-16" as any });
      event = stripeObj.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // Direct parsing fallback if secret is not set (for sandbox/dev convenience)
      event = JSON.parse(rawBody);
    }
  } catch (err: any) {
    console.error("Stripe webhook verification failed:", err);
    return c.json({ error: `Webhook error: ${err.message}` }, 400);
  }

  if (event) {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;
      const clientAccountId = session.metadata?.client_account_id || session.metadata?.accountId;
      const txRef = `Stripe Ref: ${sessionId}`;

      try {
        let [tx] = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.type, "deposit"),
              eq(transactions.status, "pending"),
              eq(transactions.reference, txRef)
            )
          );

        // Fallback: If transaction wasn't logged with reference, match by clientAccountId & pending status
        if (!tx && clientAccountId) {
          const parsedAccountId = parseInt(clientAccountId, 10);
          if (!isNaN(parsedAccountId)) {
            const [pendingTx] = await db
              .select()
              .from(transactions)
              .where(
                and(
                  eq(transactions.type, "deposit"),
                  eq(transactions.status, "pending"),
                  eq(transactions.accountId, parsedAccountId)
                )
              );
            tx = pendingTx;
          }
        }

        if (tx) {
          const amount = tx ? parseFloat(tx.amount.toString()) : (session.amount_total ? session.amount_total / 100 : 0);
          const targetAccountId = tx ? tx.accountId : parseInt(clientAccountId, 10);

          const [account] = await db
            .select()
            .from(tradingAccounts)
            .where(eq(tradingAccounts.id, targetAccountId));

          if (account) {
            const currentBalance = parseFloat(account.balance.toString());
            const currentEquity = parseFloat(account.equity.toString());
            const currentMargin = parseFloat(account.marginAvailable.toString());
            const newBalance = currentBalance + amount;
            const newEquity = currentEquity + amount;
            const newMargin = currentMargin + amount;

            await db
              .update(tradingAccounts)
              .set({
                balance: newBalance.toFixed(8),
                equity: newEquity.toFixed(8),
                marginAvailable: newMargin.toFixed(8),
              })
              .where(eq(tradingAccounts.id, account.id));

            await db
              .update(transactions)
              .set({
                status: "completed",
                reference: txRef,
                completedAt: new Date(),
              })
              .where(eq(transactions.id, tx.id));

            console.log(`Successfully completed Stripe deposit of ${amount} for account ${account.accountNumber} via webhook.`);
          }
        }
      } catch (err) {
        console.error("Error processing Stripe webhook deposit:", err);
        return c.json({ error: "Internal processing error" }, 500);
      }
    } else if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
      const obj = event.data.object;
      const objId = obj.id;
      const txRef = `Stripe Ref: ${objId}`;

      try {
        const [tx] = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.type, "deposit"),
              eq(transactions.status, "pending"),
              eq(transactions.reference, txRef)
            )
          );

        if (tx) {
          await db
            .update(transactions)
            .set({ status: "failed" })
            .where(eq(transactions.id, tx.id));
          console.log(`Marked Stripe deposit ${txRef} as failed.`);
        }
      } catch (err) {
        console.error("Error handling Stripe failure webhook:", err);
      }
    } else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const txRef = `Stripe Intent: ${paymentIntentId}`;

      try {
        const [tx] = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.type, "deposit"),
              eq(transactions.status, "pending"),
              eq(transactions.reference, txRef)
            )
          );

        if (tx) {
          const amount = parseFloat(tx.amount.toString());
          const [account] = await db
            .select()
            .from(tradingAccounts)
            .where(eq(tradingAccounts.id, tx.accountId));

          if (account) {
            const currentBalance = parseFloat(account.balance.toString());
            const currentEquity = parseFloat(account.equity.toString());
            const currentMargin = parseFloat(account.marginAvailable.toString());
            const newBalance = (currentBalance + amount).toFixed(8);
            const newEquity = (currentEquity + amount).toFixed(8);
            const newMargin = (currentMargin + amount).toFixed(8);

            await db
              .update(tradingAccounts)
              .set({
                balance: newBalance,
                equity: newEquity,
                marginAvailable: newMargin,
              })
              .where(eq(tradingAccounts.id, account.id));

            await db
              .update(transactions)
              .set({
                status: "completed",
                completedAt: new Date(),
              })
              .where(eq(transactions.id, tx.id));

            console.log(`Successfully completed payment_intent.succeeded deposit of ${amount} for account ${account.accountNumber} via webhook.`);
          }
        }
      } catch (err) {
        console.error("Error processing Stripe payment_intent.succeeded webhook:", err);
        return c.json({ error: "Internal processing error" }, 500);
      }
    }
  }

  return c.json({ received: true });
});

// ── Webhook: NOWPayments IPN ───────────────────────
api.post("/webhooks/nowpayments", async (c) => {
  const db = getDb();
  let payload: any;
  try {
    payload = await c.req.json();
  } catch (err: any) {
    console.error("NOWPayments IPN parsing error:", err);
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const ipnSignature = c.req.header("x-nowpayments-sig");
  const ipnKey = process.env.NOWPAYMENTS_IPN_KEY;
  if (ipnKey && ipnSignature) {
    try {
      const crypto = await import("crypto");
      const sortedPayload = Object.keys(payload)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = payload[key];
          return acc;
        }, {});
      const hmac = crypto.createHmac("sha512", ipnKey);
      hmac.update(JSON.stringify(sortedPayload));
      const calculatedSig = hmac.digest("hex");
      if (calculatedSig !== ipnSignature) {
        console.warn("NOWPayments IPN signature mismatch!");
        return c.json({ error: "Signature verification failed" }, 400);
      }
    } catch (err) {
      console.error("Error verifying NOWPayments IPN signature:", err);
    }
  }

  const invoiceId = payload.invoice_id || payload.order_id?.replace("AXI-TX-", "");
  const paymentStatus = payload.payment_status;

  if (invoiceId && (paymentStatus === "finished" || paymentStatus === "confirmed")) {
    const txRef = `NOWPayments Ref: ${invoiceId}`;
    try {
      const [tx] = await db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.type, "deposit"),
            eq(transactions.status, "pending"),
            eq(transactions.reference, txRef)
          )
        );

      if (tx) {
        const amount = parseFloat(tx.amount.toString());
        const [account] = await db
          .select()
          .from(tradingAccounts)
          .where(eq(tradingAccounts.id, tx.accountId));

        if (account) {
          const currentBalance = parseFloat(account.balance.toString());
          const currentEquity = parseFloat(account.equity.toString());
          const newBalance = currentBalance + amount;
          const newEquity = currentEquity + amount;

          await db
            .update(tradingAccounts)
            .set({
              balance: newBalance.toFixed(8),
              equity: newEquity.toFixed(8),
            })
            .where(eq(tradingAccounts.id, account.id));

          await db
            .update(transactions)
            .set({
              status: "completed",
              completedAt: new Date(),
            })
            .where(eq(transactions.id, tx.id));

          console.log(`Successfully completed NOWPayments deposit of ${amount} for account ${account.accountNumber} via IPN.`);
        }
      }
    } catch (err) {
      console.error("Error processing NOWPayments IPN deposit:", err);
      return c.json({ error: "Internal processing error" }, 500);
    }
  }

  return c.json({ received: true });
});

// tRPC handler
api.use("/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// Health check
api.get("/health", (c) => c.json({ status: "ok", time: Date.now() }));

// 404 for unmatched API sub-routes
api.all("/*", (c) => c.json({ error: "API Route Not Found" }, 404));

export const app = new Hono();

// Mount API sub-app
app.route("/api", api);

// For non-API routes, pass to Vite dev server
app.all("*", async (c, next) => {
  return await next();
});

// Export for Vite dev server and Hono environment
export default app;
