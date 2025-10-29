"use client";

import { useState } from "react";

const BasicInfoStep = ({ data, updateData, errors, stepData }) => {
  const [focusedField, setFocusedField] = useState(null);
  void focusedField; // to avoid unused variable warning
  const [completedFields, setCompletedFields] = useState(new Set());

  const languageOptions = [
    { value: "English", emoji: "🇺🇸", popular: true },
    { value: "Spanish", emoji: "🇪🇸", popular: true },
    { value: "French", emoji: "🇫🇷", popular: true },
    { value: "German", emoji: "🇩🇪" },
    { value: "Italian", emoji: "🇮🇹" },
    { value: "Portuguese", emoji: "🇵🇹" },
    { value: "Chinese", emoji: "🇨🇳", popular: true },
    { value: "Japanese", emoji: "🇯🇵" },
    { value: "Korean", emoji: "🇰🇷" },
    { value: "Hindi", emoji: "🇮🇳" },
    { value: "Arabic", emoji: "🇸🇦" },
    { value: "Russian", emoji: "🇷🇺" }
  ];

  const handleInputChange = (field, value) => {
    updateData({ [field]: value });
    if (value && value.trim()) {
      setCompletedFields(prev => new Set([...prev, field]));
    } else {
      setCompletedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  };

  const getProgressPercentage = () => {
    const requiredFields = ['name', 'phone'];
    const optionalFields = ['language'];
    const allFields = [...requiredFields, ...optionalFields];
    
    const filledFields = allFields.filter(field => {
      const value = data[field];
      return value && value.toString().trim();
    });
    
    return Math.round((filledFields.length / allFields.length) * 100);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Compact Header */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">{stepData?.icon}</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{stepData?.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{stepData?.subtitle}</p>
        
        {/* Mini Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-gray-100 rounded-full px-3 py-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-700">{getProgressPercentage()}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span>✨</span>
            What should we call you? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.name ? "border-red-400 bg-red-50" : completedFields.has('name') ? "border-green-400 bg-green-50" : "border-gray-300"
              }`}
            />
            {completedFields.has('name') && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          {errors.name && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.name}
            </p>
          )}
          
          {/* Name feedback */}
          {data.name && data.name.length > 1 && !errors.name && (
            <p className="mt-2 flex items-center gap-2 text-green-600 text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Nice to meet you, {data.name}!
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span>📱</span>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              value={data.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="+1 (555) 123-4567"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.phone ? "border-red-400 bg-red-50" : completedFields.has('phone') ? "border-green-400 bg-green-50" : "border-gray-300"
              }`}
            />
            {completedFields.has('phone') && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.phone}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            For wellness check-ins and emergencies
          </p>
        </div>

        {/* Language */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span>🗣️</span>
            Preferred Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {languageOptions.filter(lang => lang.popular).map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleInputChange("language", lang.value)}
                className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  data.language === lang.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                {lang.emoji} {lang.value}
              </button>
            ))}
          </div>
          <select
            value={data.language || "English"}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.emoji} {lang.value}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Preview */}
        {data.name && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200/50">
            <div className="text-center">
              <div className="text-lg mb-1">🎉</div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">Looking good!</h3>
              <p className="text-xs text-gray-600">
                Hi <span className="font-medium text-gray-800">{data.name}</span>! 
                Your AI companion is taking shape.
              </p>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <span className="text-green-600">🔒</span>
            <span className="text-xs text-gray-600 font-medium">
              Your information is encrypted and secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;