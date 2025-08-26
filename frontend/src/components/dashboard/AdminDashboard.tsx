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
  totalUsers: number;
  totalOrders: number;
  totalReservations: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentReservations: Reservation[];
}

interface AdminDashboardProps {
  data?: DashboardStats | null;
}

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(data || null);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (!data) {
      fetchDashboardData();
    }
  }, [data]);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.adminDashboard();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Provide fallback or empty data
      setStats({
        totalUsers: 0,
        totalOrders: 0,
        totalReservations: 0,
        totalRevenue: 0,
        recentOrders: [],
        recentReservations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
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
          value={stats.totalUsers}
        />
        {/* Total Orders */}
        <StatCard
          icon="🛒"
          iconBg="bg-green-100"
          iconText="text-green-600"
          title="Total Orders"
          value={stats.totalOrders}
        />
        {/* Total Reservations */}
        <StatCard
          icon="📅"
          iconBg="bg-yellow-100"
          iconText="text-yellow-600"
          title="Reservations"
          value={stats.totalReservations}
        />
        {/* Revenue */}
        <StatCard
          icon="💰"
          iconBg="bg-purple-100"
          iconText="text-purple-600"
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
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
          items={stats.recentOrders}
          renderItem={(order) => (
            <ActivityItem
              key={order.id}
              title={`Order #${order.id}`}
              subtitle={`Customer: ${order.customerName || "N/A"}`}
              value={`$${order.totalAmount.toFixed(2)}`}
              status={order.status}
              valueColor="text-green-600"
            />
          )}
          emptyMessage="No recent orders available."
        />

        <RecentList
          title="Recent Reservations"
          items={stats.recentReservations}
          renderItem={(reservation) => (
            <ActivityItem
              key={reservation.id}
              title={`Table ${reservation.tableNumber ?? "N/A"}`}
              subtitle={`Guest: ${reservation.guestName || "N/A"}`}
              value={reservation.time || "TBD"}
              status={reservation.status}
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
  value: number | string;
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
          {items.length ? (
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
