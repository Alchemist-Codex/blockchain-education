import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition'

function About() {
  const features = [
    {
      title: "Blockchain-Based Verification",
      description: "Our platform leverages blockchain technology to ensure the authenticity and immutability of academic credentials.",
      icon: "🔐"
    },
    {
      title: "Instant Verification",
      description: "Verify academic credentials instantly, eliminating lengthy verification processes.",
      icon: "⚡"
    },
    {
      title: "Secure Storage",
      description: "All credentials are securely stored and encrypted using advanced blockchain technology.",
      icon: "🔒"
    },
    {
      title: "Easy Integration",
      description: "Seamlessly integrate with existing academic systems and processes.",
      icon: "🔄"
    }
  ]

  const teamMembers = [
    {
      name: "Ritaban Ghosh",
      role: "Frontend Developer",
      image: "/ritaban.jpg",
    },
    {
      name: "Koustav Singh",
      role: "Backend Developer",
      image: "/koustav.jpg",
    },
    {
      name: "Sougata Mondal",
      role: "Not yet contributed",
      image: "/sougata.jpeg",
    },
    {
      name: "Anjali Ray",
      role: "Not yet contributed",
      image: "/anjali.jpeg",
    }
  ]

  return (
    <PageTransition>
      
      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Academic Chain
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Revolutionizing academic credential verification through blockchain technology
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
              To create a transparent, secure, and efficient system for academic credential verification,
              empowering institutions and individuals with trustworthy digital certification solutions.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative w-32 h-32 mx-auto mb-4 group">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover shadow-lg"
                      onError={(e) => {
                        console.error('Image failed to load:', member.image);
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default About 
