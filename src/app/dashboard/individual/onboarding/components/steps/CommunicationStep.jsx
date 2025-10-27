"use client";


const CommunicationStep = ({ data, updateData, errors }) => {
  const communicationTimes = [
    { value: "morning", label: "Morning (6 AM - 12 PM)", emoji: "☀️" },
    { value: "afternoon", label: "Afternoon (12 PM - 6 PM)", emoji: "🌤️" },
    { value: "evening", label: "Evening (6 PM - 10 PM)", emoji: "🌙" },
    { value: "anytime", label: "Anytime", emoji: "⏰" }
  ];

  const communicationStyles = [
    { value: "friendly", label: "Friendly", emoji: "😊", description: "Warm, approachable, easy to understand" },
    { value: "empathetic", label: "Empathetic", emoji: "🤗", description: "Emotional support, understanding tone" },
    { value: "direct", label: "Direct", emoji: "🎯", description: "Clear, concise, to-the-point" },
    { value: "encouraging", label: "Encouraging", emoji: "🚀", description: "Positive, uplifting, motivating" }
  ];

  const getProgressPercentage = () => {
    let filledCount = 0;
    if (data.preferred_communication_time) filledCount++;
    if (data.communication_style) filledCount++;
    return Math.round((filledCount / 2) * 100);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Compact Header */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">💬</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Communication Preferences</h2>
        <p className="text-sm text-gray-600 mb-4">How and when do you prefer to connect?</p>
        
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
        {/* Preferred Communication Time */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <span>⏰</span>
            When are you most receptive to communication?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {communicationTimes.map((time) => (
              <button
                key={time.value}
                type="button"
                onClick={() => updateData({ preferred_communication_time: time.value })}
                className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center text-center ${
                  data.preferred_communication_time === time.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">{time.emoji}</div>
                <div className="text-xs font-medium">{time.label}</div>
              </button>
            ))}
          </div>
          {errors.preferred_communication_time && (
            <p className="text-red-600 text-xs mt-2 text-center flex items-center justify-center gap-1">
              <span>⚠️</span> {errors.preferred_communication_time}
            </p>
          )}
        </div>

        {/* Communication Style */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <span>🗣️</span>
            What communication style do you prefer?
          </label>
          <div className="grid grid-cols-1 gap-2">
            {communicationStyles.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => updateData({ communication_style: style.value })}
                className={`p-3 rounded-lg border text-xs font-medium transition-all flex items-center gap-3 ${
                  data.communication_style === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-lg">{style.emoji}</div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-medium">{style.label}</div>
                  <p className="text-xs text-gray-500">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <span className="text-green-600">🔒</span>
            <span className="text-xs text-gray-600 font-medium">
              This helps tailor your AI's tone and timing.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationStep;