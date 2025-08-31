import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTheme } from '../../contexts/ThemeContext'
import { dashboardAPI, orderAPI, reservationAPI } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  User,
  ShoppingBag,
  Calendar,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  UserCog,
  Cog
} from 'lucide-react'
import { motion } from 'framer-motion'

const ClientDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const location = useLocation()

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['clientDashboard'],
    queryFn: async () => {
      const response = await dashboardAPI.getDashboard()
      return response.data
    }
  })

  const sidebarItems = [
    { path: '/client', label: t('overview'), icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/client/orders', label: t('myOrders'), icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/client/reservations', label: t('myReservations'), icon: <Calendar className="h-5 w-5" /> },
    { path: '/client/favorites', label: t('favorites'), icon: <Heart className="h-5 w-5" /> },
    { path: '/client/profile', label: t('profile'), icon: <UserCog className="h-5 w-5" /> },
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
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{user?.name?.charAt(0)}</span>
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Client</p>
            </div>
          </div>
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
          <Route path="/" element={<ClientOverview data={dashboardData} user={user} />} />
          <Route path="/orders" element={<ClientOrders />} />
          <Route path="/reservations" element={<ClientReservations />} />
          <Route path="/favorites" element={<ClientFavorites />} />
          <Route path="/profile" element={<ClientProfile user={user} />} />
        </Routes>
      </motion.div>
    </div>
  )
}

// Client Overview Component
const ClientOverview = ({ data, user }) => {
  const { t } = useLanguage()
  const { isDark } = useTheme()

  const stats = [
    {
      title: t('totalOrders'),
      value: data?.stats?.user_total_orders || 0,
      icon: <ShoppingBag className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100'
    },
    {
      title: t('reservations'),
      value: data?.stats?.user_reservations || 0,
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100'
    },
    {
      title: t('favoriteItems'),
      value: data?.stats?.user_favorites || 0,
      icon: <Heart className="h-8 w-8 text-red-500" />,
      color: 'bg-red-100'
    },
    {
      title: t('loyaltyPoints'),
      value: data?.stats?.loyalty_points || 0,
      icon: <User className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-100'
    }
  ]

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <motion.h1
        className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {t('welcomeBack')}, {user?.name}!
      </motion.h1>
      <motion.p
        className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {t('accountSummary')}
      </motion.p>
      
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
        {/* Recent Orders */}
        <motion.div
          className={`rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('recentOrders')}</h2>
          </div>
          <div className="p-6">
            {data?.recent_orders?.length > 0 ? (
              <div className="space-y-4">
                {data.recent_orders.map((order) => (
                  <motion.div
                    key={order.id}
                    className={`flex items-center justify-between p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>#{order.order_number}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>${order.total_amount}</p>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {t(order.status)}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('noOrdersYet')}</p>
                <Link to="/menu">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t('browseMenu')}</Button>
                </Link>
              </div>
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
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(reservation.reservation_date).toLocaleDateString()}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {reservation.reservation_time} - {reservation.party_size} {t('people')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default">{t('confirmed')}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('noUpcomingReservations')}</p>
                <Link to="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t('makeReservation')}</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className={`mt-8 rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/menu">
            <Button variant="outline" className={`w-full ${isDark ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              {t('orderFood')}
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className={`w-full ${isDark ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
              <Calendar className="h-4 w-4 mr-2" />
              {t('makeReservation')}
            </Button>
          </Link>
          <Link to="/client/profile">
            <Button variant="outline" className={`w-full ${isDark ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
              <User className="h-4 w-4 mr-2" />
              {t('updateProfile')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

// Client Orders Component
const ClientOrders = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const { data: orders, isLoading } = useQuery({
    queryKey: ["clientOrders"],
    queryFn: async () => {
      const response = await orderAPI.getUserOrders();
      return response.data.orders;
    },
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (isLoading) {
    return <div className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('loadingYourOrders')}</div>
  }

  return (
    <div>
      <motion.h1
        className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {t('myOrders')}
      </motion.h1>

      {orders?.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>#{order.order_number}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${order.total_amount}</p>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                    {t(order.status)}
                  </Badge>
                </div>
              </div>
              
              {/* Order Items */}
              <div className={`border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="space-y-2">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.menu_item?.name}</span>
                        <span className={`text-sm ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>x{item.quantity}</span>
                      </div>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>${item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('noOrdersYet')}</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('browseMenuPrompt')}</p>
          <Link to="/menu">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t('browseMenu')}</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

// Client Reservations Component
const ClientReservations = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['clientReservations'],
    queryFn: async () => {
      const response = await reservationAPI.getReservations()
      return response.data.reservations
    }
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (isLoading) {
    return <div className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('loadingYourReservations')}</div>
  }

  return (
    <div>
      <motion.h1
        className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {t('myReservations')}
      </motion.h1>

      {reservations?.length > 0 ? (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('reservation')} #{reservation.id}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {new Date(reservation.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}>
                    {t(reservation.status)}
                  </Badge>
                </div>
              </div>
              
              {/* Reservation Details */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <Calendar className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('date')}</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(reservation.reservation_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('time')}</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{reservation.reservation_time}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className={`h-5 w-5 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('partySize')}</p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{reservation.party_size} {t('people')}</p>
                  </div>
                </div>
              </div>
              
              {reservation.special_requests && (
                <div className={`mt-4 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('specialRequests')}</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{reservation.special_requests}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('noReservationsYet')}</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('makeReservationPrompt')}</p>
          <Link to="/contact">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t('makeReservation')}</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

// Client Favorites Component
const ClientFavorites = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('myFavorites')}</h1>
      <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('favoriteItemsDisplay')}</p>
      </div>
    </div>
  )
}

// Client Profile Component
const ClientProfile = ({ user }) => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('myProfile')}</h1>
      <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('name')}</label>
            <input
              type="text"
              value={user?.name || ''}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
              readOnly
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('email')}</label>
            <input
              type="email"
              value={user?.email || ''}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard


