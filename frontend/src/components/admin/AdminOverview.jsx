import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { BarChart3, ShoppingBag, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const AdminOverview = ({ data }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const stats = [
    {
      title: t("totalOrders"),
      value: data?.stats?.total_orders || 0,
      icon: <ShoppingBag className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: t("pendingReservations"),
      value: data?.stats?.pending_reservations || 0,
      icon: <Calendar className="h-8 w-8 text-yellow-500" />,
      color: "bg-yellow-100",
    },
    {
      title: t("totalRevenue"),
      value: `$${data?.stats?.total_revenue || 0}`,
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      color: "bg-green-100",
    },
    {
      title: t("todayOrders"),
      value: data?.stats?.today_orders || 0,
      icon: <ShoppingBag className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-100",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <motion.h1
        className={`text-3xl font-bold mb-8 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {t("dashboardOverview")}
      </motion.h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`rounded-lg shadow p-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders & Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className={`rounded-lg shadow ${isDark ? "bg-gray-800" : "bg-white"}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            className={`p-6 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("recentOrders")}
            </h2>
          </div>
          <div className="p-6">
            {data?.recent_orders?.length > 0 ? (
              <div className="space-y-4">
                {data.recent_orders.map((order) => (
                  <motion.div
                    key={order.id}
                    className={`flex items-center justify-between p-3 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        #{order.order_number}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {order.user?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${order.total_amount}
                      </p>
                      <Badge
                        variant={
                          order.status === "pending" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {t("noRecentOrders")}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          className={`rounded-lg shadow ${isDark ? "bg-gray-800" : "bg-white"}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            className={`p-6 border-b ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("popularItems")}
            </h2>
          </div>
          <div className="p-6">
            {data?.popular_items?.length > 0 ? (
              <div className="space-y-4">
                {data.popular_items.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${item.price}
                      </p>
                      <Badge variant="secondary">{t("popular")}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {t("noPopularItemsData")}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;


