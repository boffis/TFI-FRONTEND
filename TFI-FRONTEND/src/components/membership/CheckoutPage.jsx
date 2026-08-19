import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CardPayment } from '@mercadopago/sdk-react';
import { AuthContext } from '../../services/authContext/AuthContext';
import useFetch from '../../hooks/useFetch';
import Layout from '../layout/Layout';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleNewMembership, handleNewPayment } = useContext(AuthContext);
  const { post } = useFetch();

  const plan = location.state?.plan;

  const [isReady, setIsReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | 'success' | 'error'
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!plan) {
      navigate('/memberships', { replace: true });
    }
  }, [plan, navigate]);

  if (!plan) return null;

  /**
   * One membership at a time, enforced by the backend with a 409. Learning that after typing in a
   * card is a poor way to find out, so the form is replaced by an explanation up front.
   */
  const existingMembership = (user?.memberships ?? []).find((m) => {
    if (m.isCancelled) return false;
    const expiration = new Date(m.expirationDate);
    // Not-yet-activated memberships carry DateTime.MinValue: past, but not expired, and still blocking.
    const isPendingActivation =
      Number.isNaN(expiration.getTime()) || expiration.getFullYear() <= 1;
    return isPendingActivation || expiration > new Date();
  });

  const initialization = {
    amount: Number(plan.price),
  };

  const onSubmit = (formData) => {
    setErrorMsg(null);
    setPaymentStatus(null);
    setIsProcessing(true);
    // The Brick remounts fresh when we return to the form, so let the shimmer mask it.
    setIsReady(false);

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
          // Field-for-field what login serves, so the cached user matches a fresh sign-in.
          handleNewMembership({
            membershipId: response?.membershipId,
            userId: user?.userId,
            expirationDate: response?.expirationDate,
            isCancelled: false,
            membershipPlan: {
              membershipPlanId: plan.membershipPlanId,
              type: plan.type,
              price: plan.price,
              durationInDays: plan.durationInDays,
            },
          });
          // Mirror the pending payment into the context so "Mis pagos" shows it before re-login.
          if (response?.payment) {
            handleNewPayment(response.payment);
          }
          resolve();
        },
        (error) => {
          const message =
            error?.message ??
            'Hubo un error al procesar tu pago. Intentá de nuevo.';
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

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-12">
          <button
            onClick={() => navigate('/memberships')}
            className="mb-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Volver a los planes
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Pago seguro
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          <div className="lg:col-span-5 rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
            <h2 className="mb-6 text-xl font-bold text-white">Resumen de la compra</h2>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="font-bold text-lg text-white uppercase">{plan.type}</p>
                <p className="text-sm text-zinc-400">{plan.durationInDays} días de acceso</p>
              </div>
              <p className="text-2xl font-extrabold text-orange-500">
                ${Number(plan.price).toFixed(2)}
              </p>
            </div>

            <hr className="border-zinc-800 mb-6" />

            <ul className="flex flex-col gap-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Acceso completo al gimnasio
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Clases grupales incluidas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Cancelá cuando quieras
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            {isProcessing ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col items-center justify-center gap-6 min-h-[280px]">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">Procesando el pago…</p>
                  <p className="mt-1 text-sm text-zinc-400">No cierres esta ventana.</p>
                </div>
              </div>
            ) : paymentStatus === 'success' ? (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center flex flex-col items-center justify-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">¡Pago exitoso!</h3>
                <p className="text-sm text-green-300 mb-8 max-w-sm mx-auto">
                  Tu suscripción ya está activa. Tenés acceso completo a nuestras instalaciones y clases.
                </p>
                <button
                  onClick={() => navigate('/account')}
                  className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-500 shadow-lg shadow-green-500/20"
                >
                  Ir a mi cuenta
                </button>
              </div>
            ) : existingMembership ? (
              /* Blocked — checked after the success branch, so a membership this page just
                 created doesn't replace its own confirmation screen. */
              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-8 text-center flex flex-col items-center justify-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">Ya tenés una membresía</h3>
                <p className="text-sm text-orange-200/90 mb-8 max-w-sm mx-auto">
                  Solo podés tener una membresía a la vez. Cancelá la actual desde tu cuenta y
                  después volvé a elegir el plan que quieras.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate('/account')}
                    className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-400 shadow-lg shadow-orange-500/20"
                  >
                    Ir a mi cuenta
                  </button>
                  <button
                    onClick={() => navigate('/memberships')}
                    className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
                  >
                    Volver a los planes
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
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
