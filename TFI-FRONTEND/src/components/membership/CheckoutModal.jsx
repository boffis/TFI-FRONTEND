import React, { useState, useContext } from 'react';
import { CardPayment } from '@mercadopago/sdk-react';
import { AuthContext } from '../../services/authContext/AuthContext';
import { getApiUrl } from '../../utils/apiUrl';

const CheckoutModal = ({ plan, onClose }) => {
  const { user, handleNewMembership } = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const initialization = {
    amount: Number(plan.price),
  };

  const customization = {
    paymentMethods: {
      types: {
        excluded: ['ticket']
      }
    }
  };

  const onSubmit = async (formData) => {
    setErrorMsg(null);
    return new Promise((resolve, reject) => {
      fetch(getApiUrl('Payment/Subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
           ...formData,
           membershipPlanId: plan.membershipPlanId
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            let errorMessage = 'Payment failed';
            try {
              const err = await response.json();
              errorMessage = err.detail || errorMessage;
            } catch (e) {
              // response is not json
            }
            throw new Error(errorMessage);
          }
          return response.json();
        })
        .then((response) => {
          setPaymentStatus('success');
          // Add membership locally
          handleNewMembership({
            membershipId: response.membershipId,
            expirationDate: response.expirationDate,
            membershipPlan: {
              name: plan.type || plan.name || 'Membership Plan',
              price: plan.price,
              durationInDays: plan.durationInDays
            }
          });
          resolve();
        })
        .catch((error) => {
          console.error('Payment error:', error);
          setErrorMsg(error.message || 'There was an error processing your payment. Please try again.');
          setPaymentStatus('error');
          reject();
        });
    });
  };

  const onError = async (error) => {
    console.error('CardPayment Error:', error);
  };

  const onReady = async () => {
    setIsReady(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>
        <div className="p-8">
          <h2 className="mb-2 text-2xl font-bold text-white">Complete your purchase</h2>
          <p className="mb-6 text-sm text-zinc-400">
            You are subscribing to the <span className="font-semibold text-orange-500 uppercase">{plan.type}</span> plan for <span className="font-bold text-white">${Number(plan.price).toFixed(2)}</span>.
          </p>

          <div className={!isReady ? 'opacity-50 pointer-events-none' : ''}>
             <CardPayment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
              />
          </div>
          
          {paymentStatus === 'success' && (
             <div className="mt-4 rounded border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
               Payment processed successfully! Your subscription is active.
             </div>
          )}
          {paymentStatus === 'error' && (
             <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
               {errorMsg}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
