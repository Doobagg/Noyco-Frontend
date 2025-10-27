"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { User } from "lucide-react";

const Header = ({
  onCreateProfile,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { value: "recent", label: "Recently Used", icon: "🕒" },
    { value: "name", label: "Name A-Z", icon: "🔤" },
    { value: "conversations", label: "Most Active", icon: "💬" }
  ];

  return (
    <div className="space-y-4">

     <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-xl flex items-center justify-center">
            <User className="w-7 h-7 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Profiles</h2>
            <p className="text-gray-600">Manage and monitor all user profiles</p>
          </div>
        </div>


      {/* Action Bar */}
      <div className="bg-beige shadow-sm border border-accent p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agent profiles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-beige transition-all duration-200"
            />
          </div>

          {/* Sort & Create */}
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FunnelIcon className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-beige rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                        sortBy === option.value ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create Button */}
            <button
              onClick={onCreateProfile}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
