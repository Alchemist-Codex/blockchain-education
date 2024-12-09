import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/signin" element={<SignIn />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <HomePage />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <Dashboard />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <Profile />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <About />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <CredentialUpload />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <CredentialVerification />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <FAQ />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Web3Provider>
      </AuthProvider>
    </Router>
  )
}

export default App
