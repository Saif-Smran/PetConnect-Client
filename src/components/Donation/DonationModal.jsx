import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { FaTimes, FaDonate, FaCreditCard } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ donation, amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      setError('Please login to make a donation');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent
      const { data } = await axios.post('http://localhost:3000/create-payment-intent', {
        amount: amount * 100, // Convert to cents
        donationId: donation._id,
        donorEmail: user.email,
        donorName: user.displayName || user.email
      });

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.displayName || user.email,
              email: user.email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful, save donation record
        await axios.post('http://localhost:3000/donations/record', {
          donationId: donation._id,
          amount: amount,
          donorEmail: user.email,
          donorName: user.displayName || user.email,
          paymentIntentId: paymentIntent.id
        });

        Swal.fire({
          icon: 'success',
          title: 'Donation Successful!',
          text: `Thank you for your generous donation of $${amount}`,
          confirmButtonColor: '#10B981'
        });

        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || 'An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">
          <span className="label-text text-base font-medium">Card Details</span>
        </label>
        <div className="card bg-base-100 border border-base-content/20 shadow-sm">
          <div className="card-body p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#374151',
                    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSmoothing: 'antialiased',
                    lineHeight: '1.5',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                    ':focus': {
                      color: '#111827',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                    iconColor: '#EF4444'
                  },
                  complete: {
                    color: '#059669',
                    iconColor: '#059669'
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>
        <label className="label">
          <span className="label-text-alt text-xs text-base-content/60">
            Enter your card number, expiry date, and CVC
          </span>
        </label>
      </div>

      {error && (
        <div className="alert alert-error shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn btn-primary btn-lg w-full gap-3 bg-gradient-to-r from-primary to-secondary border-none hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group"
      >
        {isProcessing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            <span className="animate-pulse">Processing Payment...</span>
          </>
        ) : (
          <>
            <FaDonate className="text-lg group-hover:animate-bounce" />
            <span className="font-semibold">Donate ${amount}</span>
          </>
        )}
      </button>
    </form>
  );
};

const DonationModal = ({ isOpen, onClose, donation }) => {
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();

  // Disable background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Close modal if user is not authenticated
  React.useEffect(() => {
    if (isOpen && !user) {
      onClose();
    }
  }, [isOpen, user, onClose]);

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset);
    setAmount(preset.toString());
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setAmount(value);
      setSelectedPreset(null);
    }
  };

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setAmount('');
    setSelectedPreset(null);
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="card bg-gradient-to-br from-base-100/95 to-base-200/95 backdrop-blur-xl shadow-2xl border border-base-content/10 w-full max-w-md max-h-[95vh] transform transition-all duration-500 scale-100 opacity-100 animate-in slide-in-from-bottom-4 flex flex-col">
        {/* Header */}
        <div className="card-body p-0 flex-shrink-0">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-base-content/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full">
                    <FaDonate className="text-white text-lg" />
                  </div>
                </div>
                <div>
                  <h2 className="card-title text-xl">Make a Donation</h2>
                  <p className="text-sm text-base-content/70">Support: {donation?.title}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-ghost btn-sm btn-circle hover:bg-base-content/10 transition-all duration-200 hover:scale-110"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {!user ? (
              <div className="text-center py-8">
                <div className="avatar placeholder mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-error/20 to-warning/20 rounded-full">
                    <FaCreditCard className="text-3xl text-error" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">Login Required</h3>
                <p className="text-base-content/70 mb-4">
                  Please login to make a donation
                </p>
                <button
                  onClick={handleClose}
                  className="btn btn-primary gap-2 hover:scale-105 transition-transform duration-200"
                >
                  <FaTimes />
                  Close
                </button>
              </div>
            ) : showSuccess ? (
              <div className="text-center py-8">
                <div className="avatar placeholder mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-success/20 to-primary/20 rounded-full animate-pulse">
                    <FaDonate className="text-2xl text-success" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">Thank You!</h3>
                <p className="text-base-content/70">Your donation has been processed successfully.</p>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <div className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="label">
                      <span className="label-text text-base font-medium">Choose Donation Amount</span>
                    </label>
                    
                    {/* Preset Amounts */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handlePresetClick(preset)}
                          className={`btn btn-outline transition-all duration-300 hover:scale-105 ${
                            selectedPreset === preset
                              ? 'btn-primary shadow-lg'
                              : 'hover:btn-primary'
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="label">
                        <span className="label-text text-sm">Or enter custom amount</span>
                      </label>
                      <label className="input-group">
                        <span className="bg-base-200">$</span>
                        <input
                          type="text"
                          value={amount}
                          onChange={handleCustomAmountChange}
                          placeholder="Enter amount"
                          className="input input-bordered flex-1 focus:input-primary transition-all duration-300"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Payment Form */}
                  {amount && parseInt(amount) > 0 && (
                    <div className="divider">Payment Details</div>
                  )}
                  
                  {amount && parseInt(amount) > 0 && (
                    <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 border border-base-content/10">
                      <div className="card-body p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="avatar placeholder">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full">
                              <FaCreditCard className="text-white text-sm" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-base-content">Payment Details</h3>
                        </div>
                        <CheckoutForm
                          donation={donation}
                          amount={parseInt(amount)}
                          onSuccess={handleSuccess}
                          onClose={handleClose}
                          className= 'text-base-content/70'
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
