// Define user type constants for role-based access
export const userTypes = {
  STUDENT: 'student',
  INSTITUTE: 'institute'
};

// Define Firestore collection names for data organization
export const collections = {
  USERS: 'users',          // General user information
  CREDENTIALS: 'credentials', // Academic credentials
  INSTITUTIONS: 'institutions', // Institution profiles
  STUDENTS: 'students'     // Student profiles
};

/**
 * Schema definition for student profile data
 * Contains all necessary fields for student information
 */
export const studentSchema = {
  email: '',              // Student's email address
  userType: userTypes.STUDENT, // User type identifier
  displayName: '',        // Student's full name
  institution: '',        // Current institution name
  enrollmentNumber: '',   // Institution-specific enrollment ID
  program: '',           // Academic program name
  graduationYear: '',    // Expected/actual graduation year
  credentials: [],       // Array of credential IDs issued to student
  createdAt: '',        // Timestamp of profile creation
  updatedAt: ''         // Timestamp of last profile update
};

/**
 * Schema definition for institution profile data
 * Contains all necessary fields for institution information
 */
export const instituteSchema = {
  email: '',            // Institution's primary email
  userType: userTypes.INSTITUTE, // User type identifier
  instituteName: '',    // Official institution name
  address: '',         // Physical address
  website: '',         // Official website URL
  accreditationNumber: '', // Official accreditation ID
  authorizedSignatories: [], // List of emails authorized to issue credentials
  issuedCredentials: [], // List of credentials issued by institution
  createdAt: '',      // Timestamp of profile creation
  updatedAt: ''       // Timestamp of last profile update
}; 