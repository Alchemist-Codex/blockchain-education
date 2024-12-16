import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition'

/**
 * HomePage Component
 * Landing page showcasing the main features of Academic Chain
 */
function HomePage() {
  // Animation configuration for fade-in effect
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }

  // Feature cards data
  const features = [
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      title: "Secure Storage",
      description: "Store credentials on immutable blockchain"
    },
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Easy Verification",
      description: "Instant credential verification"
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Tamper-proof",
      description: "Cryptographically secured records"
    }
  ]

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        {/* Hero Section with Gradient Background */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 text-white py-20">
          {/* Hero Content Container */}
          <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
              Welcome to Academic Chain
            </h1>
            {/* Subtitle */}
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-100">
              Issue, manage, and verify academic credentials with confidence using blockchain technology
            </p>

            {/* Call-to-Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Primary CTA - Issue Credential */}
              <Link 
                to="/institution/upload-credential" 
                className="btn bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transform transition-all"
              >
                Issue Credential
              </Link>
              {/* Secondary CTA - Verify Credential */}
              <Link 
                to="/verify" 
                className="btn bg-transparent border-2 border-white hover:bg-white/10 hover:scale-105 transform transition-all"
              >
                Verify Credential
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section with Cards */}
        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Features Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Title with Animation */}
              <motion.h2 
                className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Why Choose Academic Chain?
              </motion.h2>
              {/* Section Description */}
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Our platform provides secure, efficient, and transparent credential management
              </motion.p>
            </motion.div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* Feature Icon */}
                  <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  {/* Feature Title and Description */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default HomePage
