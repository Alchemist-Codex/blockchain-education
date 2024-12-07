import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import CredentialUpload from './pages/CredentialUpload'
import CredentialVerification from './pages/CredentialVerification'
import Profile from './pages/Profile'
import About from './pages/About'
import FAQ from './pages/FAQ'
import './App.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Web3Provider } from './contexts/Web3Context'
import IPFSTest from './components/IPFSTest'
import MetaMaskConnect from './components/MetaMaskConnect'
import IPFSStatus from './components/IPFSStatus'

function App() {
  return (
    <ThemeProvider>
      <Web3Provider>
        <MetaMaskConnect />
        <IPFSStatus />
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<CredentialUpload />} />
                <Route path="/verify" element={<CredentialVerification />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <IPFSTest />
      </Web3Provider>
    </ThemeProvider>
  )
}

export default App
