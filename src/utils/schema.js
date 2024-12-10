export const userTypes = {
  STUDENT: 'student',
  INSTITUTE: 'institute'
};

export const collections = {
  USERS: 'users',
  CREDENTIALS: 'credentials',
  INSTITUTIONS: 'institutions',
  STUDENTS: 'students'
};

export const studentSchema = {
  email: '',
  userType: userTypes.STUDENT,
  displayName: '',
  institution: '',
  enrollmentNumber: '',
  program: '',
  graduationYear: '',
  credentials: [], // Array of credential IDs
  createdAt: '',
  updatedAt: ''
};

export const instituteSchema = {
  email: '',
  userType: userTypes.INSTITUTE,
  instituteName: '',
  address: '',
  website: '',
  accreditationNumber: '',
  authorizedSignatories: [], // Array of authorized email addresses
  issuedCredentials: [], // Array of credential IDs
  createdAt: '',
  updatedAt: ''
}; 