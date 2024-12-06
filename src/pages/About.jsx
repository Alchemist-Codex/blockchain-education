import './About.css'
import { motion } from 'framer-motion'

function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const steps = [
    {
      title: "Credential Issuance",
      description: "Educational institutions issue digital credentials secured by blockchain"
    },
    {
      title: "Secure Storage",
      description: "Credentials are stored immutably on the blockchain"
    },
    {
      title: "Easy Verification",
      description: "Instant verification for employers and other institutions"
    }
  ]

  const benefits = [
    {
      title: "For Students",
      benefits: ["Secure digital credential storage", "Easy sharing with employers", "Instant verification"]
    },
    {
      title: "For Institutions",
      benefits: ["Reduced administrative burden", "Fraud prevention", "Enhanced credibility"]
    },
    {
      title: "For Employers",
      benefits: ["Quick credential verification", "Reduced hiring risks", "Time and cost savings"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white py-24">
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 400 + 100,
                height: Math.random() * 400 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Academic Chain
          </motion.h1>
          <motion.p 
            className="text-xl text-primary-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Revolutionizing academic credential verification through blockchain technology
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Mission Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            Academic Chain aims to create a secure, transparent, and efficient system
            for issuing, managing, and verifying academic credentials using blockchain
            technology. We're committed to reducing credential fraud and simplifying
            the verification process for educational institutions, students, and employers.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  {benefit.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default About 