'use client';

import { motion } from 'framer-motion';
import { FiMap, FiNavigation, FiSearch } from 'react-icons/fi';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
            Explore the World
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover locations, calculate distances, and visualize spatial data with our powerful GIS platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FiMap,
              title: 'Interactive Maps',
              description: 'Explore locations with our intuitive mapping interface',
            },
            {
              icon: FiNavigation,
              title: 'Distance Calculator',
              description: 'Calculate precise distances between any two points',
            },
            {
              icon: FiSearch,
              title: 'Location Search',
              description: 'Find and analyze locations with advanced search tools',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl bg-white/50 dark:bg-dark-200/50 backdrop-blur-sm border border-white/20 dark:border-dark-300/20 hover:border-primary-500/50 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            Get Started
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
