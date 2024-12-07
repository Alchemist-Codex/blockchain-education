import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import { AuthProvider } from './contexts/AuthContext'
import SignIn from './pages/SignIn'
import { useAuth } from './contexts/AuthContext'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  // Redirect to signin if not authenticated
  if (!user && window.location.pathname !== '/signin') {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <MetaMaskConnect />}
      <Routes>
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/" element={
          <ProtectedRoute>
            <div>Your main content here</div>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<CredentialUpload />} />
        <Route path="/verify" element={<CredentialVerification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <AppContent />
        </Web3Provider>
      </AuthProvider>
    </Router>
  )
}

export default App
