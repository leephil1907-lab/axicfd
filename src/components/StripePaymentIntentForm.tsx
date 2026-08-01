import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

interface StripeFormProps {
  paymentIntentId: string;
  onSuccess: (newBalance?: string) => void;
  amount: number;
  currency: string;
}

function PaymentForm({ paymentIntentId, onSuccess, amount, currency }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const confirmMutation = trpc.trading.confirmPaymentIntent.useMutation({
    onSuccess: (data) => {
      toast.success("Payment verified! Account balance updated.");
      setIsSubmitting(false);
      onSuccess(data.newBalance);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Server payment verification failed.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred with your payment.");
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm server-side & update account balance
        confirmMutation.mutate({ paymentIntentId });
      } else {
        setErrorMessage(`Payment status: ${paymentIntent?.status}. Waiting for confirmation.`);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit payment.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full py-4 rounded-xl bg-[#635BFF] hover:bg-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying Payment with Server...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pay {currency} {amount.toFixed(2)} Now</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Official Stripe 256-Bit Encrypted Gateway</span>
      </div>
    </form>
  );
}

interface StripePaymentIntentWrapperProps {
  clientSecret: string;
  publishableKey: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  onSuccess: (newBalance?: string) => void;
}

export default function StripePaymentIntentWrapper({
  clientSecret,
  publishableKey,
  paymentIntentId,
  amount,
  currency,
  onSuccess,
}: StripePaymentIntentWrapperProps) {
  const stripePromise = React.useMemo(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  if (!clientSecret || !publishableKey || !stripePromise) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium space-y-2">
        <p className="font-bold uppercase tracking-wider text-[11px] text-amber-950">Stripe Live Keys Required</p>
        <p>Embedded Stripe Elements requires active `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY` configured in settings.</p>
        <p className="text-[11px] text-amber-800">Use "Proceed to Stripe Payment Session" or "Smart Direct Card Gateway" above to complete test funding.</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#635BFF",
            borderRadius: "12px",
          },
        },
      }}
    >
      <PaymentForm
        paymentIntentId={paymentIntentId}
        onSuccess={onSuccess}
        amount={amount}
        currency={currency}
      />
    </Elements>
  );
}
