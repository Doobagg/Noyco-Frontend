"use client";

import { useState } from "react";

const BasicInfoForm = ({ data = {}, updateData }) => {
  const [errors, setErrors] = useState({});

  const avatarOptions = [
    { emoji: "🤖", label: "AI Assistant" },
    { emoji: "👨‍⚕️", label: "Doctor (Male)" },
    { emoji: "👩‍⚕️", label: "Doctor (Female)" },
    { emoji: "🧑‍⚕️", label: "Healthcare Pro" },
    { emoji: "👨‍🔬", label: "Scientist (Male)" },
    { emoji: "👩‍🔬", label: "Scientist (Female)" },
    { emoji: "🏥", label: "Hospital" },
    { emoji: "💊", label: "Medicine" },
    { emoji: "🩺", label: "Medical" },
    { emoji: "❤️", label: "Heart" },
    { emoji: "🧠", label: "Brain" },
    { emoji: "💪", label: "Fitness" }
  ];

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "prefer-not-to-say", label: "Prefer not to say" }
  ];

  const languageOptions = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese", 
    "Chinese", "Japanese", "Korean", "Hindi", "Arabic", "Russian"
  ];

  const emotionalBaselines = [
    { value: "calm", label: "Calm" },
    { value: "optimistic", label: "Optimistic" },
    { value: "caring", label: "Caring" },
    { value: "professional", label: "Professional" },
    { value: "energetic", label: "Energetic" },
    { value: "gentle", label: "Gentle" },
    { value: "confident", label: "Confident" },
    { value: "empathetic", label: "Empathetic" },
    { value: "analytical", label: "Analytical" },
    { value: "supportive", label: "Supportive" }
  ];

  const handleInputChange = (field, value) => {
    updateData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.profile_name?.trim()) newErrors.profile_name = "Profile name is required";
    if (!data.name?.trim()) newErrors.name = "Agent name is required";
    if (!data.phone?.trim()) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-validate when required fields change
  const handleRequiredFieldChange = (field, value) => {
    handleInputChange(field, value);
    
    // Clear specific field error when user starts typing
    if (errors[field] && value?.trim()) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 sm:pb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Configure your AI agent's core settings</p>
      </div>

      {/* Avatar Selection */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
        <div className="grid grid-cols-6 gap-2">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.emoji}
              type="button"
              onClick={() => handleInputChange("avatar", avatar.emoji)}
              className={`w-12 h-12 rounded-lg border flex items-center justify-center text-lg transition-all ${
                data.avatar === avatar.emoji
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              title={avatar.label}
            >
              {avatar.emoji}
            </button>
          ))}
        </div>
      </div> */}

      {/* Profile Name and Agent Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Profile Name *
          </label>
          <input
            type="text"
            value={data.profile_name || ""}
            onChange={(e) => handleRequiredFieldChange("profile_name", e.target.value)}
            placeholder="e.g., Health Assistant, Emergency Contact"
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
              errors.profile_name ? "border-red-500" : "border-accent border-accent-top border-accent-left border-accent-right"
            }`}
            required
          />
          {errors.profile_name && (
            <p className="text-red-500 text-xs mt-1">{errors.profile_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Agent Name *
          </label>
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => handleRequiredFieldChange("name", e.target.value)}
            placeholder="e.g., Dr. Sarah, Alex"
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
              errors.name ? "border-red-500" : "border-accent border-accent-top border-accent-left border-accent-right"
            }`}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Age */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            value={data.age || ""}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="e.g., 35"
            min="1"
            max="120"
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => handleRequiredFieldChange("phone", e.target.value)}
            placeholder="e.g., +1 234 567 8900"
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-gray-400 focus:border-gray-400 ${
              errors.phone ? "border-red-500" : "border-accent border-accent-top border-accent-left border-accent-right"
            }`}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={data.gender || ""}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={data.language || "English"}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location and Emotional Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={data.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g., New York, London"
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Emotional Baseline</label>
          <select
            value={data.emotional_baseline || ""}
            onChange={(e) => handleInputChange("emotional_baseline", e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-beige hover:bg-gradient-to-r hover:from-[#E6D3E7] hover:via-[#F6D9D5] hover:to-[#D6E3EC]"
          >
            <option value="">Select baseline mood</option>
            {emotionalBaselines.map((baseline) => (
              <option key={baseline.value} value={baseline.value}>
                {baseline.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={data.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe the purpose and personality of this AI agent..."
          rows={3}
        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none"
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
