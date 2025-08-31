import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { reservationAPI } from '../lib/api'
import { Button } from '../components/ui/button'
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const Reservations = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [reservationComplete, setReservationComplete] = useState(false)
  const [reservationId, setReservationId] = useState(null)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    reservation_date: '',
    reservation_time: '',
    party_size: '',
    special_requests: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await reservationAPI.createReservation(formData)
      
      if (response.data.success) {
        setReservationId(response.data.reservation_id)
        setReservationComplete(true)
      } else {
        throw new Error(response.data.message || 'Failed to create reservation')
      }
    } catch (error) {
      console.error('Reservation creation failed:', error)
      setError(error.response?.data?.message || 'Failed to create reservation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTimeSlots = () => {
    const slots = []
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('pleaseLoginToReserve')}</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('loginToBookTable')}</p>
          <Button onClick={() => navigate('/login')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
            {t('login')}
          </Button>
        </motion.div>
      </div>
    )
  }

  if (reservationComplete) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <motion.div
          className={`text-center max-w-md mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('reservationConfirmed')}</h2>
          <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('thankYouForReservation')}</p>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('reservationId')}: #{reservationId}</p>
          <div className={`rounded-lg p-4 mb-6 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-blue-900'}`}>{t('reservationDetails')}:</h3>
            <div className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-blue-800'}`}>
              <p><strong>{t('date')}:</strong> {formData.reservation_date}</p>
              <p><strong>{t('time')}:</strong> {formData.reservation_time}</p>
              <p><strong>{t('partySize')}:</strong> {formData.party_size} {t('people')}</p>
              <p><strong>{t('name')}:</strong> {formData.name}</p>
              <p><strong>{t('phone')}:</strong> {formData.phone}</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button onClick={() => navigate('/client/reservations')} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {t('viewMyReservations')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className={`w-full ${isDark ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
              {t('backToHome')}
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <motion.div
        className={`py-16 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'}`}
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('makeAReservation')}</h1>
            <p className="text-xl max-w-2xl mx-auto">
              {t('bookTableDescription')}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <motion.div
            className={`rounded-lg shadow-sm p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('reservationDetails')}</h2>
            
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('emailAddress')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                />
              </div>

              {/* Reservation Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="reservation_date" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Calendar className="inline h-4 w-4 mr-1" />
                    {t('date')} *
                  </label>
                  <input
                    type="date"
                    id="reservation_date"
                    name="reservation_date"
                    required
                    min={getMinDate()}
                    value={formData.reservation_date}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  />
                </div>
                <div>
                  <label htmlFor="reservation_time" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Clock className="inline h-4 w-4 mr-1" />
                    {t('time')} *
                  </label>
                  <select
                    id="reservation_time"
                    name="reservation_time"
                    required
                    value={formData.reservation_time}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="">{t('selectTime')}</option>
                    {getTimeSlots().map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="party_size" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Users className="inline h-4 w-4 mr-1" />
                    {t('partySize')} *
                  </label>
                  <select
                    id="party_size"
                    name="party_size"
                    required
                    value={formData.party_size}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  >
                    <option value="">{t('selectSize')}</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(size => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? t('person') : t('people')}
                      </option>
                    ))}
                    <option value="11+">{t('11plusPeople')}</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="special_requests" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('specialRequests')}
                </label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  rows={4}
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500'}`}
                  placeholder={t('specialRequestsPlaceholder')}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isLoading ? t('booking') : t('bookTable')}
              </Button>
            </form>
          </motion.div>

          {/* Restaurant Information */}
          <div className="space-y-6">
            <motion.div
              className={`rounded-lg shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('restaurantHours')}</h3>
              <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex justify-between">
                  <span>{t('mondayThursday')}</span>
                  <span>11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('fridaySaturday')}</span>
                  <span>11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('sunday')}</span>
                  <span>12:00 PM - 9:00 PM</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={`rounded-lg shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ delay: 0.1 }}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('reservationPolicy')}</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('reservationsAdvance')}</li>
                <li>• {t('arriveOnTime')}</li>
                <li>• {t('largePartyCall')}</li>
                <li>• {t('cancellationPolicy')}</li>
                <li>• {t('tableHoldPolicy')}</li>
              </ul>
            </motion.div>

            <motion.div
              className={`rounded-lg shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ delay: 0.2 }}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('contactInformation')}</h3>
              <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p><strong>{t('phone')}:</strong> +1 (555) 123-4567</p>
                <p><strong>{t('email')}:</strong> reservations@oasistides.com</p>
                <p><strong>{t('address')}:</strong> 123 Ocean Drive, Seaside City, SC 29401</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservations


