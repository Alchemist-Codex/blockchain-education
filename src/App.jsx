import { AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import About from './pages/About'
import SignIn from './pages/SignIn'
import CredentialUpload from './pages/CredentialUpload'
import CredentialVerification from './pages/CredentialVerification'
import FAQ from './pages/FAQ'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { Web3Provider } from './contexts/Web3Context'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <>
      {/* <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/upload" element={<CredentialUpload />} />
          <Route path="/verify" element={<CredentialVerification />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </AnimatePresence>
      <Footer /> */}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </Web3Provider>
    </AuthProvider>
  )
}

export default App
