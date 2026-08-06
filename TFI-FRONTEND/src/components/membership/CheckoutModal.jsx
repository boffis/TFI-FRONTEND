import { useState, useContext } from 'react';
import { CardPayment } from '@mercadopago/sdk-react';
import { AuthContext } from '../../services/authContext/AuthContext';
import useFetch from '../../hooks/useFetch';

const CheckoutModal = ({ plan, onClose }) => {
  const { handleNewMembership } = useContext(AuthContext);
  const { post } = useFetch();

  const [isReady, setIsReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  // ─── MP Brick config ─────────────────────────────────────────────────────────

  // `amount` is required by the brick to display the correct value.
  // No `customization` needed for CardPayment — it only tokenizes the card,
  // it does not process the payment or filter payment methods.
  const initialization = {
    amount: Number(plan.price),
  };

  // ─── Callbacks ───────────────────────────────────────────────────────────────

  /**
   * Called by the CardPayment brick after the card is tokenized.
   * The brick does NOT charge anything — it only gives us a card token.
   * We must return a Promise so the brick can manage its own loading/error UI.
   *
   * formData shape from MP (snake_case):
   * {
   *   token:              string   ← card token (alphanumeric, used as card_token_id in /preapproval)
   *   issuer_id:          string
   *   payment_method_id:  string
   *   transaction_amount: number
   *   installments:       number
   *   payer: {
   *     email: string
   *     identification: { type: string, number: string }
   *   }
   * }
   */
  const onSubmit = (formData) => {
    setErrorMsg(null);

    // Debug: inspect token and full shape before sending
    console.log('[CheckoutModal] CardPayment formData:', formData);
    console.log('[CheckoutModal] token:', formData?.token);

    // Build ONLY the fields the backend expects — no spread, no extras.
    const payload = {
      token:           formData.token,
      issuerId:        formData.issuer_id,
      paymentMethodId: formData.payment_method_id,
      membershipPlanId: plan.membershipPlanId,
      payer: {
        email: formData.payer?.email,
        identification: {
          type:   formData.payer?.identification?.type,
          number: formData.payer?.identification?.number,
        },
      },
    };

    return new Promise((resolve, reject) => {
      post(
        'Payment/Subscribe',
        true,   // isPrivate — attaches Bearer token automatically
        payload,
        (response) => {
          setPaymentStatus('success');
          handleNewMembership({
            membershipId: response?.membershipId,
            expirationDate: response?.expirationDate,
            membershipPlan: {
              name: plan.type ?? plan.name ?? 'Membership Plan',
              price: plan.price,
              durationInDays: plan.durationInDays,
            },
          });
          resolve();
        },
        (error) => {
          const message =
            error?.message ??
            'There was an error processing your payment. Please try again.';
          console.error('Payment error:', error);
          setErrorMsg(message);
          setPaymentStatus('error');
          reject();
        }
      );
    });
  };

  const onReady = () => setIsReady(true);

  const onError = (error) => {
    console.error('CardPayment Brick error:', error);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 shadow-2xl overflow-y-auto max-h-[90vh]">

        {/* Close button */}
        <button
          id="checkout-modal-close"
          onClick={onClose}
          aria-label="Close checkout"
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Header */}
          <h2 className="mb-2 text-2xl font-bold text-white">Complete your purchase</h2>
          <p className="mb-6 text-sm text-zinc-400">
            You are subscribing to the{' '}
            <span className="font-semibold text-orange-500 uppercase">{plan.type}</span>{' '}
            plan for{' '}
            <span className="font-bold text-white">${Number(plan.price).toFixed(2)}</span>.
          </p>

          {/* Loading shimmer while brick initialises */}
          {!isReady && (
            <div className="mb-4 animate-pulse space-y-3">
              <div className="h-10 w-full rounded-lg bg-zinc-800" />
              <div className="flex gap-3">
                <div className="h-10 flex-1 rounded-lg bg-zinc-800" />
                <div className="h-10 flex-1 rounded-lg bg-zinc-800" />
              </div>
              <div className="h-10 w-full rounded-lg bg-zinc-800" />
              <div className="h-11 w-full rounded-xl bg-zinc-800" />
            </div>
          )}

          {/* Card Payment Brick */}
          <div className={!isReady ? 'opacity-0 h-0 overflow-hidden' : ''}>
            <CardPayment
              initialization={initialization}
              onSubmit={onSubmit}
              onReady={onReady}
              onError={onError}
            />
          </div>

          {/* Success feedback */}
          {paymentStatus === 'success' && (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
              ✓ Payment processed successfully! Your subscription is now active.
            </div>
          )}

          {/* Error feedback */}
          {paymentStatus === 'error' && errorMsg && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
