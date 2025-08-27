"use client";

import { useState, useEffect } from "react";
import { dashboardAPI } from "@/lib/api";

// Define types for dashboard entities
interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
}

interface Reservation {
  id: number;
  tableNumber?: number;
  guestName?: string;
  time?: string;
  status: string;
}

interface DashboardStats {
  totalUsers?: number;
  totalOrders?: number;
  totalReservations?: number;
  totalRevenue?: number;
  recentOrders?: Order[];
  recentReservations?: Reservation[];
}

interface AdminDashboardProps {
  data?: DashboardStats | null;
}

// Safe formatting utilities
const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return "$0";
  return `$${value.toLocaleString()}`;
};

const formatNumber = (value?: number): string => {
  if (value === undefined || value === null) return "0";
  return value.toLocaleString();
};

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(data || null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      fetchDashboardData();
    }
  }, [data]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.adminDashboard();
      console.log("Dashboard data response:", response);
      setStats(response.data || null);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error.response || error);
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Safe access to stats with fallbacks
  const safeStats = {
    totalUsers: stats?.totalUsers ?? 0,
    totalOrders: stats?.totalOrders ?? 0,
    totalReservations: stats?.totalReservations ?? 0,
    totalRevenue: stats?.totalRevenue ?? 0,
    recentOrders: stats?.recentOrders || [],
    recentReservations: stats?.recentReservations || [],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        <p>Error: {error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-ocean-600 text-white rounded hover:bg-ocean-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-10">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <StatCard
          icon="👥"
          iconBg="bg-blue-100"
          iconText="text-blue-600"
          title="Total Users"
          value={formatNumber(safeStats.totalUsers)}
        />
        {/* Total Orders */}
        <StatCard
          icon="🛒"
          iconBg="bg-green-100"
          iconText="text-green-600"
          title="Total Orders"
          value={formatNumber(safeStats.totalOrders)}
        />
        {/* Total Reservations */}
        <StatCard
          icon="📅"
          iconBg="bg-yellow-100"
          iconText="text-yellow-600"
          title="Reservations"
          value={formatNumber(safeStats.totalReservations)}
        />
        {/* Revenue */}
        <StatCard
          icon="💰"
          iconBg="bg-purple-100"
          iconText="text-purple-600"
          title="Revenue"
          value={formatCurrency(safeStats.totalRevenue)}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              icon="👥"
              title="Manage Users"
              subtitle="Add, edit, or remove users"
            />
            <QuickActionCard
              icon="🍽️"
              title="Menu Management"
              subtitle="Update menu items and prices"
            />
            <QuickActionCard
              icon="📊"
              title="View Reports"
              subtitle="Sales and analytics reports"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentList
          title="Recent Orders"
          items={safeStats.recentOrders}
          renderItem={(order) => (
            <ActivityItem
              key={order.id}
              title={`Order #${order.id}`}
              subtitle={`Customer: ${order.customerName || "N/A"}`}
              value={`$${(order.totalAmount || 0).toFixed(2)}`}
              status={order.status || "Unknown"}
              valueColor="text-green-600"
            />
          )}
          emptyMessage="No recent orders available."
        />

        <RecentList
          title="Recent Reservations"
          items={safeStats.recentReservations}
          renderItem={(reservation) => (
            <ActivityItem
              key={reservation.id}
              title={`Table ${reservation.tableNumber ?? "N/A"}`}
              subtitle={`Guest: ${reservation.guestName || "N/A"}`}
              value={reservation.time || "TBD"}
              status={reservation.status || "Unknown"}
              valueColor="text-blue-600"
            />
          )}
          emptyMessage="No recent reservations available."
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  iconText,
  title,
  value,
}: {
  icon: string;
  iconBg: string;
  iconText: string;
  title: string;
  value: string; // Changed to string since we format now
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5 flex items-center">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${iconBg}`}
        >
          <span className={`${iconText} text-xl`}>{icon}</span>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full">
      <span className="text-2xl mr-3">{icon}</span>
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </button>
  );
}

function RecentList<T>({
  title,
  items,
  renderItem,
  emptyMessage,
}: {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage: string;
}) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {title}
        </h3>
        <div className="space-y-3">
          {items && items.length > 0 ? (
            items.map(renderItem)
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  subtitle,
  value,
  status,
  valueColor,
}: {
  title: string;
  subtitle: string;
  value: string;
  status: string;
  valueColor: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
      <div className="text-right">
        <div className={`font-medium ${valueColor}`}>{value}</div>
        <div className="text-sm capitalize">{status}</div>
      </div>
    </div>
  );
}
