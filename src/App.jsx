import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
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
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Web3Provider } from './contexts/Web3Context'
import ProtectedRoute from './components/ProtectedRoute'
import { userTypes } from './utils/schema'
import StudentDashboard from './pages/StudentDashboard'
import InstituteDashboard from './pages/InstituteDashboard'

function App() {
  return (
    <Web3Provider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              {/* Public routes */}
              <Route path="/signin" element={<SignIn />} />
              
              {/* Root redirect based on user type */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRedirect />
                  </ProtectedRoute>
                } 
              />
              
              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredUserType={userTypes.STUDENT}>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <StudentDashboard />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              
              {/* Institution Routes */}
              <Route
                path="/institution/dashboard"
                element={
                  <ProtectedRoute requiredUserType={userTypes.INSTITUTE}>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-grow">
                        <InstituteDashboard />
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Unauthorized Access Page */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </Web3Provider>
  )
}

// Component to handle role-based redirects
function RoleBasedRedirect() {
  const { userType } = useAuth();
  
  if (userType === userTypes.STUDENT) {
    return <Navigate to="/student/dashboard" replace />;
  }
  
  if (userType === userTypes.INSTITUTE) {
    return <Navigate to="/institution/dashboard" replace />;
  }
  
  return <Navigate to="/signin" replace />;
}

// Simple unauthorized page
function UnauthorizedPage() {
  const { userType } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page.
        </p>
        <Link
          to={userType === userTypes.STUDENT ? '/student/dashboard' : '/institution/dashboard'}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default App
