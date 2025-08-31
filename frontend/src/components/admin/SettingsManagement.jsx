import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const SettingsManagement = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className={`p-6 rounded-lg shadow ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {t('settingsManagement')}
      </h1>
      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {t('settingsManagementDescription')}
      </p>
      {/* Add your settings forms and components here */}
      <div className="mt-8">
        {/* Example: Theme settings */}
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('themeSettings')}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('themeSettingsDescription')}
        </p>
        {/* You can add a toggle for dark/light mode here if not already in Navbar */}
      </div>
    </motion.div>
  );
};

export default SettingsManagement;


