"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/store/hooks";

// Navigation items for the platform administrator
const navItems = [
  { name: "Dashboard", href: "/dashboard/admin", icon: "📊" },
  // { name: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
  { name: "Billing", href: "/dashboard/admin/billing", icon: "💳" },
  // { name: "Reports", href: "/dashboard/admin/reports", icon: "📑" },
  { name: "Users", href: "/dashboard/admin/users", icon: "👥" },
  { name: "Conversations", href: "/dashboard/admin/conversations", icon: "💬" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

    return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30 top-14"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col z-40
            transition-transform duration-300 ease-in-out
            lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-100/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
        <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Admin Center</h2>
                <p className="text-xs text-gray-500 font-medium">Platform Control</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                      isActive
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`text-base transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="tracking-tight">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1 h-1 bg-white/60 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
              {/* Logout placed below nav items with some spacing */}
              <div className="mt-6 pt-4 border-t border-gray-100/80">
                <button
                  onClick={async () => {
                    try {
                      await logout();
                    } finally {
                      router.replace('/auth/login');
                      closeSidebar();
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content - responsive margin */}
        <main className="lg:ml-72 pt-2 min-h-screen">
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
        </div>
        </ProtectedRoute>
  );
  }
