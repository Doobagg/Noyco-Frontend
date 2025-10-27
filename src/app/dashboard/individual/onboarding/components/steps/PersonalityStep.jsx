"use client";

const PersonalityStep = ({ data, updateData, errors }) => {
  const personalityTraits = [
    { value: "empathetic", label: "Empathetic", emoji: "❤️", description: "Understanding and caring" },
    { value: "optimistic", label: "Optimistic", emoji: "🌟", description: "Positive and hopeful" },
    { value: "analytical", label: "Analytical", emoji: "🧠", description: "Logical and detail-oriented" },
    { value: "creative", label: "Creative", emoji: "🎨", description: "Imaginative and innovative" },
    { value: "patient", label: "Patient", emoji: "🧘", description: "Calm and understanding" },
    { value: "energetic", label: "Energetic", emoji: "⚡", description: "Lively and enthusiastic" },
    { value: "supportive", label: "Supportive", emoji: "🤝", description: "Helpful and encouraging" },
    { value: "gentle", label: "Gentle", emoji: "🕊️", description: "Kind and soft-spoken" }
  ];

  const emotionalBaselines = [
    { value: "calm", label: "Calm & Peaceful", emoji: "😌", description: "Steady and tranquil" },
    { value: "optimistic", label: "Optimistic & Hopeful", emoji: "😊", description: "Positive outlook" },
    { value: "caring", label: "Caring & Nurturing", emoji: "🤗", description: "Warm and supportive" },
    { value: "energetic", label: "Energetic & Upbeat", emoji: "⚡", description: "High energy and enthusiasm" },
    { value: "gentle", label: "Gentle & Understanding", emoji: "🕊️", description: "Soft and compassionate" }
  ];

  const handleTraitToggle = (trait) => {
    const currentTraits = data.personality_traits || [];
    if (currentTraits.includes(trait)) {
      updateData({ personality_traits: currentTraits.filter(t => t !== trait) });
    } else {
      updateData({ personality_traits: [...currentTraits, trait] });
    }
  };

  const getProgressPercentage = () => {
    let filledCount = 0;
    if (data.personality_traits && data.personality_traits.length > 0) filledCount++;
    if (data.emotional_baseline) filledCount++;
    return Math.round((filledCount / 2) * 100);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Compact Header */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">🧠</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Personality</h2>
        <p className="text-sm text-gray-600 mb-4">Help us understand your core traits and style.</p>
        
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
        {/* Personality Traits */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <span>✨</span>
            Select a few traits that describe you:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {personalityTraits.map((trait) => (
              <button
                key={trait.value}
                type="button"
                onClick={() => handleTraitToggle(trait.value)}
                className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center text-center ${
                  data.personality_traits?.includes(trait.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">{trait.emoji}</div>
                <div className="text-xs font-medium">{trait.label}</div>
                <p className="text-xs text-gray-500 mt-0.5">{trait.description}</p>
              </button>
            ))}
          </div>
          {errors.personality_traits && (
            <p className="text-red-600 text-xs mt-2 text-center flex items-center justify-center gap-1">
              <span>⚠️</span> {errors.personality_traits}
            </p>
          )}
        </div>

        {/* Emotional Baseline */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <span>😌</span>
            What's your general emotional baseline?
          </label>
          <div className="grid grid-cols-1 gap-2">
            {emotionalBaselines.map((baseline) => (
              <button
                key={baseline.value}
                type="button"
                onClick={() => updateData({ emotional_baseline: baseline.value })}
                className={`p-3 rounded-lg border text-xs font-medium transition-all flex items-center gap-3 ${
                  data.emotional_baseline === baseline.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-lg">{baseline.emoji}</div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-medium">{baseline.label}</div>
                  <p className="text-xs text-gray-500">{baseline.description}</p>
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
              This helps tailor your AI's responses.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityStep;