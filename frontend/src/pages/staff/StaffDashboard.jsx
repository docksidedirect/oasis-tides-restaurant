import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'
import { dashboardAPI, orderAPI, reservationAPI } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  ClipboardList,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  BookOpen,
  UserCog,
  Cog
} from 'lucide-react'
import { motion } from 'framer-motion'

const StaffDashboard = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const location = useLocation()

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['staffDashboard'],
    queryFn: async () => {
      const response = await dashboardAPI.getDashboard()
      return response.data
    }
  })

  const sidebarItems = [
    { path: '/staff', label: t('overview'), icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/staff/orders', label: t('orders'), icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/staff/reservations', label: t('reservations'), icon: <Calendar className="h-5 w-5" /> },
    { path: '/staff/kitchen', label: t('kitchenDisplay'), icon: <Clock className="h-5 w-5" /> },
  ]

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500"></div>
        <span className="ml-3 text-lg font-medium">{t('loading')}</span>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <motion.div
        className={`w-64 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('staffDashboard')}</h2>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-colors duration-200 ${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'} ${
                location.pathname === item.path ? (isDark ? 'bg-gray-700 text-white border-r-4 border-amber-500' : 'bg-blue-50 text-blue-600 border-r-4 border-blue-600') : ''
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
          <Route path="/" element={<StaffOverview data={dashboardData} />} />
          <Route path="/orders" element={<StaffOrders />} />
          <Route path="/reservations" element={<StaffReservations />} />
          <Route path="/kitchen" element={<KitchenDisplay />} />
        </Routes>
      </motion.div>
    </div>
  )
}

// Staff Overview Component
const StaffOverview = ({ data }) => {
  const { t } = useLanguage()
  const { isDark } = useTheme()

  const stats = [
    {
      title: t('pendingOrders'),
      value: data?.stats?.pending_orders || 0,
      icon: <ClipboardList className="h-8 w-8 text-orange-500" />,
      color: 'bg-orange-100'
    },
    {
      title: t('todaysReservations'),
      value: data?.stats?.today_reservations || 0,
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100'
    },
    {
      title: t('activeTables'),
      value: '12', // This would come from a table management system
      icon: <Users className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100'
    },
    {
      title: t('kitchenQueue'),
      value: '8', // This would come from kitchen management
      icon: <Clock className="h-8 w-8 text-red-500" />,
      color: 'bg-red-100'
    }
  ]

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <motion.h1
        className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {t('staffOverview')}
      </motion.h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{stat.title}</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Orders */}
        <motion.div
          className={`rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('newOrders')}</h2>
          </div>
          <div className="p-6">
            {data?.new_orders?.length > 0 ? (
              <div className="space-y-4">
                {data.new_orders.map((order) => (
                  <motion.div
                    key={order.id}
                    className={`flex items-center justify-between p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>#{order.order_number}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{order.order_type}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>${order.total_amount}</p>
                      <Badge variant="default">{t('new')}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('noNewOrders')}</p>
            )}
          </div>
        </motion.div>

        {/* Upcoming Reservations */}
        <motion.div
          className={`rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('upcomingReservations')}</h2>
          </div>
          <div className="p-6">
            {data?.upcoming_reservations?.length > 0 ? (
              <div className="space-y-4">
                {data.upcoming_reservations.map((reservation) => (
                  <motion.div
                    key={reservation.id}
                    className={`flex items-center justify-between p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{reservation.name}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {reservation.reservation_time} - {reservation.party_size} {t('people')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{t('confirmed')}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('noUpcomingReservations')}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Staff Orders Component
const StaffOrders = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const { data: orders, isLoading } = useQuery({
    queryKey: ['staffOrders'],
    queryFn: async () => {
      const response = await orderAPI.getOrders()
      return response.data.orders
    }
  })

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status)
      // Refetch orders or update cache
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const tableVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return <div className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('loadingOrders')}</div>
  }

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('orderManagement')}</h1>

      <motion.div
        className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('order')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('customer')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('type')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('status')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('total')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('actions')}
              </th>
            </tr>
          </thead>
          <motion.tbody
            className={`${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {orders?.map((order) => (
              <motion.tr key={order.id} variants={rowVariants}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  #{order.order_number}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {order.user?.name || t('guest')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className="capitalize">
                    {order.order_type?.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={
                      order.status === 'pending' ? 'default' :
                      order.status === 'confirmed' ? 'secondary' :
                      order.status === 'preparing' ? 'default' :
                      order.status === 'ready' ? 'default' : 'secondary'
                    }
                  >
                    {t(order.status)}
                  </Badge>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {t('confirm')}
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {t('startPreparing')}
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {t('markReady')}
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </div>
  )
}

// Staff Reservations Component
const StaffReservations = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['staffReservations'],
    queryFn: async () => {
      const response = await reservationAPI.getReservations()
      return response.data.reservations
    }
  })

  const tableVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return <div className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('loadingReservations')}</div>
  }

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('reservationManagement')}</h1>
      <motion.div
        className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('name')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('date')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('time')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('partySize')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('status')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                {t('actions')}
              </th>
            </tr>
          </thead>
          <motion.tbody
            className={`${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {reservations?.map((reservation) => (
              <motion.tr key={reservation.id} variants={rowVariants}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {reservation.user?.name || t('guest')}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {new Date(reservation.reservation_date).toLocaleDateString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {reservation.reservation_time}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {reservation.party_size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}>
                    {t(reservation.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className={`${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className={`${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className={`${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </div>
  )
}

// Kitchen Display Component
const KitchenDisplay = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('kitchenDisplay')}</h1>
      <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('kitchenDisplayMessage')}</p>
      </div>
    </div>
  )
}

export default StaffDashboard


