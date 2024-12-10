import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import Homepage from './pages/Homepage'
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
          <Routes>
            {/* Public routes with navbar */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/verify" element={<CredentialVerification />} />
            </Route>

            {/* Authentication routes (no navbar) */}
            <Route path="/signin" element={<SignIn />} />
            
            {/* Student protected routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredUserType={userTypes.STUDENT}>
                  <ProtectedLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<Profile />} />
              {/* Add other student-specific routes here */}
            </Route>
            
            {/* Institution protected routes */}
            <Route
              path="/institution"
              element={
                <ProtectedRoute requiredUserType={userTypes.INSTITUTE}>
                  <ProtectedLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<InstituteDashboard />} />
              <Route path="upload-credential" element={<CredentialUpload />} />
              <Route path="profile" element={<Profile />} />
              {/* Add other institution-specific routes here */}
            </Route>

            {/* Unauthorized Access Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Root redirect */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Web3Provider>
  )
}

// Public layout with navbar
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

// Protected layout with navbar
function ProtectedLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

// Component to handle role-based redirects
function RoleBasedRedirect() {
  const { user, userType } = useAuth();
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  switch (userType) {
    case userTypes.STUDENT:
      return <Navigate to="/student/dashboard" replace />;
    case userTypes.INSTITUTE:
      return <Navigate to="/institution/dashboard" replace />;
    default:
      console.log('Unknown user type:', userType);
      return <Navigate to="/signin" replace />;
  }
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
