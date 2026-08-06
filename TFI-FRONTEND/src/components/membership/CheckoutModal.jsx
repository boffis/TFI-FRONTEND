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

  const initialization = {
    amount: Number(plan.price),
  };

  const customization = {
    paymentMethods: {
      types: {
        excluded: ['ticket'],
      },
    },
  };

  // ─── Callbacks ───────────────────────────────────────────────────────────────

  /**
   * The CardPayment brick requires onSubmit to return a Promise.
   * useFetch uses callbacks, so we wrap it in a Promise here.
   */
  const onSubmit = (param) => {
    setErrorMsg(null);

    // Normalise brick callback data (formData wrapper or flat object)
    const cardData = param?.formData ?? param ?? {};

    const payload = {
      ...cardData,
      token: cardData.token,
      payment_method_id: cardData.payment_method_id ?? cardData.paymentMethodId,
      paymentMethodId: cardData.payment_method_id ?? cardData.paymentMethodId,
      issuer_id: cardData.issuer_id ?? cardData.issuerId,
      issuerId: cardData.issuer_id ?? cardData.issuerId,
      transaction_amount: cardData.transaction_amount ?? cardData.transactionAmount ?? Number(plan.price),
      transactionAmount: cardData.transaction_amount ?? cardData.transactionAmount ?? Number(plan.price),
      installments: cardData.installments ?? 1,
      membershipPlanId: plan.membershipPlanId,
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
              customization={customization}
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
