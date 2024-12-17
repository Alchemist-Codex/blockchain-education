import React from 'react';

function ProfilePage(props) {
  return (
    <div className="min-h-screen p-6 md:p-12 bg-blue-50 dark:bg-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        {props.userType === 'student' ? (
          <>
            <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">Student Profile</h1>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Student Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Age:</strong> 22</p>
                <p><strong>Gender:</strong> Male</p>
                <p><strong>Email:</strong> john.doe@example.com</p>
                <p><strong>Phone Number:</strong> +1234567890</p>
                <p><strong>Nationality:</strong> American</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Course Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Institute Name:</strong> Academic Institute</p>
                <p><strong>Course:</strong> Computer Science</p>
                <p><strong>Starting Date:</strong> 01/09/2023</p>
                <p><strong>Ending Date:</strong> 30/06/2027</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">Institute Profile</h1>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Institute Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Name:</strong> Academic Institute</p>
                <p><strong>Email:</strong> contact@academicinstitute.com</p>
                <p><strong>Official Website:</strong> www.academicinstitute.com</p>
                <p><strong>Year of Establishment:</strong> 1990</p>
                <p><strong>Address:</strong> 123 Academic Lane, Knowledge City, USA</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
