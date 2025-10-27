
"use client";

import { useState, useEffect } from "react";

const HealthPreferencesForm = ({ data = {}, updateData }) => {
  const [healthInfo, setHealthInfo] = useState(
    typeof data.health_info === "object" ? data.health_info : {}
  );
  const [preferences, setPreferences] = useState(
    typeof data.preferences === "object" ? data.preferences : {}
  );

  // Keep local state in sync when parent data changes (prevents lost values on revisit)
  useEffect(() => {
    setHealthInfo(typeof data.health_info === "object" ? data.health_info : {});
  }, [data.health_info]);

  useEffect(() => {
    setPreferences(typeof data.preferences === "object" ? data.preferences : {});
  }, [data.preferences]);

  const updateHealthInfo = (field, value) => {
    const updated = { ...healthInfo, [field]: value };
    setHealthInfo(updated);
    updateData({ health_info: updated });
  };

  const updatePreferences = (field, value) => {
    const updated = { ...preferences, [field]: value };
    setPreferences(updated);
    updateData({ preferences: updated });
  };

  // const communicationStyles = [
  //   { value: "professional", label: "Professional", desc: "Medical terminology, formal tone" },
  //   { value: "friendly", label: "Friendly", desc: "Warm, approachable, easy to understand" },
  //   { value: "empathetic", label: "Empathetic", desc: "Emotional support, understanding tone" },
  //   { value: "direct", label: "Direct", desc: "Clear, concise, to-the-point" },
  //   { value: "encouraging", label: "Encouraging", desc: "Positive, uplifting, motivating" }
  // ];

  // const voiceGenders = [
  //   { value: "female", label: "Female Voice" },
  //   { value: "male", label: "Male Voice" },
  //   { value: "neutral", label: "Gender Neutral" },
  //   { value: "no_preference", label: "No Preference" }
  // ];

  // const callTimes = [
  //   { value: "morning", label: "Morning (6 AM - 12 PM)" },
  //   { value: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
  //   { value: "evening", label: "Evening (6 PM - 10 PM)" },
  //   { value: "anytime", label: "Anytime" }
  // ];

  // const urgencyLevels = [
  //   { value: "low", label: "Low - Routine check-ins only" },
  //   { value: "medium", label: "Medium - Important health updates" },
  //   { value: "high", label: "High - Urgent health matters" },
  //   { value: "emergency", label: "Emergency - Critical situations only" }
  // ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Health & Preferences</h2>
        <p className="text-sm text-gray-600 mt-1">Configure communication style and health information</p>
      </div>


      {/* Health Information */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-red-500">🏥</span>
          Health Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Age Range
            </label>
            <select
              value={healthInfo.age_range || ""}
              onChange={(e) => updateHealthInfo("age_range", e.target.value)}
              className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm bg-beige hover:bg-gradient-to-r hover:from-[#E6D3E7] hover:via-[#F6D9D5] hover:to-[#D6E3EC]"
            >
              <option value="">Select age range</option>
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="35-44">35–44</option>
              <option value="45-54">45–54</option>
              <option value="55-64">55–64</option>
              <option value="65+">65+</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={healthInfo.allergies?.join(", ") || ""}
              onChange={(e) => updateHealthInfo("allergies", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="e.g., Peanuts, Shellfish, Latex"
              className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Current Medications (comma-separated)
            </label>
            <input
              type="text"
              value={healthInfo.medications?.join(", ") || ""}
              onChange={(e) => updateHealthInfo("medications", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="e.g., Vitamin D, Aspirin"
              className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Medical Conditions (comma-separated)
            </label>
            <input
              type="text"
              value={healthInfo.conditions?.join(", ") || ""}
              onChange={(e) => updateHealthInfo("conditions", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="e.g., Diabetes, Hypertension"
              className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Health Notes
            </label>
            <textarea
              value={healthInfo.notes || ""}
              onChange={(e) => updateHealthInfo("notes", e.target.value)}
              placeholder="Additional health information..."
              rows={2}
              className="w-full px-3 py-2 border-accent border-accent-top border-accent-left border-accent-right focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-yellow-500">🔔</span>
          Notification Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reminder_notifications"
              checked={preferences.reminder_notifications || false}
              onChange={(e) => updatePreferences("reminder_notifications", e.target.checked)}
              className="w-4 h-4 text-gray-600"
            />
            <label htmlFor="reminder_notifications" className="text-sm text-gray-700">
              Send medication/appointment reminders
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="wellness_tips"
              checked={preferences.wellness_tips || false}
              onChange={(e) => updatePreferences("wellness_tips", e.target.checked)}
              className="w-4 h-4 text-gray-600"
            />
            <label htmlFor="wellness_tips" className="text-sm text-gray-700">
              Receive wellness tips and insights
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-accent border-accent-top border-accent-left border-accent-right p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-gray-800 text-xs">🔒</span>
          </div>
          <div className="text-sm text-gray-800">
            <p className="font-medium mb-1">Privacy & Security:</p>
            <p>All health information is encrypted and stored securely. Your data is never shared without consent, and you can update or delete information anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPreferencesForm;