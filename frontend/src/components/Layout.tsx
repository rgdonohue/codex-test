import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-100 dark:to-dark-200 transition-colors duration-300">
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700"
              >
                GIS Explorer
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 dark:border-dark-300 hover:bg-white/20 transition-colors"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FiMoon className="w-5 h-5 text-primary-600" />
                )}
              </motion.button>
            </div>
          </div>
        </header>

        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/70 dark:bg-dark-200/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-dark-300/20 p-6">
              {children}
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2025 GIS Explorer. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
} 