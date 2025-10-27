"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function DashboardHome() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      try {
        // Retrieve current authenticated user info
        const user = await apiRequest("/auth/me", { suppressError: true });
        const role = user?.role;

       if (role === "individual") {
          router.replace("/dashboard/individual/plan");
        } else if (role === "admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/");
        }
      } catch{
        router.replace("/auth/login");
      }
    }

    redirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to your dashboard...</p>
    </div>
  );
} 