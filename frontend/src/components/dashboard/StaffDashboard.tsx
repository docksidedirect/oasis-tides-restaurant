"use client";

import { useState, useEffect, JSX } from "react";
import { dashboardAPI } from "@/lib/api";

interface Order {
  id: number;
  tableNumber: number;
  timeAgo: string;
  status: string;
}

interface Reservation {
  id: number;
  time: string;
  name: string;
  party: number;
  table: number;
}

interface StaffStats {
  pendingOrders: number;
  activeReservations: number;
  completedToday: number;
  recentOrders: Order[];
  upcomingReservations: Reservation[];
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.staffDashboard();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setStats({
        pendingOrders: 12,
        activeReservations: 8,
        completedToday: 25,
        recentOrders: [],
        upcomingReservations: [],
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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon="⏰"
          color="red"
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
        />
        <StatCard
          icon="📅"
          color="blue"
          title="Active Reservations"
          value={stats?.activeReservations || 0}
        />
        <StatCard
          icon="✅"
          color="green"
          title="Completed Today"
          value={stats?.completedToday || 0}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl mr-3">📋</span>
              <div className="text-left">
                <div className="font-medium">View Orders</div>
                <div className="text-sm text-gray-500">
                  Manage pending and active orders
                </div>
              </div>
            </button>

            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl mr-3">🏪</span>
              <div className="text-left">
                <div className="font-medium">Reservations</div>
                <div className="text-sm text-gray-500">
                  Check and update reservations
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Current Tasks - Pending Orders */}
      <ActivitySection
        title="Pending Orders"
        items={stats?.recentOrders.length ? stats.recentOrders : mockOrders}
        emptyMessage="No pending orders"
        renderItem={(order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <div>
              <div className="font-medium">Order #{order.id}</div>
              <div className="text-sm text-gray-500">
                Table {order.tableNumber}
              </div>
              <div className="text-xs text-gray-400">{order.timeAgo}</div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Complete
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                View
              </button>
            </div>
          </div>
        )}
      />

      {/* Current Tasks - Today's Reservations */}
      <ActivitySection
        title="Today's Reservations"
        items={
          stats?.upcomingReservations.length
            ? stats.upcomingReservations
            : mockReservations
        }
        emptyMessage="No upcoming reservations"
        renderItem={(reservation) => (
          <div
            key={reservation.id}
            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div>
              <div className="font-medium">{reservation.name}</div>
              <div className="text-sm text-gray-500">
                {reservation.time} • Party of {reservation.party} • Table{" "}
                {reservation.table}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Seated
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                Call
              </button>
            </div>
          </div>
        )}
      />

      {/* Performance Summary */}
      <PerformanceSummary />
    </div>
  );
}

function StatCard({
  icon,
  color,
  title,
  value,
}: {
  icon: string;
  color: string;
  title: string;
  value: number;
}) {
  const bgColor =
    {
      red: "bg-red-100",
      blue: "bg-blue-100",
      green: "bg-green-100",
    }[color] || "bg-gray-100";

  const textColor =
    {
      red: "text-red-600",
      blue: "text-blue-600",
      green: "text-green-600",
    }[color] || "text-gray-600";

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`${bgColor} rounded-md flex items-center justify-center w-8 h-8`}
            >
              <span className={`${textColor}`}>{icon}</span>
            </div>
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
    </div>
  );
}

function ActivitySection<T>({
  title,
  items,
  emptyMessage,
  renderItem,
}: {
  title: string;
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => JSX.Element;
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
            <div className="text-center py-4 text-gray-500">
              <span className="text-2xl block mb-2">
                {title === "Pending Orders" ? "⏰" : "📅"}
              </span>
              <p>{emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PerformanceSummary() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Today Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard color="green" value="25" label="Orders Completed" />
          <SummaryCard color="blue" value="8" label="Tables Served" />
          <SummaryCard
            color="purple"
            value="$1,250"
            label="Revenue Generated"
          />
          <SummaryCard color="yellow" value="4.8" label="Avg Rating" />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  color,
  value,
  label,
}: {
  color: string;
  value: string | number;
  label: string;
}) {
  const textColor =
    {
      green: "text-green-600",
      blue: "text-blue-600",
      purple: "text-purple-600",
      yellow: "text-yellow-600",
    }[color] || "text-gray-600";

  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

// Mock data to show if API data is empty
const mockOrders: Order[] = [
  { id: 1001, tableNumber: 3, timeAgo: "5 minutes ago", status: "Pending" },
  { id: 1002, tableNumber: 5, timeAgo: "10 minutes ago", status: "Pending" },
  { id: 1003, tableNumber: 2, timeAgo: "15 minutes ago", status: "Pending" },
  { id: 1004, tableNumber: 1, timeAgo: "20 minutes ago", status: "Pending" },
];

const mockReservations: Reservation[] = [
  { id: 1, time: "6:00 PM", name: "John Smith", party: 4, table: 5 },
  { id: 2, time: "6:30 PM", name: "Sarah Johnson", party: 2, table: 8 },
  { id: 3, time: "7:00 PM", name: "Mike Wilson", party: 6, table: 12 },
  { id: 4, time: "7:30 PM", name: "Lisa Brown", party: 3, table: 3 },
];
