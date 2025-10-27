"use client";

const EmergencyContactStep = ({ data, updateData, errors }) => {
  const relationshipOptions = [
    "Spouse", "Parent", "Child", "Sibling", "Friend", "Doctor", "Caregiver", "Other"
  ];

  const handleInputChange = (field, value) => {
    updateData({ emergency_contact: { ...data.emergency_contact, [field]: value } });
  };

  const getProgressPercentage = () => {
    let filledCount = 0;
    if (data.emergency_contact?.name?.trim()) filledCount++;
    if (data.emergency_contact?.relationship?.trim()) filledCount++;
    if (data.emergency_contact?.phone?.trim()) filledCount++;
    return Math.round((filledCount / 3) * 100);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Compact Header */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">🚨</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Emergency Contact</h2>
        <p className="text-sm text-gray-600 mb-4">Who should we contact in case of an emergency?</p>
        
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

      <div className="space-y-4">
        {/* Contact Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span>👤</span>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.emergency_contact?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Jane Doe"
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              errors.emergency_contact ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.emergency_contact && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.emergency_contact}
            </p>
          )}
        </div>

        {/* Relationship */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span>❤️</span>
            Relationship to you
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {relationshipOptions.slice(0, 6).map((relationship) => (
              <button
                key={relationship}
                type="button"
                onClick={() => handleInputChange("relationship", relationship)}
                className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                  data.emergency_contact?.relationship === relationship
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                {relationship}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={data.emergency_contact?.relationship || ""}
            onChange={(e) => handleInputChange("relationship", e.target.value)}
            placeholder="Or type custom relationship"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span>📱</span>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={data.emergency_contact?.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              errors.emergency_contact_phone ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.emergency_contact_phone && (
            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.emergency_contact_phone}
            </p>
          )}
        </div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <span className="text-green-600">🔒</span>
            <span className="text-xs text-gray-600 font-medium">
              This information is only used in critical situations.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactStep;