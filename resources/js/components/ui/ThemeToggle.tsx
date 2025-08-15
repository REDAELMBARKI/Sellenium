import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Theme toggle component for switching between light and dark modes
 * Features smooth animations and visual feedback
 */
export const ThemeToggle: React.FC = () => {
  const { state, dispatch } = useTheme();

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-full transition-all duration-300 
        ${state.isDarkMode 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: state.isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {state.isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </motion.button>
  );
};