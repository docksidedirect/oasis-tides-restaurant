import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { dashboardAPI } from "../../lib/api";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Calendar,
  BookOpen,
  UserCog,
  Cog,
} from "lucide-react";
import AdminOverview from "../../components/admin/AdminOverview";
import MenuManagement from "../../components/admin/MenuManagement";
import OrderManagement from "../../components/admin/OrderManagement";
import ReservationManagement from "../../components/admin/ReservationManagement";
import BlogManagement from "../../components/admin/BlogManagement";
import UserManagement from "../../components/admin/UserManagement";
import SettingsManagement from "../../components/admin/SettingsManagement";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const location = useLocation();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const response = await dashboardAPI.getDashboard();
      return response.data;
    },
  });

  const sidebarItems = [
    {
      path: "/admin",
      label: t("overview"),
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/admin/menu",
      label: t("menuManagement"),
      icon: <Utensils className="h-5 w-5" />,
    },
    {
      path: "/admin/orders",
      label: t("orders"),
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      path: "/admin/reservations",
      label: t("reservations"),
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      path: "/admin/blog",
      label: t("blogPosts"),
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: "/admin/users",
      label: t("users"),
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      path: "/admin/settings",
      label: t("settings"),
      icon: <Cog className="h-5 w-5" />,
    },
  ];

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500"></div>
        <span className="ml-3 text-lg font-medium">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <motion.div
        className={`w-64 shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("adminDashboard")}
          </h2>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors duration-200 ${
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              } ${
                location.pathname === item.path
                  ? isDark
                    ? "bg-gray-700 text-white border-r-4 border-amber-500"
                    : "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : ""
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Routes>
          <Route path="/" element={<AdminOverview data={dashboardData} />} />
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/reservations" element={<ReservationManagement />} />
          <Route path="/blog" element={<BlogManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<SettingsManagement />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;


