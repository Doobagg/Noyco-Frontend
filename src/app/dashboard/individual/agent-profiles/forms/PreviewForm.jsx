

"use client";

import { useState } from "react";
import { CheckCircle, Edit3, User, Heart, Brain, Users, Shield, Loader2 } from 'lucide-react';

const PreviewForm = ({ data, updateData, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log the data to see what we're working with
  console.log('PreviewForm received data:', data);
  console.log(updateData);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields before saving
      if (!data.profile_name?.trim()) {
        alert('Profile name is required');
        return;
      }
      if (!data.name?.trim()) {
        alert('Agent name is required');
        return;
      }
      if (!data.phone?.trim()) {
        alert('Phone number is required');
        return;
      }
      
      await onSave();
    } finally {
      setIsLoading(false);
    }
  };

  const formatArrayValue = (value, limit = 3) => {
    if (Array.isArray(value) && value.length > 0) {
      const items = value.slice(0, limit);
      return items.join(", ") + (value.length > limit ? "..." : "");
    }
    return "Not specified";
  };

  // const formatTextValue = (value, limit = 100) => {
  //   if (!value) return "Not provided";
  //   return value.length > limit ? value.substring(0, limit) + "..." : value;
  // };

  const formatLovedOnes = (lovedOnes, limit = 3) => {
    if (Array.isArray(lovedOnes) && lovedOnes.length > 0) {
      const items = lovedOnes.slice(0, limit).map(person => 
        person.relation ? `${person.name} (${person.relation})` : person.name
      );
      return items.join(", ") + (lovedOnes.length > limit ? "..." : "");
    }
    return "Not specified";
  };

  const formatPastStories = (stories, limit = 2) => {
    if (Array.isArray(stories) && stories.length > 0) {
      const items = stories.slice(0, limit).map(story => 
        story.title || story.description?.substring(0, 30) + "..."
      );
      return items.join(", ") + (stories.length > limit ? "..." : "");
    }
    return "Not specified";
  };

  const getHealthInfo = () => {
    if (typeof data.health_info === "object" && data.health_info) {
      return data.health_info;
    }
    return {};
  };

  const getPreferences = () => {
    if (typeof data.preferences === "object" && data.preferences) {
      return data.preferences;
    }
    return {};
  };

  const healthInfo = getHealthInfo();
  const preferences = getPreferences();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
      
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Review Your Agent Profile
        </h2>
        <p className="text-gray-600 text-sm">
          Review your information before creating your AI agent.
        </p>
      </div>

      <div className="space-y-4">
        {/* Basic Information & Personality Combined */}
        <div className="bg-beige border border-accent p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800">
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-gray-500">Profile Name</label>
                  <p className="text-gray-900">{data.profile_name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Agent Name</label>
                  <p className="text-gray-900">{data.name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Age</label>
                  <p className="text-gray-900">{data.age || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Phone *</label>
                  {(() => {
                    const hasPhone = data.phone && String(data.phone).trim() !== '';
                    return (
                      <p className={`text-gray-900 ${!hasPhone ? 'text-red-500 font-medium' : ''}`}>
                        {hasPhone ? data.phone : "Required - Please provide phone number"}
                      </p>
                    );
                  })()}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900 capitalize">{data.gender || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{data.location || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Language</label>
                  <p className="text-gray-900">{data.language || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Personality */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <h3 className="text-base font-semibold text-gray-900">Personality</h3>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800">
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs font-medium text-gray-500">Traits</label>
                  <p className="text-gray-900">{formatArrayValue(data.personality_traits)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Interests</label>
                  <p className="text-gray-900">{formatArrayValue(data.interests)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Hobbies</label>
                  <p className="text-gray-900">{formatArrayValue(data.hobbies)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Dislikes</label>
                  <p className="text-gray-900">{formatArrayValue(data.hates)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health & Relationships Combined */}
        <div className="bg-beige border border-accent p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <h3 className="text-base font-semibold text-gray-900">Health Info</h3>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800">
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs font-medium text-gray-500">Allergies</label>
                  <p className="text-gray-900">{formatArrayValue(healthInfo.allergies) || "None"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Medications</label>
                  <p className="text-gray-900">{formatArrayValue(healthInfo.medications) || "None"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Conditions</label>
                  <p className="text-gray-900">{formatArrayValue(healthInfo.conditions) || "None"}</p>
                </div>
                {healthInfo.notes && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Health Notes</label>
                    <p className="text-gray-900">{healthInfo.notes}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-500">Emotional Baseline</label>
                  <p className="text-gray-900 capitalize">{data.emotional_baseline || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Relationships */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <h3 className="text-base font-semibold text-gray-900">Important People</h3>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800">
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs font-medium text-gray-500">Loved Ones</label>
                  <p className="text-gray-900">{formatLovedOnes(data.loved_ones)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Past Stories</label>
                  <p className="text-gray-900">{formatPastStories(data.past_stories)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-beige border border-accent p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">⚙</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Preferences</h3>
            </div>
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800">
              <Edit3 className="w-3 h-3" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium text-gray-900 capitalize">
                {preferences.communication_style?.replace("_", " ") || "Not set"}
              </p>
              <p className="text-xs text-gray-500">Style</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900 capitalize">
                {preferences.voice_gender?.replace("_", " ") || "Not set"}
              </p>
              <p className="text-xs text-gray-500">Voice</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900 capitalize">
                {preferences.call_time || "Not set"}
              </p>
              <p className="text-xs text-gray-500">Time</p>
            </div>
          </div>

          {(preferences.reminder_notifications || preferences.wellness_tips || preferences.emergency_contact) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex gap-2 flex-wrap">
                {preferences.reminder_notifications && (
                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800">Reminders</span>
                )}
                {preferences.wellness_tips && (
                  <span className="px-2 py-1 rounded-md text-xs bg-green-100 text-green-800">Wellness</span>
                )}
                {preferences.emergency_contact && (
                  <span className="px-2 py-1 rounded-md text-xs bg-red-100 text-red-800">Emergency Contact</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border border-accent p-3">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-gray-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-1">Privacy & Security</h4>
            <p className="text-xs text-gray-800">Your data is encrypted, used only for AI personalization, and never shared.</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-semibold
                   hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-gray-200
                   flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Create Agent Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PreviewForm;