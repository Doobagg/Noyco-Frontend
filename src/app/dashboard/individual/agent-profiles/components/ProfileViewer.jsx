"use client";

import { useState } from "react";
import { 
  Edit, 
  Trash2, 
  User,
  Heart,
  Clock,
  FileText,
  Settings,
  Sparkles,
  Phone,
  MapPin,
  MessageCircle,
  Smile,
  X
} from "lucide-react";

const ProfileViewer = ({ profile, onBack, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  console.log(onBack);
  console.log('ProfileViewer received profile:', profile);

  const formatArrayValue = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      return value.join(", ");
    }
    return "Not specified";
  };

  // const formatObjectValue = (obj, field) => {
  //   if (obj && typeof obj === "object" && obj[field]) {
  //     if (Array.isArray(obj[field])) {
  //       return obj[field].length > 0 ? obj[field].join(", ") : "Not specified";
  //     }
  //     return obj[field];
  //   }
  //   return "Not specified";
  // };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatPreferences = (preferences) => {
    if (!preferences || typeof preferences !== "object") return {};
    return preferences;
  };

  const formatHealthInfo = (healthInfo) => {
    if (!healthInfo || typeof healthInfo !== "object") return {};
    return healthInfo;
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(profile.id || profile.user_profile_id);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-1 mt-1.5 md:px-2.5 md:py-0.5 text-xs font-small bg-green-100 text-green-800">
        <div className="w-1.5 h-1.5 bg-green-600 mr:0.5 md:mr-1.5"></div>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-1 mt-1.5 md:px-2.5 md:py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
        <div className="w-1.5 h-1.5 bg-gray-400 mr:0.5 md:mr-1.5"></div>
        Inactive
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-beige">
  <div className="max-w-screen mx-auto p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          {/* Profile Header Card */}
          <div className="bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center text-gray-800 shadow-lg">
                    <User className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="absolute -bottom-1 ">
                    {getStatusBadge(profile.is_active)}
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 truncate">
                    {profile.profile_name || profile.name}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base font-medium mb-2 truncate">{profile.name}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      ID: {profile.user_profile_id || profile.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      Role: {profile.role_entity_id}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 lg:gap-2 self-center md:self-start">
                <button
                  onClick={() => onEdit(profile)}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-md transition-colors text-xs sm:text-sm font-medium shadow-sm"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Edit Profile</span>
                  <span className="xs:hidden">Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Delete</span>
                  <span className="xs:hidden">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* Basic Information */}
          <div className="bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="space-y-2 sm:space-y-4">
              {(() => {
                return [
                  { label: "Age", value: profile.age, icon: <User className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { label: "Phone *", value: profile.phone, icon: <Phone className="w-3 h-3 sm:w-4 sm:h-4" />, required: true, isNewField: true },
                  { label: "Gender", value: profile.gender, icon: <User className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { label: "Location", value: profile.location, icon: <MapPin className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { label: "Language", value: profile.language, icon: <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { label: "Emotional Baseline", value: profile.emotional_baseline, icon: <Smile className="w-3 h-3 sm:w-4 sm:h-4" /> }
                ];
              })().map((item, index) => {
                // Check if value exists and is not empty
                const hasValue = item.value !== null && 
                                item.value !== undefined && 
                                item.value !== '' && 
                                String(item.value).trim() !== '';
                
                const isRequired = item.required === true;
                const showAsRequired = isRequired && !hasValue;
                
                // Special handling for new required fields in existing profiles
                let displayText = hasValue ? item.value : (isRequired ? "Required" : "Not specified");
                if (item.isNewField && !hasValue) {
                  displayText = "Please add in edit mode";
                }
                
                return (
                                     <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-beige">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-gray-600">{item.icon}</span>
                      <span className="text-gray-600 font-medium text-xs sm:text-sm">{item.label}</span>
                    </div>
                    <span className={`font-medium text-xs sm:text-sm capitalize ${
                      showAsRequired ? "text-orange-500" : "text-gray-900"
                    }`}>
                      {displayText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personality & Traits */}
          <div className="bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Personality & Traits</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-2">Personality Traits</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {profile.personality_traits?.map((trait, index) => (
                    <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 text-[10px] sm:text-xs font-medium capitalize">
                      {trait}
                    </span>
                  )) || <span className="text-gray-500 text-xs sm:text-sm">Not specified</span>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-2">Interests</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {profile.interests?.map((interest, index) => (
                    <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 text-[10px] sm:text-xs font-medium capitalize">
                      {interest}
                    </span>
                  )) || <span className="text-gray-500 text-sm">Not specified</span>}
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-beige">
                  <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 flex items-center gap-1 sm:gap-2">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" /> Loves
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm">{formatArrayValue(profile.hobbies)}</p>
                </div>
                <div className="p-2 sm:p-3 bg-beige">
                  <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 flex items-center gap-1 sm:gap-2">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" /> Dislikes
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm">{formatArrayValue(profile.hates)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-beige shadow-sm border border-accent p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Preferences</h3>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(formatPreferences(profile.preferences)).length > 0 ? (
                Object.entries(formatPreferences(profile.preferences)).map(([key, value]) => (
                                     <div key={key} className="flex items-center justify-between p-2 sm:p-3 bg-beige">
                     <span className="text-gray-700 font-medium text-xs sm:text-sm capitalize">
                       {key.replace(/_/g, ' ')}
                     </span>
                     <span className="text-gray-800 font-semibold text-xs sm:text-sm capitalize">
                      {String(value).replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Settings className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <span className="text-gray-500 text-xs sm:text-sm">No preferences configured yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Information */}
        {Object.keys(formatHealthInfo(profile.health_info)).length > 0 && (
          <div className="mt-4 sm:mt-6 bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-base sm:text-lg">🏥</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Health Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {Object.entries(formatHealthInfo(profile.health_info)).map(([key, value]) => (
                <div key={key} className="p-3 sm:p-4 bg-beige border-accent border-accent-top border-accent-left border-accent-right">
                  <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 sm:mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loved Ones */}


          {profile.loved_ones && profile.loved_ones.length > 0 && (
          <div className="mt-3 sm:mt-4 bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Loved Ones</h3>
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              {profile.loved_ones.slice(0, 4).map((person, index) => (
                <div key={index} className="p-2 sm:p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded border border-pink-100">
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <h4 className="font-medium text-pink-900 text-xs sm:text-sm">{person.name}</h4>
                    {person.relation && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-pink-200 text-pink-800 rounded-full text-[10px] sm:text-xs font-medium">
                        {person.relation}
                      </span>
                    )}
                  </div>
                  {console.log('Person memories:', person.memories)}
                  {person.memories && Array.isArray(person.memories) && person.memories.length > 0 && (
                    <div>
                      <h5 className="text-[10px] sm:text-xs font-medium text-pink-700 mb-1">💭 Memories:</h5>
                      <p className="text-pink-800 text-[10px] sm:text-xs mb-1 leading-relaxed">
                        • {person.memories[0]}
                      </p>
                      {person.memories.length > 1 && (
                        <div>
                          <p className="text-pink-800 text-xs mb-1 leading-relaxed">
                            • {person.memories[1]}
                          </p>
                          {person.memories.length > 2 && (
                            <p className="text-xs text-pink-600 italic">
                              +{person.memories.length - 2} more memories...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {profile.loved_ones.length > 4 && (
                                 <div className="p-3 bg-beige border border-accent flex items-center justify-center text-gray-500 text-sm">
                  +{profile.loved_ones.length - 4} more loved ones
                </div>
              )}
            </div>
          </div>
        )}
        {/* {profile.loved_ones && profile.loved_ones.length > 0 && (
          <div className="mt-6 bg-beige shadow-sm border border-accent p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <HeartIcon className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Loved Ones</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.loved_ones.map((person, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">{person.name}</h4>
                    {person.relation && (
                      <span className="px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-xs font-medium">
                        {person.relation}
                      </span>
                    )}
                  </div>
                  {person.memories && person.memories.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-pink-700 mb-2">💭 Memories:</h5>
                      <div className="space-y-1">
                        {person.memories.slice(0, 3).map((memory, memIndex) => (
                          <p key={memIndex} className="text-xs text-pink-800 bg-pink-100 p-2 rounded-lg">
                            {memory}
                          </p>
                        ))}
                        {person.memories.length > 3 && (
                          <p className="text-xs text-pink-600 italic">
                            +{person.memories.length - 3} more memories...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Past Stories */}
        {profile.past_stories && profile.past_stories.length > 0 && (
          <div className="mt-4 sm:mt-6 bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Past Stories</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {profile.past_stories.map((story, index) => (
                <div key={index} className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  {story.title && (
                    <h4 className="font-semibold text-orange-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{story.title}</h4>
                  )}
                  <p className="text-orange-800 mb-2 sm:mb-3 leading-relaxed text-xs sm:text-sm">{story.description}</p>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    {story.date && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-orange-600">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {formatDateTime(story.date)}
                      </span>
                    )}
                    {story.emotional_significance && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-200 text-orange-800 rounded-full text-[10px] sm:text-xs font-medium capitalize">
                        {story.emotional_significance}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-4 sm:mt-6 bg-beige shadow-sm border-accent border-accent-top border-accent-left border-accent-right p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Timeline</h3>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                         <div className="p-3 sm:p-4 bg-beige">
               <span className="text-gray-600 font-medium text-xs sm:text-sm">Created At</span>
               <p className="text-gray-900 font-semibold mt-1 text-xs sm:text-sm">{formatDateTime(profile.created_at)}</p>
             </div>
             <div className="p-3 sm:p-4 bg-beige">
               <span className="text-gray-600 font-medium text-xs sm:text-sm">Last Updated</span>
               <p className="text-gray-900 font-semibold mt-1 text-xs sm:text-sm">{formatDateTime(profile.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-beige p-4 sm:p-6 max-w-md w-full shadow-2xl border border-accent">
            <div className="text-center mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Delete Profile</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Are you sure you want to delete "<span className="font-semibold">{profile.profile_name || profile.name}</span>"? 
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileViewer;