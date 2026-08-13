import { useEffect, useState } from 'react';
import { useFirebaseData } from './useFirebaseData';

/**
 * Stripe return handler — records deposit as Pending Verification only.
 * Balance is NEVER credited automatically; admin must approve in the dashboard.
 */
export function useStripePayment(showToast?: (msg: string, type: 'success' | 'error' | 'info') => void) {
  const { addTransaction, transactions } = useFirebaseData();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const depositSuccess = params.get('deposit_success') === 'true';
    const amountParam = parseFloat(params.get('amount') || '0');
    const paymentIntentId = params.get('payment_intent') || params.get('payment_intent_id') || '';

    const hasStripeReturn =
      (depositSuccess && amountParam > 0) ||
      (params.get('payment_intent_result') === 'true' && !!paymentIntentId);

    if (!hasStripeReturn) return;

    // Clean URL immediately to prevent replay
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    const intentId = paymentIntentId || params.get('payment_intent') || '';
    if (!intentId && !depositSuccess) return;

    // Skip if this intent was already recorded
    if (intentId && transactions.some((t) => t.refCode && String(t.refCode).includes(intentId.substring(0, 12)))) {
      return;
    }

    setIsVerifying(true);

    const recordPending = async () => {
      try {
        let amount = amountParam;
        let ref = intentId ? intentId.substring(0, 24) : '';

        // Optional server check for amount only — still does not credit balance
        if (intentId) {
          try {
            const res = await fetch('/api/stripe/verify-deposit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentIntentId: intentId,
                amount: amountParam || undefined,
              }),
            });
            const data = await res.json().catch(() => ({}));
            if (data.amount) amount = Number(data.amount);
            if (data.transactionId) ref = data.transactionId;
          } catch {
            // Continue with client-side pending record
          }
        }

        if (amount <= 0) {
          if (showToast) showToast('Could not determine deposit amount.', 'info');
          return;
        }

        const txId = `DEP-STRIPE-${Date.now().toString(36).toUpperCase()}`;
        if (addTransaction) {
          addTransaction({
            id: txId,
            type: 'Deposit',
            amount,
            method: 'Stripe Gateway',
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'Pending Verification',
            account: 'Live ECN Account',
            refCode: ref || txId,
            proofNote: 'Stripe return recorded — awaiting manual admin approval before balance credit',
          });
        }

        if (showToast) {
          showToast(
            `Deposit of $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} submitted. Pending admin verification — balance will update after approval.`,
            'info'
          );
        }
      } catch (err) {
        console.error('Stripe deposit record error:', err);
        if (showToast) showToast('Could not record deposit. Contact support if funds were charged.', 'error');
      } finally {
        setIsVerifying(false);
      }
    };

    recordPending();
  }, [addTransaction, showToast, transactions]);

  return { isVerifying };
}
