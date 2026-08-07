import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CardPayment } from '@mercadopago/sdk-react';
import { AuthContext } from '../../services/authContext/AuthContext';
import useFetch from '../../hooks/useFetch';
import Layout from '../layout/Layout';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleNewMembership } = useContext(AuthContext);
  const { post } = useFetch();

  const plan = location.state?.plan;

  const [isReady, setIsReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | 'success' | 'error'
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // If no plan is found in state, redirect back to memberships page
  useEffect(() => {
    if (!plan) {
      navigate('/memberships', { replace: true });
    }
  }, [plan, navigate]);

  if (!plan) return null;

  // ─── MP Brick config ─────────────────────────────────────────────────────────

  const initialization = {
    amount: Number(plan.price),
  };

  // ─── Callbacks ───────────────────────────────────────────────────────────────

  const onSubmit = (formData) => {
    setErrorMsg(null);
    setPaymentStatus(null);
    setIsProcessing(true);

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
        true,
        payload,
        (response) => {
          setPaymentStatus('success');
          setIsProcessing(false);
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
          setIsProcessing(false);
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
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/memberships')}
            className="mb-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Plans
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Secure Checkout
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-5 rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
            <h2 className="mb-6 text-xl font-bold text-white">Order Summary</h2>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="font-bold text-lg text-white uppercase">{plan.type}</p>
                <p className="text-sm text-zinc-400">{plan.durationInDays} days access</p>
              </div>
              <p className="text-2xl font-extrabold text-orange-500">
                ${Number(plan.price).toFixed(2)}
              </p>
            </div>

            <hr className="border-zinc-800 mb-6" />

            <ul className="flex flex-col gap-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Full gym access
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Group classes included
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Cancel anytime
              </li>
            </ul>
          </div>

          {/* Right Column: Payment & Feedback */}
          <div className="lg:col-span-7">
            {/* Processing overlay */}
            {isProcessing ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col items-center justify-center gap-6 min-h-[280px]">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">Processing payment…</p>
                  <p className="mt-1 text-sm text-zinc-400">Please don't close this window.</p>
                </div>
              </div>
            ) : paymentStatus === 'success' ? (
              /* Success screen */
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center flex flex-col items-center justify-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">Payment Successful!</h3>
                <p className="text-sm text-green-300 mb-8 max-w-sm mx-auto">
                  Your subscription is now active. You have full access to our facilities and classes.
                </p>
                <button
                  onClick={() => navigate('/account')}
                  className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-500 shadow-lg shadow-green-500/20"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              /* Payment form */
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
                {/* Loading shimmer while brick initialises */}
                {!isReady && (
                  <div className="mb-4 animate-pulse space-y-4">
                    <div className="h-10 w-full rounded-lg bg-zinc-800" />
                    <div className="flex gap-4">
                      <div className="h-10 flex-1 rounded-lg bg-zinc-800" />
                      <div className="h-10 flex-1 rounded-lg bg-zinc-800" />
                    </div>
                    <div className="h-10 w-full rounded-lg bg-zinc-800" />
                    <div className="h-12 w-full rounded-xl bg-zinc-800 mt-6" />
                  </div>
                )}

                {/* Error feedback above the form */}
                {paymentStatus === 'error' && errorMsg && (
                  <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-start gap-3">
                    <span className="text-lg">⚠</span>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                )}

                <div className={!isReady ? 'opacity-0 h-0 overflow-hidden' : ''}>
                  <CardPayment
                    initialization={initialization}
                    onSubmit={onSubmit}
                    onReady={onReady}
                    onError={onError}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
