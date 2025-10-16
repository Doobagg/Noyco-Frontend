"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/hooks";
import { showToast } from '@/lib/toast';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Build a role-aware link to dashboard root
  const getDashboardHome = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "individual") return "/dashboard/individual";
    return "/dashboard/individual"; // Default to individual dashboard
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Signed out successfully', 'success');
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
      showToast('Failed to sign out', 'error');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Left – brand / dashboard link */}
          <div className="flex items-center space-x-3">
            <Link
              href={getDashboardHome()}
              className="text-lg font-semibold text-blue-600 hover:text-blue-700"
            >
              Dashboard
            </Link>
            <span className="hidden sm:inline-block text-sm text-gray-400 capitalize">
              {pathname?.replace("/dashboard", "") || ""}
            </span>
          </div>

          {/* Right – user email & logout */}
          <div className="flex items-center space-x-4">
            {user?.email && (
              <span className="text-sm text-gray-700 hidden sm:inline-block truncate max-w-[140px]">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 



