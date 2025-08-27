"use client";

import { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { orderAPI, reservationAPI } from "@/lib/api";

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
}

interface Reservation {
  id: number;
  date: string;
  time: string;
  party: number;
  status: string;
}

interface ClientStats {
  totalOrders?: number;
  totalReservations?: number;
  loyaltyPoints?: number;
  recentOrders?: Order[];
  upcomingReservations?: Reservation[];
}

// Safe formatting utilities
const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return "$0.00";
  return `$${value.toFixed(2)}`;
};

const formatNumber = (value?: number): string => {
  if (value === undefined || value === null) return "0";
  return value.toLocaleString();
};

export default function ClientDashboard() {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user orders and reservations concurrently
      const [ordersResponse, reservationsResponse] = await Promise.all([
        orderAPI.getAll().catch((err) => {
          console.warn("Failed to fetch orders:", err);
          return { data: [] };
        }),
        reservationAPI.getAll().catch((err) => {
          console.warn("Failed to fetch reservations:", err);
          return { data: [] };
        }),
      ]);

      const safeStats: ClientStats = {
        totalOrders: ordersResponse?.data?.length ?? 0,
        totalReservations: reservationsResponse?.data?.length ?? 0,
        loyaltyPoints: 1250, // Preset or from API if available
        recentOrders: ordersResponse?.data?.slice(0, 3) || [],
        upcomingReservations: reservationsResponse?.data?.slice(0, 2) || [],
      };

      setStats(safeStats);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");

      // Fallback data
      setStats({
        totalOrders: 0,
        totalReservations: 0,
        loyaltyPoints: 1250,
        recentOrders: [],
        upcomingReservations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe access to stats
  const safeStats = {
    totalOrders: stats?.totalOrders ?? 0,
    totalReservations: stats?.totalReservations ?? 0,
    loyaltyPoints: stats?.loyaltyPoints ?? 0,
    recentOrders: stats?.recentOrders || [],
    upcomingReservations: stats?.upcomingReservations || [],
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-96"
        role="status"
        aria-label="Loading dashboard data"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto"
          role="alert"
        >
          <div className="text-red-600 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Try fetching dashboard data again"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <header className="bg-gradient-to-r from-ocean-600 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-ocean-100">
          Here is your dining activity and rewards
        </p>
      </header>

      {/* Stats Grid */}
      <section
        aria-label="Client statistics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <StatCard
          icon="🛒"
          color="green"
          title="Total Orders"
          value={safeStats.totalOrders}
          trend="+12% this month"
        />
        <StatCard
          icon="📅"
          color="blue"
          title="Reservations"
          value={safeStats.totalReservations}
          trend="+3 this month"
        />
        <StatCard
          icon="⭐"
          color="yellow"
          title="Loyalty Points"
          value={safeStats.loyaltyPoints}
          trend="Earn 2x points today"
        />
      </section>

      {/* Quick Actions */}
      <section
        aria-labelledby="quick-actions-heading"
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="px-4 py-5 sm:p-6">
          <h2
            id="quick-actions-heading"
            className="text-lg font-semibold text-gray-900 mb-4"
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <QuickActionLink
              href="/menu"
              icon="🍽️"
              title="Order Food"
              subtitle="Browse our menu"
              gradient="from-green-500 to-emerald-600"
            />
            <QuickActionLink
              href="/reservations/new"
              icon="📅"
              title="Make Reservation"
              subtitle="Book a table"
              gradient="from-blue-500 to-cyan-600"
            />
            <QuickActionLink
              href="/profile"
              icon="👤"
              title="Update Profile"
              subtitle="Manage account"
              gradient="from-purple-500 to-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* Recent Orders and Upcoming Reservations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySection
          title="Recent Orders"
          items={safeStats.recentOrders}
          emptyMessage="No recent orders"
          linkHref="/orders"
          linkText="View order history"
          icon="🍽️"
          renderItem={(order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">🛒</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Order #{order.id}
                  </div>
                  <div className="text-sm text-gray-500">{order.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {formatCurrency(order.total)}
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </div>
              </div>
            </div>
          )}
        />

        <ActivitySection
          title="Upcoming Reservations"
          items={safeStats.upcomingReservations}
          emptyMessage="No upcoming reservations"
          linkHref="/reservations"
          linkText="View all reservations"
          icon="📅"
          renderItem={(reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📅</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {reservation.date}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reservation.time} • {reservation.party} people
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    reservation.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : reservation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {reservation.status}
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Modify
                </button>
              </div>
            </div>
          )}
        />
      </section>

      {/* Loyalty Program */}
      <LoyaltyProgram points={safeStats.loyaltyPoints} />

      {/* Favorite Items */}
      <FavoriteItems />
    </div>
  );
}

function StatCard({
  icon,
  color,
  title,
  value,
  trend,
}: {
  icon: string;
  color: string;
  title: string;
  value: number;
  trend?: string;
}) {
  const colorClasses = {
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      trend: "text-green-500",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      trend: "text-blue-500",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      trend: "text-yellow-500",
    },
  }[color] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    trend: "text-gray-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`${colorClasses.bg} rounded-xl w-12 h-12 flex items-center justify-center`}
          >
            <span className={`${colorClasses.text} text-xl`}>{icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(value)}
            </p>
            {trend && (
              <p className={`text-xs font-medium ${colorClasses.trend}`}>
                {trend}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionLink({
  href,
  icon,
  title,
  subtitle,
  gradient,
}: {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className={`bg-gradient-to-r ${gradient} text-white rounded-xl p-4 hover:shadow-lg transform hover:scale-105 transition-all duration-200 group`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <div className="text-left">
          <div className="font-semibold text-white group-hover:text-white/90">
            {title}
          </div>
          <div className="text-sm text-white/80 group-hover:text-white/70">
            {subtitle}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ActivitySection<T>({
  title,
  items,
  emptyMessage,
  linkHref,
  linkText,
  icon,
  renderItem,
}: {
  title: string;
  items: T[];
  emptyMessage: string;
  linkHref: string;
  linkText: string;
  icon: string;
  renderItem: (item: T) => JSX.Element;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <span>{icon}</span>
            <span>{title}</span>
          </h3>
          <Link
            href={linkHref}
            className="text-sm text-ocean-600 hover:text-ocean-500 font-medium transition-colors"
          >
            {linkText}
          </Link>
        </div>
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map(renderItem)
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3 text-gray-300">{icon}</div>
              <p className="text-gray-500 mb-3">{emptyMessage}</p>
              <Link
                href={title.includes("Order") ? "/menu" : "/reservations/new"}
                className="inline-flex items-center px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
              >
                {title.includes("Order") ? "Order Now" : "Make Reservation"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoyaltyProgram({ points }: { points: number }) {
  const progressPercent = Math.min(((points % 500) / 500) * 100, 100);
  const freeMeals = Math.floor(points / 100);
  const pointsToNext = 500 - (points % 500);

  return (
    <section
      aria-labelledby="loyalty-program-heading"
      className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
    >
      <h2 id="loyalty-program-heading" className="text-xl font-bold mb-4">
        🎯 Loyalty Program
      </h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <p className="text-amber-100">
            You have {formatNumber(points)} points
          </p>
        </div>
        <div className="text-center md:text-right">
          <div className="text-3xl font-bold">{freeMeals}</div>
          <div className="text-amber-100 text-sm">Free meals earned</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm text-amber-100 mb-2">
          <span>Level Progress</span>
          <span>{Math.floor(progressPercent)}%</span>
        </div>
        <div className="bg-white bg-opacity-20 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-3 text-amber-100 text-sm">
          {pointsToNext < 500
            ? `${formatNumber(pointsToNext)} points until next reward`
            : "Maximum level reached!"}
        </p>
      </div>
    </section>
  );
}

function FavoriteItems() {
  const favorites = [
    {
      name: "Grilled Salmon",
      price: 28.99,
      image: "🐟",
      category: "Main Course",
    },
    {
      name: "Ocean Platter",
      price: 45.99,
      image: "🦞",
      category: "Seafood",
    },
    {
      name: "Tuna Tartare",
      price: 22.99,
      image: "🍣",
      category: "Appetizer",
    },
  ];

  return (
    <section
      aria-labelledby="favorite-items-heading"
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <h2
        id="favorite-items-heading"
        className="text-lg font-semibold text-gray-900 px-4 pt-5 sm:p-6 mb-4"
      >
        Your Favorites ⭐
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pb-5 sm:px-6 sm:pb-6">
        {favorites.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                {item.image}
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
                <div className="text-ocean-600 font-bold text-lg">
                  {formatCurrency(item.price)}
                </div>
              </div>
              <button className="mt-3 w-full bg-gradient-to-r from-ocean-600 to-primary-600 text-white py-2 px-4 rounded-lg hover:from-ocean-700 hover:to-primary-700 transition-all duration-200 transform hover:scale-105">
                Order Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
