"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

import AdminDashboard from "@/components/dashboard/AdminDashboard";
import StaffDashboard from "@/components/dashboard/StaffDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

type DashboardDataType = any; // Replace 'any' with your actual dashboard data type if available

export default function DashboardPage() {
  const { user, isAuthenticated, loading, isAdmin, isStaff, isClient } =
    useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardDataType | null>(
    null
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const token = localStorage.getItem("auth_token");
      console.log("Auth token:", token); // <-- check token here

      api
        .get("/dashboard")
        .then((res) => {
          setDashboardData(res.data);
          setError("");
        })
        .catch(() => {
          setError("Failed to load dashboard data");
          setDashboardData(null);
        });
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 bg-gradient-to-br from-ocean-500 to-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">
                    {isAdmin ? "👑" : isStaff ? "👨‍💼" : "👤"}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name ?? "User"}!
                </h1>
                <p className="text-gray-600">
                  {isAdmin && "Administrator Dashboard"}
                  {isStaff && !isAdmin && "Staff Dashboard"}
                  {isClient && "Customer Dashboard"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Dashboard Content */}
        {isAdmin && dashboardData && <AdminDashboard data={dashboardData} />}
        {isStaff && !isAdmin && dashboardData && (
          <StaffDashboard data={dashboardData} />
        )}
        {isClient && dashboardData && <ClientDashboard data={dashboardData} />}
      </div>
    </div>
  );
}
