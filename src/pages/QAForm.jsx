import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import {db} from "../config/firebase"


export default function QAForm() {

  const emailSanitize = (e)=>{
    e.replace("@","_");
    return e;
  }
  const navigate = useNavigate();
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
    endDate: ''
  });

  

  const handleSubmit = async () => {
    
    // Add form submission logic if needed

    await setDoc(doc(db, "student-data", emailSanitize(studentDetails.email)), {
      studentDetails,
    });
    

    navigate('/student/dashboard');
  };

  const handleStudentDetailsChange = (e) => {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <form className="bg-blue-100 dark:bg-blue-900 p-8 rounded-lg shadow-md max-w-4xl mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mb-6">Student Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium ">Name</label>
            <input
              type="text"
              name="name"
              value={studentDetails.name}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={studentDetails.age}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Gender</label>
            <select
              name="gender"
              value={studentDetails.gender}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={studentDetails.email}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={studentDetails.mobileNumber}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={studentDetails.nationality}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mt-8 mb-6">Course Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Institute Name</label>
            <input
              type="text"
              name="instituteName"
              value={studentDetails.instituteName}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Course</label>
            <input
              type="text"
              name="course"
              value={studentDetails.course}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Starting Date</label>
            <input
              type="date"
              name="startDate"
              value={studentDetails.startDate}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Ending Date</label>
            <input
              type="date"
              name="endDate"
              value={studentDetails.endDate}
              onChange={handleStudentDetailsChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="reset" onClick={handleReset} className="bg-gray-400 dark:bg-gray-800 text-white px-4 py-2 rounded-md mr-4">Reset</button>
          <button onClick={handleSubmit} className="bg-blue-600 dark:bg-indigo-950 text-white px-4 py-2 rounded-md">Submit</button>
        </div>
      </form>
    </div>
  );
}