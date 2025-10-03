"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useMarketingFunnel } from "../../context/MarketingFunnelContext";

const EmailCollectionStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value.length > 0) {
      setIsValidEmail(validateEmail(value));
    } else {
      setIsValidEmail(true);
    }
  };

  const handleContinue = async () => {
    if (!email) {
      setIsValidEmail(false);
      return;
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    setIsLoading(true);
    
    // Save email to funnel data
    actions.updateData({ email });
    
    // Simulate a brief loading state
    setTimeout(() => {
      setIsLoading(false);
      actions.nextStep();
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <motion.h2 
          className="text-xl font-medium text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Almost there! One last step
        </motion.h2>
        <motion.p 
          className="text-gray-500 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Enter your email to receive your personalized plan and start your journey
        </motion.p>
      </div>

      {/* Email input form */}
      <motion.div 
        className="bg-white border border-gray-200  p-8 shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="space-y-6">
          {/* Email icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100  flex items-center justify-center">
            <Mail className="w-8 h-8 " />
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 text-center border  text-gray-900 placeholder-gray-400 appearance-none focus:outline-none focus:ring-0 focus:shadow-none ring-0 transition-colors ${
                !isValidEmail 
                  ? 'border-red-300 bg-red-50 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              style={{ boxShadow: 'none' }}
              autoFocus
            />
            {!isValidEmail && (
              <motion.p 
                className="text-red-500 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Please enter a valid email address
              </motion.p>
            )}
          </div>

          {/* Registration note */}
          <motion.p 
            className="text-xs text-gray-600 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            This email will be used to register the account. So please add valid email account!
          </motion.p>

          {/* Benefits list */}
          <div className="text-left space-y-3">
            <h3 className="font-semibold text-gray-900 text-center">What you'll receive:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Your personalized mental wellness plan</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Access to your specialized AI agents</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Weekly progress tracking & insights</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continue button */}
      <motion.div 
        className="flex justify-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Getting ready...</span>
            </div>
          ) : (
            "Get my personalized plan"
          )}
        </button>
      </motion.div>

      {/* Privacy note */}
      <motion.p 
        className="text-xs text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        We respect your privacy. No spam, unsubscribe anytime.
      </motion.p>
    </div>
  );
};

export default EmailCollectionStep;