"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";
import { useAuth, useMetrics } from "@/store/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { SidebarBlob } from "@/components/landing/AnimatedBlob";

// Create context for sub-navigation
const SubNavContext = createContext();

export const useSubNav = () => {
  const context = useContext(SubNavContext);
  if (!context) {
    throw new Error("useSubNav must be used within SubNavProvider");
  }
  return context;
};

// Professional icons using Lucide or Heroicons style SVG paths
const icons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  metrics: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  
  plan: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  agentProfile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  schedule: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),

  track: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  scheduleItem: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  userProfile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

const navItems = [
  { 
    name: "Metrics", 
    href: "/dashboard/individual/metrics", // underlying route unchanged
    icon: icons.metrics, 
    tooltip: "Analytics and Metrics",
    subItems: [] 
  },
  // { 
  //   name: "Voice", 
  //   href: "/dashboard/individual/voice", 
  //   icon: icons.voice, 
  //   tooltip: "Voice Commands & Audio",
  //   subItems: [] 
  // },
  { 
    name: "Subscription", 
    href: "/dashboard/individual/plan", 
    icon: icons.plan, 
    tooltip: "Subscription",
    subItems: [] 
  },
  { 
    name: "Agent profile", 
    href: "/dashboard/individual/agent-profiles", 
    icon: icons.agentProfile, 
    tooltip: "User Configuration",
    subItems: [] 
  },
  // {
  //   name: "Schedule",
  //   href: "/dashboard/individual/schedule",
  //   icon: icons.schedule,
  //   tooltip: "Schedule Management",
  //   subItems: [
  //     { name: "Track", key: "track", icon: icons.track, tooltip: "Location Tracking" },
  //     { name: "Schedule", key: "schedule", icon: icons.scheduleItem, tooltip: "Time Scheduling" }
  //   ]
  // },
 
];

