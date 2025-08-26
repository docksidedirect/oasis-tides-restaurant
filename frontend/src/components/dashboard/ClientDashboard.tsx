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
  totalOrders: number;
  totalReservations: number;
  loyaltyPoints: number;
  recentOrders: Order[];
  upcomingReservations: Reservation[];
}

export default function ClientDashboard() {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user orders and reservations concurrently
      const [ordersResponse, reservationsResponse] = await Promise.all([
        orderAPI.getAll(),
        reservationAPI.getAll(),
      ]);

      setStats({
        totalOrders: ordersResponse.data.length,
        totalReservations: reservationsResponse.data.length,
        loyaltyPoints: 1250, // Replace with actual data when available
        recentOrders: ordersResponse.data.slice(0, 3),
        upcomingReservations: reservationsResponse.data.slice(0, 2),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);

      // Fallback: use mock data for demo purposes
      setStats({
        totalOrders: 5,
        totalReservations: 3,
        loyaltyPoints: 1250,
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
          icon="🛒"
          color="green"
          title="Total Orders"
          value={stats?.totalOrders || 0}
        />
        <StatCard
          icon="📅"
          color="blue"
          title="Reservations"
          value={stats?.totalReservations || 0}
        />
        <StatCard
          icon="⭐"
          color="yellow"
          title="Loyalty Points"
          value={stats?.loyaltyPoints || 0}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionLink
              href="/menu"
              icon="🍽️"
              title="Order Food"
              subtitle="Browse our delicious menu"
            />
            <QuickActionLink
              href="/reservations/new"
              icon="📅"
              title="Make Reservation"
              subtitle="Book a table for dining"
            />
            <QuickActionLink
              href="/profile"
              icon="👤"
              title="Update Profile"
              subtitle="Manage your account"
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <ActivitySection
        title="Recent Orders"
        items={stats?.recentOrders || []}
        emptyMessage="No recent orders"
        linkHref="/orders"
        renderItem={(order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div className="font-medium">Order #{order.id}</div>
              <div className="text-sm text-gray-500">{order.date}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">${order.total.toFixed(2)}</div>
              <div className="text-sm text-green-600">{order.status}</div>
            </div>
          </div>
        )}
      />

      {/* Upcoming Reservations */}
      <ActivitySection
        title="Upcoming Reservations"
        items={stats?.upcomingReservations || []}
        emptyMessage="No upcoming reservations"
        linkHref="/reservations"
        renderItem={(reservation) => (
          <div
            key={reservation.id}
            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div>
              <div className="font-medium">{reservation.date}</div>
              <div className="text-sm text-gray-500">
                {reservation.time} • Party of {reservation.party}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600">{reservation.status}</div>
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Modify
              </button>
            </div>
          </div>
        )}
      />

      {/* Loyalty Program */}
      <LoyaltyProgram points={stats?.loyaltyPoints || 0} />

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
}: {
  icon: string;
  color: string;
  title: string;
  value: number;
}) {
  const bgColor =
    {
      green: "bg-green-100",
      blue: "bg-blue-100",
      yellow: "bg-yellow-100",
    }[color] || "bg-gray-100";

  const textColor =
    {
      green: "text-green-600",
      blue: "text-blue-600",
      yellow: "text-yellow-600",
    }[color] || "text-gray-600";

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div
            className={`${bgColor} rounded-md flex items-center justify-center w-8 h-8`}
          >
            <span className={`${textColor} text-xl`}>{icon}</span>
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

function QuickActionLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span className="text-2xl mr-3">{icon}</span>
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </Link>
  );
}

function ActivitySection<T>({
  title,
  items,
  emptyMessage,
  linkHref,
  renderItem,
}: {
  title: string;
  items: T[];
  emptyMessage: string;
  linkHref: string;
  renderItem: (item: T) => JSX.Element;
}) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <Link
            href={linkHref}
            className="text-sm text-ocean-600 hover:text-ocean-500"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map(renderItem)
          ) : (
            <div className="text-center py-4 text-gray-500">
              <span className="text-2xl block mb-2">
                {title === "Recent Orders" ? "🍽️" : "📅"}
              </span>
              <p>{emptyMessage}</p>
              <Link
                href={title === "Recent Orders" ? "/menu" : "/reservations/new"}
                className="text-ocean-600 hover:text-ocean-500 text-sm"
              >
                {title === "Recent Orders" ? "Order now" : "Make a reservation"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoyaltyProgram({ points }: { points: number }) {
  const progressPercent = (points % 500) / 5;

  return (
    <div className="bg-gradient-to-r from-ocean-500 to-primary-500 shadow rounded-lg text-white">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium">Loyalty Program</h3>
            <p className="mt-1 text-ocean-100">You have {points} points</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.floor(points / 100)}</div>
            <div className="text-sm text-ocean-100">Free meals earned</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-ocean-100">
            {500 - (points % 500)} points until next reward
          </p>
        </div>
      </div>
    </div>
  );
}

function FavoriteItems() {
  const favorites = [
    { name: "Grilled Salmon", price: 28.99, image: "🐟" },
    { name: "Ocean Platter", price: 45.99, image: "🦞" },
    { name: "Tuna Tartare", price: 22.99, image: "🍣" },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Your Favorites
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{item.image}</div>
                <div className="font-medium">{item.name}</div>
                <div className="text-ocean-600 font-bold">${item.price}</div>
                <button className="mt-2 w-full bg-ocean-600 text-white py-2 px-4 rounded hover:bg-ocean-700 transition-colors">
                  Order Again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
