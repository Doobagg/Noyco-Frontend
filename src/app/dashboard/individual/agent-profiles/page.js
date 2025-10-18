"use client";

import { useState, useEffect } from "react";
import { useAuth, useAgentProfile } from "@/store/hooks";
import ProfileGrid from "./components/ProfileGrid";
import ProfileCreator from "./components/ProfileCreator";
import ProfileViewer from "./components/ProfileViewer";
import EmptyState from "./components/EmptyState";
import { Bot } from "lucide-react";
import { Mars, Venus, NonBinary, UserCircle } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function AgentProfilesPage() {
  const { user } = useAuth();
  const { 
    profiles, 
    currentProfile, 
    isLoading, 
    error,
    createProfile,
    fetchProfiles,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    clearActiveProfile,
    clearProfileError
  } = useAgentProfile();
  
  const [currentView, setCurrentView] = useState("grid"); // grid, From, view, edit
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    // Profiles are automatically fetched by the useAgentProfile hook
    // when user is available, but we can manually trigger if needed
    if (user?.role_entity_id && profiles.length === 0 && !isLoading) {
      loadProfiles();
    }
  }, [user?.role_entity_id]);

  const loadProfiles = async () => {
    const result = await fetchProfiles();
    if (!result.success) {
      console.error('Failed to load profiles:', result.error);
    }
  };

  const handleCreateProfile = () => {
    setSelectedProfile(null);
    setCurrentView("create");
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setActiveProfile(profile);
    setCurrentView("view");
  };

  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setActiveProfile(profile);
    setCurrentView("edit");
  };

  const handleDeleteProfile = async (profileId) => {
    if (confirm("Are you sure you want to delete this agent profile?")) {
      try {
        const result = await deleteProfile(profileId);
        if (result.success) {
          // Profile is automatically removed from state by the slice
          showToast('Profile deleted', 'success');
        } else {
          console.error("Error deleting profile:", result.error);
          showToast("Failed to delete profile: " + result.error, 'error');
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        showToast("Failed to delete profile", 'error');
      }
    }
  };

  const handleSaveProfile = async (profileData, isEdit = false) => {
    try {
      let result;
      if (isEdit && selectedProfile) {
        result = await updateProfile(selectedProfile.user_profile_id, profileData);
      } else {
        result = await createProfile(profileData);
      }
      
      if (result.success) {
        showToast(isEdit ? 'Profile updated' : 'Profile created', 'success');
        setCurrentView("grid");
        setSelectedProfile(null);
        clearActiveProfile();
      } else {
        console.error("Error saving profile:", result.error);
        showToast("Failed to save profile: " + result.error, 'error');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast("Failed to save profile", 'error');
    }
  };

  const handleBackToGrid = () => {
    setCurrentView("grid");
    setSelectedProfile(null);
    clearActiveProfile();
    clearProfileError();
  };

  // Transform backend data format to match frontend expectations
  const transformedProfiles = profiles.map(raw => {
    // Some endpoints return `{ profile: {...} }`; normalize here
    const profile = raw?.profile ? raw.profile : raw;
    try {
      return {
        id: profile.user_profile_id || profile.id,
        user_profile_id: profile.user_profile_id || profile.id,
        role_entity_id: profile.role_entity_id,
        profile_name: profile.profile_name || 'Unnamed Profile',
        name: profile.name || profile.profile_name || 'Unnamed Agent',
        description: generateProfileDescription(profile),
        avatar: getAvatarFromGender(profile.gender),
        age: profile.age,
        gender: profile.gender,
        phone: profile.phone, // Add phone field
        location: profile.location,
        language: profile.language,
        personality_traits: profile.personality_traits || [],
        hobbies: profile.hobbies || [],
        interests: profile.interests || [],
        loved_ones: profile.loved_ones || [],
        past_stories: profile.past_stories || [],
        preferences: profile.preferences || {},
        health_info: profile.health_info || {},
        emotional_baseline: profile.emotional_baseline,
        hates: profile.hates || [],
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        last_used: profile.updated_at, // Using updated_at as last_used
        conversation_count: 0, // This would come from another API
        status: profile.is_active ? "active" : "inactive",
        is_active: profile.is_active
      };
    } catch (error) {
      console.error('Error transforming profile:', profile, error);
      return {
        id: 'error-profile',
        name: 'Error Loading Profile',
        description: 'Failed to load profile data',
        avatar: '❌',
        status: 'error'
      };
    }
  }).filter(Boolean); // Remove any falsy values

  // function getAvatarFromGender(gender) {
  //   switch (gender?.toLowerCase()) {
  //     case 'male': return '👨';
  //     case 'female': return '👩';
  //     default: return '👤';
  //   }
  // }


 function getAvatarFromGender(gender) {
  switch ((gender || "").toLowerCase()) {
    case "male":
      return <Mars className="w-6 h-6 text-blue-600" />;
    case "female":
      return <Venus className="w-6 h-6 text-pink-600" />;
    case "non-binary":
      return <NonBinary className="w-6 h-6 text-purple-600" />;
    default:
      return <UserCircle className="w-6 h-6 text-gray-600" />;
  }
}

  function generateProfileDescription(profile) {
    const parts = [];
    
    if (profile.age) parts.push(`Age: ${profile.age}`);
    if (profile.gender) parts.push(`Gender: ${profile.gender}`);
    if (profile.location) parts.push(`Location: ${profile.location}`);
    
    // Add top personality traits or interests
    if (profile.personality_traits?.length > 0) {
      parts.push(`Traits: ${profile.personality_traits.slice(0, 2).join(', ')}`);
    } else if (profile.interests?.length > 0) {
      parts.push(`Interests: ${profile.interests.slice(0, 2).join(', ')}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'AI Health Agent Profile';
  }

  // Sort profiles by most recent by default
  const sortedProfiles = [...transformedProfiles].sort((a, b) => {
    return new Date(b.last_used || 0) - new Date(a.last_used || 0);
  });

  // Default to viewing the most recent profile when profiles are available
  useEffect(() => {
    if (!isLoading && profiles.length > 0 && currentView === "grid" && !selectedProfile) {
      const defaultProfile = sortedProfiles[0];
      setSelectedProfile(defaultProfile);
      setActiveProfile(defaultProfile);
      setCurrentView("view");
    }
  }, [isLoading, profiles, currentView, selectedProfile, setActiveProfile, sortedProfiles]);

  // Show error if exists
  useEffect(() => {
    if (error) {
      console.error('Agent Profile Error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-beige">
      <div className="w-full overflow-x-hidden sm:p-6">
        {currentView === "grid" && (
          <>
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-800">
                  <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Agent Profiles</h2>
                    <p className="text-sm sm:text-base text-gray-600">Create and manage AI agent personalities</p>
                  </div>
                </div>
                {/* <button
                  onClick={handleCreateProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  <span className="text-lg">+</span>
                  <span>Create Profile</span>
                </button> */}
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-beige p-4 sm:p-6 shadow-sm border border-accent animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 mb-4"></div>
                    <div className="h-6 bg-gray-200 mb-2"></div>
                    <div className="h-4 bg-gray-200 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200"></div>
                      <div className="h-3 bg-gray-200 w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : transformedProfiles.length === 0 ? (
              <EmptyState onCreateProfile={handleCreateProfile} />
            ) : (
              <ProfileGrid
                profiles={sortedProfiles}
                onViewProfile={handleViewProfile}
                onEditProfile={handleEditProfile}
                onDeleteProfile={handleDeleteProfile}
              />
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error: {error}
              </div>
            )}
          </>
        )}

        {(currentView === "create" || currentView === "edit") && (
          <ProfileCreator
            profile={selectedProfile}
            isEdit={currentView === "edit"}
            onBack={handleBackToGrid}
            onSave={(profileData) => handleSaveProfile(profileData, currentView === "edit")}
          />
        )}

        {currentView === "view" && selectedProfile && (
          <ProfileViewer
            profile={selectedProfile}
            onBack={handleBackToGrid}
            onEdit={() => handleEditProfile(selectedProfile)}
            onDelete={() => handleDeleteProfile(selectedProfile.user_profile_id || selectedProfile.id)}
          />
        )}
      </div>
    </div>
  );
}
