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

function App() {
  return (
    <Router>
      <div className="app-container">
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
  )
}

export default App