// User Profile Dropdown Component
const UserProfileDropdown = ({ isOpen, onClose, user, onLogout, placement = 'sidebar' }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.user-profile-dropdown')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Positioning depends on where this dropdown is used
  const positionClass = placement === 'header'
    ? 'top-full right-0 mt-2'
    : 'bottom-full left-full ml-2 mb-2';

  return (
    <div className={`user-profile-dropdown absolute ${positionClass} w-64 bg-beige rounded-none shadow-xl border border-gray-200 py-2 z-50 `}>
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100 bg-beige">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || 'Individual'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-2 py-2">
        <Link
          href="/dashboard/individual/settings"
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#E6D3E7] hover:via-[#F6D9D5] hover:to-[#D6E3EC] rounded-md transition-all duration-200"
        >
          {icons.settings}
          <span className="ml-3">Settings</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#E6D3E7] hover:via-[#F6D9D5] hover:to-[#D6E3EC] rounded-md transition-all duration-200 mt-1"
        >
          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Tooltip Component
const Tooltip = ({ children, content, position = "right" }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-200 ${
          position === "right" ? "left-full ml-3 top-1/2 -translate-y-1/2" : ""
        }`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 rotate-45 ${
            position === "right" ? "-left-1 top-1/2 -translate-y-1/2" : ""
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default function IndividualLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [activeSubItem, setActiveSubItem] = useState("track");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);

  const currentNavItem = navItems.find(item => pathname === item.href);

  // Check if user needs to complete onboarding
  useEffect(() => {
    const verifyOnboarding = async () => {
      if (!user?.role_entity_id) return;
      
      // Avoid checking onboarding if already on onboarding page
      if (pathname === '/dashboard/individual/onboarding') return;
      
      // Avoid checking if user just completed onboarding (URL param check)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('onboarding') === 'completed') {
        console.log('User just completed onboarding, skipping status check');
        return;
      }

      try {
        const data = await apiRequest('/auth/onboarding/status');
        console.log('Onboarding status check:', data);
        
        if (!data.onboarding_completed) {
          console.log('Redirecting to onboarding...');
          setShowOnboarding(true);
          router.push('/dashboard/individual/onboarding');
        } else {
          console.log('Onboarding completed, user can access dashboard');
          setShowOnboarding(false);
        }
      } catch (e) {
        console.error('Failed to fetch onboarding status', e);
        // On error, don't redirect to avoid potential loops
      }
    };

    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(verifyOnboarding, 100);
    return () => clearTimeout(timeoutId);
  }, [user?.role_entity_id, pathname, router]);

  useEffect(() => {
    if (currentNavItem && currentNavItem.subItems.length > 0) {
      setExpandedItems(prev => new Set([...prev, currentNavItem.href]));
      if (pathname === "/dashboard/individual/schedule" && !activeSubItem) {
        setActiveSubItem("track");
      }
    }
  }, [pathname, currentNavItem]);

  const toggleExpanded = (href) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(href)) {
        newSet.delete(href);
      } else {
        newSet.add(href);
      }
      return newSet;
    });
  };

  const handleSubItemClick = (subItemKey, parentHref) => {
    if (pathname !== parentHref) {
      router.push(parentHref);
    }
    setActiveSubItem(subItemKey);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleItemClick = (itemHref) => {
    setClickedItem(itemHref);
    // Reset clicked state after animation
    setTimeout(() => setClickedItem(null), 300);
  };

  // If user is on onboarding page, render without sidebar
  if (pathname === '/dashboard/individual/onboarding') {
    return (
      <ProtectedRoute allowedRoles={["individual", "admin"]}>
        {children}
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["individual", "admin"]}>
      <SubNavContext.Provider
        value={{
          activeSubItem,
          setActiveSubItem: (key) =>
            handleSubItemClick(key, "/dashboard/individual/schedule")
        }}
      >
        <div className="flex h-screen" style={{ backgroundColor: 'var(--background)' }}>
          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-beige border-b border-accent h-16 flex items-center justify-between px-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Toggle sidebar navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {/* Logo removed intentionally for cleaner mobile header */}
            </div>
            {/* Mobile user profile button and dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-label="User profile menu"
                onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isProfileDropdownOpen
                    ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 shadow'
                    : 'bg-beige text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons.userProfile}
              </button>
              <UserProfileDropdown 
                isOpen={isProfileDropdownOpen} 
                onClose={() => setIsProfileDropdownOpen(false)} 
                user={user} 
                onLogout={handleLogout}
                placement="header"
              />
            </div>
          </div>

          {/* Sidebar Overlay for Mobile */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 z-40"
              style={{ backgroundColor: '#000000CC' }}
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Minimal Sidebar */}
          <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-[70%] lg:w-20 bg-beige/95  flex flex-col shadow-lg border-accent-right transition-transform duration-300 ease-in-out h-full`}>
            {/* Home Icon at the top */}
            <div className="py-4 px-3">
              <Tooltip content="Home">
                <div className="relative">
                  <Link
                    href="/dashboard/individual"
                                          className={`group relative flex items-center w-full lg:w-12 h-12 lg:justify-center lg:rounded-full rounded-lg transition-all duration-300 ease-out pl-3 lg:pl-0 overflow-hidden ${
                        pathname === "/dashboard/individual"
                         ? "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 shadow-lg transform scale-105"
                         : "bg-beige text-gray-600 hover:text-gray-800 hover:shadow-md hover:scale-105"
                      }`}
                    onMouseEnter={() => setHoveredItem("/dashboard/individual")}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => handleItemClick("/dashboard/individual")}
                  >
                    <span className="relative z-10 lg:mx-auto">
                      {icons.home}
                    </span>
                    <span className="ml-3 lg:hidden text-sm font-medium">
                      Home
                    </span>
                    <div className="hidden lg:block">
                      <SidebarBlob 
                        isHovered={hoveredItem === "/dashboard/individual"}
                        isActive={clickedItem === "/dashboard/individual" || pathname === "/dashboard/individual"}
                      />
                    </div>
                  </Link>
                </div>
              </Tooltip>
            </div>

            {/* Navigation Icons */}
            <nav className="flex-1 py-4 space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isExpanded = expandedItems.has(item.href);
                const hasSubItems = item.subItems.length > 0;

                return (
                  <div key={item.href} className="space-y-1">
                    <div className="relative">
                      <Tooltip content={item.tooltip}>
                        <div className="relative">
                          <Link
                            href={item.href}
                                                          className={`group relative flex items-center w-full lg:w-12 h-12 lg:justify-center lg:rounded-full rounded-lg transition-all duration-300 ease-out pl-3 lg:pl-0 overflow-hidden ${
                                isActive
                                 ? "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 shadow-lg transform scale-105"
                                 : "bg-beige text-gray-600 hover:text-gray-800 hover:shadow-md hover:scale-105"
                              }`}
                            onMouseEnter={() => setHoveredItem(item.href)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleItemClick(item.href)}
                          >
                            <span className="relative z-10 lg:mx-auto">
                              {item.icon}
                            </span>
                            <span className="ml-3 lg:hidden text-sm font-medium">
                              {item.name}
                            </span>
                            <div className="hidden lg:block">
                              <SidebarBlob 
                                isHovered={hoveredItem === item.href}
                                isActive={clickedItem === item.href || isActive}
                              />
                            </div>
                          </Link>
                        </div>
                      </Tooltip>

                      {/* Sub-items toggle for Schedule */}
                      {hasSubItems && (
                        <button
                          onClick={() => toggleExpanded(item.href)}
                          className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all duration-200 ${
                            isActive
                              ? "bg-gray-500 text-white"
                              : "bg-gray-600 text-white hover:bg-gray-500"
                          }`}
                        >
                          <svg
                            className={`w-2.5 h-2.5 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Sub-navigation items */}
                    {hasSubItems && (
                      <div
                        className={`space-y-1 transition-all duration-300 ease-out overflow-hidden ${
                          isExpanded ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        {item.subItems.map((subItem) => {
                          const isSubActive = activeSubItem === subItem.key && isActive;
                          return (
                            <Tooltip key={subItem.key} content={subItem.tooltip}>
                              <div className="relative">
                                <button
                                  className={`relative flex items-center w-full lg:w-10 h-10 lg:justify-center lg:rounded-full rounded-lg transition-all duration-300 ease-out lg:mx-auto pl-3 lg:pl-0 overflow-hidden ${
                                    isSubActive
                                      ? "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 shadow-md scale-105"
                                      : "bg-beige text-gray-500 hover:text-gray-800 hover:shadow-sm hover:scale-105"
                                  }`}
                                  onMouseEnter={() => setHoveredItem(`${item.href}-${subItem.key}`)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                  onClick={() => {
                                    handleSubItemClick(subItem.key, item.href);
                                    handleItemClick(`${item.href}-${subItem.key}`);
                                  }}
                                >
                                  <span className="lg:mx-auto">
                                    {subItem.icon}
                                  </span>
                                  <span className="ml-3 lg:hidden text-sm font-medium">
                                    {subItem.name}
                                  </span>
                                  <div className="hidden lg:block">
                                    <SidebarBlob 
                                      isHovered={hoveredItem === `${item.href}-${subItem.key}`}
                                      isActive={clickedItem === `${item.href}-${subItem.key}` || isSubActive}
                                    />
                                  </div>
                                </button>
                              </div>
                            </Tooltip>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* User Profile & Status - Hidden on mobile (shown in header) */}
            <div className="hidden lg:block px-3 py-4 space-y-3">
              {/* User Profile Icon */}
              <div className="relative">
                <Tooltip content="User Profile">
                  <div className="relative">
                    <button
                      className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-out overflow-hidden ${
                        isProfileDropdownOpen
                          ? "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 shadow-md scale-105"
                          : "bg-beige text-gray-600 hover:text-gray-800 hover:shadow-md hover:scale-105"
                      }`}
                      onMouseEnter={() => setHoveredItem("user-profile")}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => {
                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                        handleItemClick("user-profile");
                      }}
                    >
                      <span className="relative z-10">
                        {icons.userProfile}
                      </span>
                      <div className="hidden lg:block">
                        <SidebarBlob 
                          isHovered={hoveredItem === "user-profile"}
                          isActive={clickedItem === "user-profile" || isProfileDropdownOpen}
                        />
                      </div>
                    </button>
                  </div>
                </Tooltip>

                {/* Profile Dropdown */}
                <UserProfileDropdown
                  isOpen={isProfileDropdownOpen}
                  onClose={() => setIsProfileDropdownOpen(false)}
                  user={user}
                  onLogout={handleLogout}
                />
              </div>

              
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden pt-16 lg:pt-0 relative z-0">
          <div className={`h-full ${pathname === "/dashboard/individual" ? "overflow-hidden" : "overflow-y-auto"}`}>
              <div className="min-h-full p-4 sm:p-6 lg:p-8" style={{ backgroundColor: 'var(--background)' }}>
                <div className="max-w-7xl mx-auto">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </SubNavContext.Provider>
    </ProtectedRoute>
  );
}