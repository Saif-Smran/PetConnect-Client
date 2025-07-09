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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <FaDonate />
            Donate ${amount}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <FaDonate className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Make a Donation</h2>
              <p className="text-sm text-gray-600">Support: {donation?.title}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!user ? (
            <div className="text-center py-8">
              <FaCreditCard className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Login Required</h3>
              <p className="text-gray-600 mb-4">
                Please login to make a donation
              </p>
              <button
                onClick={handleClose}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          ) : showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDonate className="text-2xl text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your donation has been processed successfully.</p>
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <div className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Donation Amount
                  </label>
                  
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className={`p-3 border-2 rounded-lg font-medium transition-all ${
                          selectedPreset === preset
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        $
                      </span>
                      <input
                        type="text"
                        value={amount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                {amount && parseInt(amount) > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <CheckoutForm
                      donation={donation}
                      amount={parseInt(amount)}
                      onSuccess={handleSuccess}
                      onClose={handleClose}
                    />
                  </div>
                )}
              </div>
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
