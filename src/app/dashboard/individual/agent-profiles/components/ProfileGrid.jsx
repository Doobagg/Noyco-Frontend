"use client";

import { EyeIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { MessageCircle, Clock } from 'lucide-react';
import { useState } from "react";

const ProfileGrid = ({ profiles, onViewProfile, onEditProfile, onDeleteProfile }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "standby":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatLastUsed = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleCardClick = (profile, e) => {
    // Don't trigger view if clicking on the menu button or menu items
    if (e.target.closest('.menu-button') || e.target.closest('.menu-dropdown')) {
      return;
    }
    onViewProfile(profile);
  };

  const toggleMenu = (profileId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === profileId ? null : profileId);
  };

  const handleMenuAction = (action, profile, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (action === 'edit') {
      onEditProfile(profile);
    } else if (action === 'delete') {
      onDeleteProfile(profile.id);
    }
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="group bg-beige p-5 shadow-sm hover:shadow-lg border-accent border-accent-top border-accent-left border-accent-right hover:border-gray-300 transition-all duration-200 hover:scale-[1.02] cursor-pointer relative min-w-0"
            onClick={(e) => handleCardClick(profile, e)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-14 h-14 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                  {profile.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors truncate mb-1">
                    {profile.name}
                  </h3>
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium border ${getStatusColor(profile.status)}`}>
                    {profile.status}
                  </span>
                </div>
              </div>
              
              {/* 3-dots menu - Always visible */}
              <div className="relative menu-button">
                <button
                  onClick={(e) => toggleMenu(profile.id, e)}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-800 hover:text-gray-600"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
                
                {openMenuId === profile.id && (
                  <div className="menu-dropdown absolute right-0 top-10 bg-beige shadow-lg border-accent border-accent-top border-accent-left border-accent-right py-1 z-10 min-w-[150px]">
                    <button
                      onClick={(e) => handleMenuAction('edit', profile, e)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <PencilIcon className="w-4 h-4 text-green-500" />
                      Edit Profile
                    </button>
                    <button
                      onClick={(e) => handleMenuAction('delete', profile, e)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {profile.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-beige p-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Conversations</span>
                </div>
                <p className="font-semibold text-gray-900 text-base mt-1">{profile.conversation_count}</p>
              </div>
              <div className="bg-beige p-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-600">Last Used</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm mt-1">{formatLastUsed(profile.last_used)}</p>
              </div>
            </div>

            {/* Personality Traits */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {profile.personality_traits?.slice(0, 2).map((trait, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 text-xs font-medium"
                  >
                    {trait.charAt(0).toUpperCase() + trait.slice(1).toLowerCase()}
                  </span>
                ))}
                {profile.interests?.slice(0, 1).map((interest, index) => (
                  <span
                    key={`interest-${index}`}
                    className="px-2.5 py-1 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 text-xs font-medium"
                  >
                    {interest.charAt(0).toUpperCase() + interest.slice(1).toLowerCase()}
                  </span>
                ))}
                {(profile.personality_traits?.length > 2 || profile.interests?.length > 1) && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium">
                    +{Math.max(0, (profile.personality_traits?.length || 0) - 2) + Math.max(0, (profile.interests?.length || 0) - 1)} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions - Removed, now handled by 3-dots menu and card click */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileGrid;
