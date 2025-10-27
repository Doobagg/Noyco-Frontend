"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import BasicInfoForm from "../forms/BasicInfoForm";
import PersonalityForm from "../forms/PersonalityForm";
import RelationshipsForm from "../forms/RelationshipsForm";
import StoriesForm from "../forms/StoriesForm";
import HealthPreferencesForm from "../forms/HealthPreferencesForm";
import PreviewForm from "../forms/PreviewForm";

const ProfileCreator = ({ profile, isEdit, onBack, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    profile_name: "",
    name: "",
    description: "",
    avatar: "🤖",
    age: "",
    gender: "",
    phone: "",
    location: "",
    language: "English",
    emotional_baseline: "",
    personality_traits: [],
    hobbies: [],
    interests: [],
    hates: [],
    loved_ones: [],
    past_stories: [],
    health_info: {},
    preferences: {},
  });
  // const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 1, title: "Basic Info", icon: "👤", component: BasicInfoForm },
    { id: 2, title: "Personality", icon: "🧠", component: PersonalityForm },
    { id: 3, title: "Relationships", icon: "❤️", component: RelationshipsForm },
    { id: 4, title: "Stories", icon: "📖", component: StoriesForm },
    { id: 5, title: "Health & Preferences", icon: "🏥", component: HealthPreferencesForm },
    { id: 6, title: "Preview", icon: "👁️", component: PreviewForm },
  ];

  useEffect(() => {
    if (isEdit && profile) {
      setProfileData({
        profile_name: profile.profile_name || profile.name || "",
        name: profile.name || "",
        description: profile.description || "",
        avatar: profile.avatar || "🤖",
        age: profile.age || "",
        gender: profile.gender || "",
        phone: profile.phone || "",
        location: profile.location || "",
        language: profile.language || "English",
        emotional_baseline: profile.emotional_baseline || "",
        personality_traits: profile.personality_traits || [],
        hobbies: profile.hobbies || [],
        interests: profile.interests || [],
        hates: profile.hates || [],
        loved_ones: profile.loved_ones || [],
        past_stories: profile.past_stories || [],
        health_info: profile.health_info || {},
        preferences: profile.preferences || {},
      });
    }
  }, [isEdit, profile]);

  const handleNext = () => {
    // Validate required fields on step 1 (Basic Info)
    if (currentStep === 1) {
      if (!profileData.profile_name?.trim()) {
        alert('Profile name is required before proceeding');
        return;
      }
      if (!profileData.name?.trim()) {
        alert('Agent name is required before proceeding');
        return;
      }
      if (!profileData.phone?.trim()) {
        alert('Phone number is required before proceeding');
        return;
      }
    }
    
    // Auto-add relationship if on Relationships step and form has data but not saved
    // if (currentStep === 3) {
    //   const hasUnsavedLovedOne = Array.isArray(profileData.loved_ones) && profileData.loved_ones.some(lo => lo && lo.__unsaved);
    //   // No-op: relationships form manages its own state; ensure at least placeholder save when moving next if user entered data
    // }

    // // Auto-add story if on Stories step and fields are filled but not added yet
    // if (currentStep === 4) {
    //   // StoriesForm handles add when clicking its button; here we do nothing because we don't have the local newStory
    //   // The actual auto-add is handled inside StoriesForm when Next is pressed via window event
    // }

    // Broadcast an event so child forms (e.g., StoriesForm) can persist unsaved entries
    if (typeof window !== 'undefined') {
      const evt = new Event('profileCreator:next');
      window.dispatchEvent(evt);
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    // setIsLoading(true);
    try {
      // Validate required fields
      // If profile_name is empty, default it to agent name
      const cleanedProfileName = profileData.profile_name?.trim();
      const cleanedAgentName = profileData.name?.trim();

      if (!cleanedAgentName) {
        alert('Agent name is required');
        // setIsLoading(false);
        return;
      }

      const finalProfileName = cleanedProfileName || cleanedAgentName;
      
      if (!profileData.phone?.trim()) {
        alert('Phone number is required');
        // setIsLoading(false);
        return;
      }

      // Transform frontend data to backend format
      // Sanitize stories: drop empty optional fields like empty date
      const sanitizedStories = (Array.isArray(profileData.past_stories) ? profileData.past_stories : []).map(s => {
        const cleaned = { ...s };
        if (!cleaned.date || String(cleaned.date).trim() === "") {
          delete cleaned.date;
        }
        return cleaned;
      });

      const apiData = {
        profile_name: finalProfileName,
        name: cleanedAgentName,
        phone: profileData.phone.trim(), // Required field
        age: profileData.age && !isNaN(parseInt(profileData.age)) ? parseInt(profileData.age) : undefined,
        gender: profileData.gender || undefined,
        location: profileData.location || undefined,
        language: profileData.language || undefined,
        hobbies: Array.isArray(profileData.hobbies) ? profileData.hobbies : [],
        hates: Array.isArray(profileData.hates) ? profileData.hates : [],
        interests: Array.isArray(profileData.interests) ? profileData.interests : [],
        loved_ones: Array.isArray(profileData.loved_ones) ? profileData.loved_ones : [],
        past_stories: sanitizedStories,
        preferences: typeof profileData.preferences === 'object' ? profileData.preferences : {},
        personality_traits: Array.isArray(profileData.personality_traits) ? profileData.personality_traits : [],
        health_info: typeof profileData.health_info === 'object' ? profileData.health_info : {},
        emotional_baseline: profileData.emotional_baseline || undefined,
      };

      // Remove undefined values to avoid sending unnecessary data
      // But keep required fields (profile_name, name, phone) even if empty
      const requiredFields = ['profile_name', 'name', 'phone'];
      Object.keys(apiData).forEach(key => {
        if (!requiredFields.includes(key) && (apiData[key] === undefined || apiData[key] === '' || apiData[key] === null)) {
          delete apiData[key];
        }
      });

      console.log('DEBUG - ProfileCreator handleSave called');
      console.log('DEBUG - profileData before transform:', profileData);
      console.log('DEBUG - Final API data being sent:', apiData);
      
      console.log(isEdit ? "Updating profile:" : "Creating profile:", apiData);
      onSave(apiData);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile: " + error.message);
    } finally {
      // setIsLoading(false);
    }
  };

  const updateProfileData = (updates) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
        >
          <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Profiles</span>
        </button>
        
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? "Edit Agent Profile" : "Create New Agent Profile"}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {isEdit ? "Update your agent's personality and preferences" : "Design a personalized AI agent for your health journey"}
        </p>
      </div>

      {/* Progress Steps */}
      {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep > step.id 
                  ? "bg-green-500 border-green-500 text-white" 
                  : currentStep === step.id
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-400"
              }`}>
                {currentStep > step.id ? (
                  <CheckIcon className="w-6 h-6" />
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>
              
              <div className="ml-3 min-w-0">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                }`}>
                  Step {step.id}
                </p>
                <p className={`text-sm ${
                  currentStep >= step.id ? "text-gray-600" : "text-gray-400"
                }`}>
                  {step.title}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div> */}

      {/* Form Content */}
      <div className="bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
        {CurrentStepComponent && (
          <CurrentStepComponent
            data={profileData}
            updateData={updateProfileData}
            isEdit={isEdit}
            onSave={currentStep === 6 ? handleSave : undefined}
          />
        )}
      </div>

      {/* Navigation */}
      {!isLastStep && (
        <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-200 ${
              isFirstStep
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Previous</span>
            <span className="xs:hidden">Prev</span>
          </button>

          <div className="text-xs sm:text-sm text-gray-500">
            {currentStep} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Next</span>
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Show navigation for last step but only Previous button */}
      {isLastStep && (
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Previous</span>
            <span className="xs:hidden">Prev</span>
          </button>

          <div className="text-xs sm:text-sm text-gray-500">
            {currentStep} of {steps.length}
          </div>

          <div className="w-16 sm:w-32"></div> {/* Spacer */}
        </div>
      )}
    </div>
  );
};

export default ProfileCreator;
