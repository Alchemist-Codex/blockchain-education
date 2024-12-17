import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
// Page imports
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import About from './pages/About'
import SignIn from './pages/SignIn'
import IntroAnimation from './components/IntroAnimation'
import CredentialUpload from './pages/CredentialUpload'
import CredentialVerification from './pages/CredentialVerification'
import FAQ from './pages/FAQ'
import QAForm from './pages/QAForm';
import QAFormInstitute from './pages/QAFormInstitute'
// Component imports
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// Context imports
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Web3Provider } from './contexts/Web3Context'
import ProtectedRoute from './components/ProtectedRoute'
import { userTypes } from './utils/schema'
// Dashboard variants
import StudentDashboard from './pages/StudentDashboard'
import InstituteDashboard from './pages/InstituteDashboard'

/**
 * Main App component that handles routing and layout structure
 */
function App() {
  return (
    <Web3Provider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Make IntroAnimation the root route */}
            <Route path="/" element={<IntroAnimation />} />
            
            {/* Move other public routes under a different path */}
            <Route element={<PublicLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/verify" element={<CredentialVerification />} />
            </Route>

            {/* Authentication route - no navbar needed */}
            <Route path="/signin" element={<SignIn />} />
            
            {/* Protected routes for students - requires student role */}
            <Route path="/student/*" element={
              <ProtectedRoute requiredUserType={userTypes.STUDENT}>
                <ProtectedLayout />
              </ProtectedRoute>
            }>
             <Route index element={<Navigate to="qa-form" replace />} />
            <Route path="qa-form" element={<QAForm />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<Profile userType="student"/>} />
            </Route>
            
            {/* Protected routes for institutions - requires institute role */}
            <Route path="/institution/*" element={
              <ProtectedRoute requiredUserType={userTypes.INSTITUTE}>
                <ProtectedLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="qa-form-institute" replace />} />
              <Route path="qa-form-institute" element={<QAFormInstitute />} />
              <Route path="dashboard" element={<InstituteDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="upload-credential" element={<CredentialUpload />} />
            </Route>

            {/* Route for unauthorized access attempts */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Smart redirect based on user role */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />

            {/* Fallback route - redirects unknown paths to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />

            {/* Verify Credential - only for students */}
            <Route 
              path="/verify" 
              element={
                <ProtectedRoute requiredUserType={userTypes.STUDENT}>
                  <CredentialVerification />
                </ProtectedRoute>
              } 
            />

            {/* Upload Credential - only for institutes */}
            <Route 
              path="/institution/upload-credential" 
              element={
                <ProtectedRoute requiredUserType={userTypes.INSTITUTE}>
                  <CredentialUpload />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </Router>
    </Web3Provider>
  )
}

/**
 * Layout component for public pages
 * Includes navbar and main content area
 */
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Layout component for protected pages
 * Similar to PublicLayout but used for authenticated routes
 */
function ProtectedLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Component that handles redirects based on user role
 * Redirects to appropriate dashboard or signin page
 */
function RoleBasedRedirect() {
  const { user, userType } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  switch (userType) {
    case userTypes.STUDENT:
      return <Navigate to="/student/qa-form" replace />;
    case userTypes.INSTITUTE:
      return <Navigate to="/institution/qa-form-institute" replace />;
    default:
      console.log('Unknown user type:', userType);
      return <Navigate to="/signin" replace />;
  }
}

/**
 * Component displayed when user attempts to access unauthorized content
 * Provides a link back to their appropriate dashboard
 */
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
          to={userType === userTypes.STUDENT ? '/student/qa-form' : '/institution/qa-form-institute'}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default App
