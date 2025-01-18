// Import necessary dependencies and components
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getUserProfile } from '../services/userService'
import { PageTransition } from '../components/PageTransition'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

// Define constants
const USER_TYPES = {
  STUDENT: 'student',
  INSTITUTE: 'institute'
};

function StudentDashboard() {
  // Get user from auth context
  const { user } = useAuth();
  // State for storing user profile data
  const [userProfile, setUserProfile] = useState(null);
  // State for managing active tab
  const [activeTab, setActiveTab] = useState('received')
  // State for storing credentials
  const [credentials, setCredentials] = useState([]);
  // State for managing loading state
  const [loading, setLoading] = useState(true);

  // Fetch user profile and credentials when component mounts
  useEffect(() => {
    const fetchStudentCredentials = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // First, get the student document
        const studentDoc = await getDoc(doc(db, 'students', user.uid));
        console.log('Student doc:', studentDoc.data());

        if (!studentDoc.exists()) {
          console.log('No student document found');
          return;
        }

        const studentData = studentDoc.data();
        setUserProfile(studentData);

        // Check if student has credentials
        if (!studentData.credentials || studentData.credentials.length === 0) {
          console.log('No credentials found for student');
          setCredentials([]);
          return;
        }

        console.log('Found credentials:', studentData.credentials);

        // Fetch each credential document
        const credentialPromises = studentData.credentials.map(async (credentialId) => {
          const credDoc = await getDoc(doc(db, 'credentials', credentialId));
          if (credDoc.exists()) {
            return { id: credDoc.id, ...credDoc.data() };
          }
          console.log('Credential not found:', credentialId);
          return null;
        });

        const fetchedCredentials = await Promise.all(credentialPromises);
        const validCredentials = fetchedCredentials.filter(cred => cred !== null);
        console.log('Fetched credentials:', validCredentials);
        
        setCredentials(validCredentials);
      } catch (error) {
        console.error('Error fetching credentials:', error);
        toast.error('Failed to load credentials');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCredentials();
  }, [user]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading credentials...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Static statistics data
  const stats = [
    { label: 'Total Credentials', value: '4' },
    { label: 'Verified', value: '3' },
    { label: 'Pending', value: '1' },
    { label: 'Shared', value: '2' }
  ]

  return (
    <PageTransition>
      {/* Main container with padding */}
      <div className="relative min-h-screen p-6">
        {/* Main content wrapper with animation */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Welcome banner with gradient background */}
          <motion.div 
            className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {userProfile?.displayName || 'Student'}!
            </h1>
            <p className="text-primary-100">
              Manage and share your academic credentials
            </p>
          </motion.div>

          {/* Statistics grid section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              // Individual stat card with animation
              <motion.div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Credentials list section */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              My Credentials
            </h2>
            <div className="space-y-4">
              {credentials.length > 0 ? (
                credentials.map((credential, index) => (
                  <motion.div
                    key={credential.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {credential.type}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {credential.institution} • {new Date(credential.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          ID: {credential.id}
                        </p>
                      </div>
                      {credential.cid && (
                        <button 
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                          onClick={() => window.open(`https://ipfs.io/ipfs/${credential.cid}`, '_blank')}
                        >
                          
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No credentials found
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default StudentDashboard; 