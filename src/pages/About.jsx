import { motion } from 'framer-motion'

function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const teamMembers = [
    {
      name: 'Ritaban Ghosh',
      role: 'Lead Developer',
      image: '/path/to/image1.jpg', // Replace with actual image paths
      description: 'Blockchain specialist with expertise in academic credentials'
    },
    {
      name: 'Ritaban Ghosh',
      role: 'Product Manager',
      image: '/path/to/image2.jpg',
      description: 'Expert in educational technology and digital transformation'
    },
    {
      name: 'Ritaban Ghosh',
      role: 'Security Expert',
      image: '/path/to/image3.jpg',
      description: 'Specialized in blockchain security and cryptography'
    }
  ]

  const features = [
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Lightning Fast",
      description: "Instant verification of academic credentials"
    },
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      title: "Secure by Design",
      description: "Built with state-of-the-art blockchain security"
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Tamper-Proof",
      description: "Immutable records on the blockchain"
    },
    {
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
      title: "Highly Configurable",
      description: "Flexible system that adapts to your needs"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          {...fadeIn}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Academic Chain
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing academic credential verification through blockchain technology
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-16"
          {...fadeIn}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We're on a mission to make academic credential verification seamless, secure, and accessible worldwide. 
              By leveraging blockchain technology, we're creating a future where credentials can be instantly verified 
              while maintaining the highest levels of security and authenticity.
            </p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          className="mb-16"
          {...fadeIn}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section {...fadeIn}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-500">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Have questions about our platform? We'd love to hear from you.
          </p>
          <motion.button
            className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg
                     hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </motion.section>
      </div>
    </div>
  )
}

export default About 