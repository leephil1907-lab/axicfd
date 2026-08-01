import { authRouter } from "./auth-router.js";
import { localAuthRouter } from "./local-auth-router.js";
import { marketRouter } from "./market-router.js";
import { tradingRouter } from "./trading-router.js";
import { adminRouter } from "./admin-router.js";
import { socialRouter } from "./social-router.js";
import { newsRouter } from "./news-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  market: marketRouter,
  trading: tradingRouter,
  admin: adminRouter,
  social: socialRouter,
  news: newsRouter,
});

export type AppRouter = typeof appRouter;
