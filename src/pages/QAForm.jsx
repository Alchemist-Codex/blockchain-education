import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const QAForm = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();

  const emailSanitize = (email) => email.replace(/[@.]/g, "_");

  const [studentDetails, setStudentDetails] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    mobileNumber: '',
    nationality: '',
    instituteName: '',
    course: '',
    startDate: '',
    endDate: '',
    credentials :[],
  });

  const resetHandler = () => {
    setStudentDetails({
      name: '',
      age: '',
      gender: '',
      email: '',
      mobileNumber: '',
      nationality: '',
      instituteName: '',
      course: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to submit this form');
      return;
    }

    if (userType !== 'student') {
      toast.error('Only students can submit this form');
      return;
    }

    try {
      // Store in students collection using user's UID
      const studentRef = doc(db, 'students', user.uid);
      await setDoc(studentRef, {
        ...studentDetails,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast.success('Form submitted successfully');
      navigate('/student/dashboard');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const handleStudentDetailsChange = (e) => {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <form
        className="bg-blue-100 dark:bg-blue-900 p-8 rounded-lg shadow-md max-w-4xl mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mb-6">Student Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['name', 'age', 'gender', 'email', 'mobileNumber', 'nationality'].map((field, index) => (
            <div key={index}>
              <label className="block text-blue-800 dark:text-blue-100 font-medium">{field}</label>
              <input
                type={field === 'age' || field === 'mobileNumber' ? 'number' : 'text'}
                name={field}
                value={studentDetails[field]}
                onChange={handleStudentDetailsChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mt-8 mb-6">Course Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['instituteName', 'course', 'startDate', 'endDate'].map((field, index) => (
            <div key={index}>
              <label className="block text-blue-800 dark:text-blue-100 font-medium">{field}</label>
              <input
                type={field === 'startDate' || field === 'endDate' ? 'date' : 'text'}
                name={field}
                value={studentDetails[field]}
                onChange={handleStudentDetailsChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={resetHandler}
            className="bg-gray-400 text-white px-4 py-2 rounded-md mr-4"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default QAForm;
