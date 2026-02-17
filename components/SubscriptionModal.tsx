
import React, { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Zap, Star, Loader2, PartyPopper } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  currentPlan: string;
  onUpgrade: (plan: string) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, currentPlan, onUpgrade }) => {
  const [step, setStep] = useState<'pricing' | 'payment' | 'success'>('pricing');
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    {
      name: 'Starter',
      price: isYearly ? '0' : '0',
      description: 'Perfect for exploring AI workflows.',
      features: ['100 AI Text runs/mo', '10 AI Images/mo', 'Standard speed', 'Community support'],
      color: 'gray'
    },
    {
      name: 'Pro',
      price: isYearly ? '190' : '19',
      description: 'Power user tools for intelligent automation.',
      features: ['Unlimited Text runs', '200 AI Images/mo', 'Priority processing', 'Email support', 'Custom system instructions'],
      color: 'indigo',
      popular: true
    },
    {
      name: 'Enterprise',
      price: isYearly ? '990' : '99',
      description: 'Full control for teams and scale.',
      features: ['Dedicated model instances', 'Unlimited Images', 'API access', '24/7 Phone support', 'SLA guarantees'],
      color: 'purple'
    }
  ];

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onUpgrade(selectedPlan.name);
    }, 2500);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-950/90 backdrop-blur-xl">
        <div className="bg-gray-900 border border-indigo-500/30 rounded-[2.5rem] w-full max-w-lg p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <PartyPopper className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to {selectedPlan?.name}!</h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Your subscription has been successfully activated. You now have full access to all premium features and high-speed AI processing.
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
          >
            Start Building
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-950/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {step === 'pricing' ? 'Upgrade Your Intelligence' : 'Complete Checkout'}
            </h2>
            <p className="text-sm text-gray-400">
              {step === 'pricing' ? 'Choose the plan that fits your automation needs.' : `Selected: ${selectedPlan?.name} Plan`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          {step === 'pricing' ? (
            <div className="space-y-10">
              {/* Toggle */}
              <div className="flex justify-center">
                <div className="bg-gray-800 p-1.5 rounded-2xl flex items-center gap-2">
                  <button
                    onClick={() => setIsYearly(false)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${!isYearly ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsYearly(true)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isYearly ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
                  >
                    Yearly <span className="text-[10px] ml-1 opacity-70">(-20%)</span>
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative p-8 rounded-[2rem] border-2 transition-all flex flex-col ${
                      plan.popular ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-800 bg-gray-800/20 hover:border-gray-700'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-black text-white">${plan.price}</span>
                      <span className="text-gray-500 text-sm">{isYearly ? '/year' : '/mo'}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-8 h-10">{plan.description}</p>
                    
                    <div className="space-y-4 mb-10 flex-1">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => { setSelectedPlan(plan); setStep('payment'); }}
                      disabled={currentPlan === plan.name}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        currentPlan === plan.name
                          ? 'bg-gray-800 text-gray-500 cursor-default'
                          : plan.popular
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-white text-gray-900 hover:bg-gray-200 shadow-lg'
                      }`}
                    >
                      {currentPlan === plan.name ? 'Current Plan' : 'Select Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Form */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 border-2 border-indigo-500 rounded-xl">
                        <CreditCard className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-semibold">Card</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 border-2 border-transparent hover:border-gray-700 rounded-xl transition-colors">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold">Crypto</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Cardholder Name</label>
                      <input type="text" placeholder="Alex Rivers" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Card Number</label>
                      <div className="relative">
                        <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono" />
                        <CreditCard className="absolute right-4 top-3.5 w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Expiry</label>
                        <input type="text" placeholder="MM / YY" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">CVC</label>
                        <input type="text" placeholder="•••" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-800/50 rounded-[2rem] p-8 border border-gray-800">
                  <h4 className="text-lg font-bold text-white mb-6">Order Summary</h4>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>{selectedPlan?.name} Plan ({isYearly ? 'Yearly' : 'Monthly'})</span>
                      <span className="text-white">${selectedPlan?.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>AI Platform Fee</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="pt-4 border-t border-gray-700 flex justify-between">
                      <span className="font-bold text-white">Total Today</span>
                      <span className="text-xl font-black text-indigo-400">${selectedPlan?.price}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-900/50 p-3 rounded-xl">
                      <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                      Secure SSL encrypted payment processing via AutomateAI Pay.
                    </div>
                    <button
                      onClick={handleProcessPayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay $${selectedPlan?.price} & Upgrade`
                      )}
                    </button>
                    <button
                      onClick={() => setStep('pricing')}
                      disabled={isProcessing}
                      className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      Back to Plans
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-800 bg-gray-900/50 flex items-center justify-center gap-8 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure Checkout</span>
          <span className="flex items-center gap-1.5"><Star className="w-3 h-3" /> Money Back Guarantee</span>
          <span className="flex items-center gap-1.5"><Check className="w-3 h-3" /> Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
