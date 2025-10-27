"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OnboardingFlow = ({ onComplete, isCompleting, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // Step 1: Welcome + Gender
    gender: "",
    // Contact
    phone: "",
    
    // Step 2: Age
    age: null,
    ageRange: "",
    customAge: "",
    
    // Step 3: Emotional baseline
    emotional_baseline: "",
    
    // Step 4: Personality traits
    personality_traits: [],
    
    // Step 5: Hobbies and Activities
    hobbies: [],
    
    // Step 6: Professional interests
    professional_interests: [],
    
    // Step 7: Allergies
    allergies: [],
    
    // Step 8: Medical Conditions
    medical_conditions: [],
    
    // Step 9: Health Notes
    health_notes: ""
  });

  const [errors, setErrors] = useState({});

  // EnterHorizon-style minimal 9-step flow - one focus per page
  const steps = [
    { id: 1, title: "Welcome", subtitle: "Let's get started", required: true },
    { id: 2, title: "Age & Phone", subtitle: "A few basics", required: true },
    { id: 3, title: "Emotional Style", subtitle: "Your baseline mood", required: true },
    { id: 4, title: "Personality", subtitle: "What describes you?", required: true },
    { id: 5, title: "Hobbies", subtitle: "What do you enjoy?", required: false },
    { id: 6, title: "Professional", subtitle: "Your career interests", required: false },
    { id: 7, title: "Allergies", subtitle: "Important to know", required: false },
    { id: 8, title: "Medical", subtitle: "Health conditions", required: false },
    { id: 9, title: "Health Notes", subtitle: "Additional details", required: false }
  ];

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`onboarding_progress_${user?.role_entity_id}`);
    if (savedProgress) {
      const { step, data } = JSON.parse(savedProgress);
      setCurrentStep(step || 1);
      setProfileData(prev => ({ ...prev, ...data }));
    }
  }, [user?.role_entity_id]);

  // Save progress to localStorage
  useEffect(() => {
    if (user?.role_entity_id) {
      localStorage.setItem(
        `onboarding_progress_${user.role_entity_id}`,
        JSON.stringify({ step: currentStep, data: profileData })
      );
    }
  }, [currentStep, profileData, user?.role_entity_id]);

  const updateProfileData = (updates) => {
    setProfileData(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    const currentStepData = steps[currentStep - 1];
    
    if (!currentStepData?.required) return true;

    switch (currentStep) {
      case 1: // Welcome + Gender
        if (!profileData.gender) {
          newErrors.gender = "Please select your gender";
        }
        break;
      case 2: // Age
        if (!profileData.age) {
          newErrors.age = "Please enter your age";
        }
        if (!profileData.phone) {
          newErrors.phone = "Please enter your phone number";
        }
        break;
      case 3: // Emotional baseline
        if (!profileData.emotional_baseline) {
          newErrors.emotional_baseline = "Please select your emotional baseline";
        }
        break;
      case 4: // Personality traits
        if (!profileData.personality_traits?.length) {
          newErrors.personality_traits = "Please select at least one trait";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep === steps.length) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Transform data for backend
    const completeProfileData = {
      // Basic Info from user
      profile_name: `${user?.name || "User"}'s Profile`,
      name: user?.name || "",
      phone: profileData.phone || user?.phone || "",
      
      // Collected data
      age: profileData.age,
      gender: profileData.gender,
      personality_traits: profileData.personality_traits || [],
      emotional_baseline: profileData.emotional_baseline || "",
      hobbies: profileData.hobbies || [],
      interests: profileData.professional_interests || [],
      
      // Health info
      health_info: {
        allergies: profileData.allergies || [],
        medical_conditions: profileData.medical_conditions || [],
        health_notes: profileData.health_notes || "",
        age_range: profileData.ageRange
      },
      
      // Initialize empty deferred fields - can be updated later in agent-profiles
      location: null,
      language: "English",
      hates: [],
      loved_ones: [],
      past_stories: [],
      preferences: {
        voice_type: "female",
        conversation_length: "medium",
        reminder_style: "gentle"
      }
    };

    // Clear saved progress
    if (user?.role_entity_id) {
      localStorage.removeItem(`onboarding_progress_${user.role_entity_id}`);
    }

    await onComplete(completeProfileData);
  };

  const genderOptions = [
    { value: "male", label: "Male", icon: () => (
      <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 100 100" fill="none">
        {/* Male figure with colorful gradient */}
        <defs>
          <linearGradient id="maleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        {/* Head */}
        <circle cx="50" cy="25" r="12" fill="url(#maleGradient)" />
        {/* Body */}
        <rect x="42" y="37" width="16" height="25" rx="3" fill="url(#maleGradient)" />
        {/* Arms */}
        <rect x="32" y="42" width="8" height="15" rx="4" fill="url(#maleGradient)" />
        <rect x="60" y="42" width="8" height="15" rx="4" fill="url(#maleGradient)" />
        {/* Legs */}
        <rect x="44" y="62" width="5" height="20" rx="2.5" fill="url(#maleGradient)" />
        <rect x="51" y="62" width="5" height="20" rx="2.5" fill="url(#maleGradient)" />
        {/* Male symbol */}
        <circle cx="75" cy="20" r="6" fill="none" stroke="#3B82F6" strokeWidth="2" />
        <path d="M79 16 L85 10 M85 10 L85 16 M85 10 L79 10" stroke="#3B82F6" strokeWidth="2" fill="none" />
      </svg>
    ) },
    { value: "female", label: "Female", icon: () => (
      <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 100 100" fill="none">
        {/* Female figure with colorful gradient */}
        <defs>
          <linearGradient id="femaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
        </defs>
        {/* Head */}
        <circle cx="50" cy="25" r="12" fill="url(#femaleGradient)" />
        {/* Hair/bow */}
        <path d="M38 20 Q42 15 50 18 Q58 15 62 20" fill="url(#femaleGradient)" />
        {/* Body (dress shape) */}
        <path d="M42 37 L58 37 L62 55 L38 55 Z" fill="url(#femaleGradient)" />
        {/* Arms */}
        <rect x="32" y="42" width="8" height="15" rx="4" fill="url(#femaleGradient)" />
        <rect x="60" y="42" width="8" height="15" rx="4" fill="url(#femaleGradient)" />
        {/* Legs */}
        <rect x="44" y="55" width="5" height="20" rx="2.5" fill="url(#femaleGradient)" />
        <rect x="51" y="55" width="5" height="20" rx="2.5" fill="url(#femaleGradient)" />
        {/* Female symbol */}
        <circle cx="75" cy="18" r="6" fill="none" stroke="#EC4899" strokeWidth="2" />
        <path d="M75 24 L75 30 M72 27 L78 27" stroke="#EC4899" strokeWidth="2" />
      </svg>
    ) },
    { value: "other", label: "Other", icon: () => (
      <svg className="w-16 h-16 mx-auto mb-3" viewBox="0 0 100 100" fill="none">
        {/* Non-binary/other figure with rainbow gradient */}
        <defs>
          <linearGradient id="otherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="25%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="75%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
        {/* Head */}
        <circle cx="50" cy="25" r="12" fill="url(#otherGradient)" />
        {/* Body */}
        <rect x="42" y="37" width="16" height="25" rx="3" fill="url(#otherGradient)" />
        {/* Arms */}
        <rect x="32" y="42" width="8" height="15" rx="4" fill="url(#otherGradient)" />
        <rect x="60" y="42" width="8" height="15" rx="4" fill="url(#otherGradient)" />
        {/* Legs */}
        <rect x="44" y="62" width="5" height="20" rx="2.5" fill="url(#otherGradient)" />
        <rect x="51" y="62" width="5" height="20" rx="2.5" fill="url(#otherGradient)" />
        {/* Non-binary symbol (circle with mixed symbols) */}
        <circle cx="75" cy="20" r="8" fill="none" stroke="url(#otherGradient)" strokeWidth="2" />
        <path d="M70 15 L80 25 M70 25 L80 15" stroke="url(#otherGradient)" strokeWidth="2" />
      </svg>
    ) }
  ];

  const emotionalOptions = [
    { value: "very-positive", label: "Very Positive", emoji: "😊", desc: "Generally upbeat and optimistic" },
    { value: "positive", label: "Positive", emoji: "🙂", desc: "Usually in good spirits" },
    { value: "neutral", label: "Neutral", emoji: "😐", desc: "Balanced and steady" },
    { value: "variable", label: "Variable", emoji: "🔄", desc: "Changes with circumstances" },
    { value: "low", label: "Low", emoji: "😔", desc: "Often feeling down" }
  ];

  const traitOptions = [
    { value: "introverted", label: "Introverted", desc: "Prefer quiet environments" },
    { value: "extroverted", label: "Extroverted", desc: "Energized by social interaction" },
    { value: "analytical", label: "Analytical", desc: "Think things through logically" },
    { value: "creative", label: "Creative", desc: "Love artistic expression" },
    { value: "empathetic", label: "Empathetic", desc: "Understand others' feelings" },
    { value: "organized", label: "Organized", desc: "Keep things structured" },
    { value: "spontaneous", label: "Spontaneous", desc: "Go with the flow" },
    { value: "optimistic", label: "Optimistic", desc: "See the bright side" }
  ];

  const hobbyOptions = [
    "Reading", "Exercise", "Cooking", "Music", "Gardening", "Travel", "Photography", "Art", "Sports", "Gaming"
  ];

  const professionalOptions = [
    "Technology", "Healthcare", "Education", "Business", "Arts", "Science", "Finance", "Marketing", "Engineering", "Other"
  ];

  const allergyOptions = [
    "Peanuts", "Tree Nuts", "Shellfish", "Dairy", "Eggs", "Soy", "Gluten", "Pollen", "Dust Mites", "Pet Dander"
  ];

  const medicalOptions = [
    "Hypertension", "Diabetes", "Asthma", "Allergies", "Heart Disease", "Arthritis", "Depression", "Anxiety", "Other"
  ];

    const renderStep = () => {
  const currentStepData = steps[currentStep - 1];
    
    switch (currentStep) {
      case 1: // Welcome + Gender
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-light text-gray-900">Welcome to your health companion</h1>
              <p className="text-gray-500 text-lg leading-relaxed">Let's personalize your experience with a few quick questions</p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">How do you identify?</h2>
              <div className="grid grid-cols-3 gap-4">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateProfileData({ gender: option.value })}
                    className={`p-6 rounded-none border-2 transition-all duration-200 hover:scale-[1.02] ${
                      profileData.gender === option.value
                        ? 'border-gray-300 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {option.icon && <option.icon />}
                    <span className="text-base font-medium text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-sm mt-3">{errors.gender}</p>}
            </div>
          </div>
        );

      case 2: // Age & Phone
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-light text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-500 text-base">{currentStepData.subtitle}</p>
            </div>
            
            <div className="space-y-4">
              {/* Custom input option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type your age</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={profileData.customAge || ''}
                  onChange={(e) => {
                    const customAge = e.target.value;
                    updateProfileData({ 
                      customAge, 
                      age: customAge ? parseInt(customAge) : null, 
                      ageRange: '' 
                    });
                  }}
                  placeholder="Enter your age"
                  className="w-full p-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
                />
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={profileData.phone}
                  onChange={(e) => updateProfileData({ phone: e.target.value })}
                  placeholder="e.g. 555 123 4567"
                  className="w-full p-3 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
                />
                {(errors.phone) && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
              </div>
            </div>
            {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
          </div>
        );

            case 3: // Emotional Baseline
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl font-medium text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
            </div>
            
            <div className="space-y-2">
              {emotionalOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateProfileData({ emotional_baseline: option.value })}
                  className={`w-full p-3 rounded-none border transition-all duration-200 hover:scale-[1.02] ${
                    profileData.emotional_baseline === option.value
                      ? 'border-gray-300 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{option.emoji}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.emotional_baseline && <p className="text-red-500 text-xs">{errors.emotional_baseline}</p>}
          </div>
        );

      case 4: // Personality Traits
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl font-medium text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {traitOptions.map((trait) => {
                const isSelected = profileData.personality_traits.includes(trait.value);
                return (
                  <button
                    key={trait.value}
                    onClick={() => {
                      const newTraits = isSelected
                        ? profileData.personality_traits.filter(t => t !== trait.value)
                        : [...profileData.personality_traits, trait.value];
                      updateProfileData({ personality_traits: newTraits });
                    }}
                    className={`p-3 rounded-none border transition-all duration-200 hover:scale-[1.02] ${
                      isSelected
                        ? 'border-gray-300 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{trait.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{trait.desc}</div>
                      <div className={`w-4 h-4 rounded-full border transition-colors mx-auto mt-2 ${
                        isSelected ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-gray-300' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.personality_traits && <p className="text-red-500 text-xs">{errors.personality_traits}</p>}
          </div>
        );

      case 5: // Hobbies
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl font-medium text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {hobbyOptions.map((hobby) => {
                const isSelected = profileData.hobbies.includes(hobby);
                return (
                  <button
                    key={hobby}
                    onClick={() => {
                      const newHobbies = isSelected
                        ? profileData.hobbies.filter(h => h !== hobby)
                        : [...profileData.hobbies, hobby];
                      updateProfileData({ hobbies: newHobbies });
                    }}
                    className={`px-3 py-1.5 rounded-none border text-sm transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'border-gray-300 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {hobby}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 6: // Professional Interests
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl font-medium text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {professionalOptions.map((interest) => {
                const isSelected = profileData.professional_interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => {
                      const newInterests = isSelected
                        ? profileData.professional_interests.filter(i => i !== interest)
                        : [...profileData.professional_interests, interest];
                      updateProfileData({ professional_interests: newInterests });
                    }}
                    className={`px-3 py-1.5 rounded-none border text-sm transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 7: // Allergies
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl font-medium text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {allergyOptions.map((allergy) => {
                const isSelected = profileData.allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    onClick={() => {
                      const newAllergies = isSelected
                        ? profileData.allergies.filter(a => a !== allergy)
                        : [...profileData.allergies, allergy];
                      updateProfileData({ allergies: newAllergies });
                    }}
                    className={`px-3 py-1.5 rounded-none border text-sm transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 8: // Medical Conditions
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl font-medium text-gray-900">{currentStepData.title}</h1>
              <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {medicalOptions.map((condition) => {
                const isSelected = profileData.medical_conditions.includes(condition);
                return (
                  <button
                    key={condition}
                    onClick={() => {
                      const newConditions = isSelected
                        ? profileData.medical_conditions.filter(c => c !== condition)
                        : [...profileData.medical_conditions, condition];
                      updateProfileData({ medical_conditions: newConditions });
                    }}
                    className={`px-3 py-1.5 rounded-none border text-sm transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>
          </div>
        );

            case 9: // Health Notes
        return (
          <div className="space-y-6">
            
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-xl font-medium text-gray-900">{currentStepData.title}</h1>
                <p className="text-gray-600 text-sm">{currentStepData.subtitle}</p>
              </div>
              
              <div className="space-y-3">
                <textarea
                  value={profileData.health_notes}
                  onChange={(e) => updateProfileData({ health_notes: e.target.value })}
                  placeholder="Share any additional health information..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:border-gray-400 focus:outline-none transition-colors text-sm"
                />
                <p className="text-xs text-gray-500">This information is kept private and secure</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

      return (
    <div className="min-h-screen bg-white">
      {/* Main content - positioned at top like EnterHorizon */}
      <div className="flex justify-center pt-16 px-4">
        <div className="w-full max-w-md">
          
          {/* Minimal progress bar with back button */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="flex items-center space-x-1 flex-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      index < currentStep ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Clean content without card styling */}
          <div className="bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation - positioned at bottom */}
            <div className="flex items-center justify-between mt-12 pt-8">
              <div className="flex items-center gap-4">
                {!steps[currentStep - 1]?.required && currentStep < steps.length && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
                  >
                    Skip
                  </button>
                )}
              </div>
              
              <button
                onClick={handleNext}
                disabled={isCompleting}
                className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold"
              >
                {isCompleting ? "Processing..." : currentStep === steps.length ? "Complete" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;