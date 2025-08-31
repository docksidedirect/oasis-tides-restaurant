import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

const Dashboard = () => {
  const { user, isAdmin, isStaff, isClient } = useAuth()
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        navigate('/admin', { replace: true })
      } else if (isStaff()) {
        navigate('/staff', { replace: true })
      } else if (isClient()) {
        navigate('/client', { replace: true })
      }
    }
  }, [user, navigate, isAdmin, isStaff, isClient])

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500"></div>
      <span className="ml-3 text-lg font-medium">{t('loading')}</span>
    </div>
  )
}

export default Dashboard


