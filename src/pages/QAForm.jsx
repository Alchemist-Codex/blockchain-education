import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QAForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic if needed
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <form className="bg-blue-100 dark:bg-blue-900 p-8 rounded-lg shadow-md max-w-4xl mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mb-6">Student Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Age</label>
            <input type="number" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Gender</label>
            <select className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Email</label>
            <input type="email" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Mobile Number</label>
            <input type="tel" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Nationality</label>
            <input type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Wallet Address</label>
            <input type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mt-8 mb-6">Course Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Institute Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Course</label>
            <input type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Starting Date</label>
            <input type="date" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
          <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Ending Date</label>
            <input type="date" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md" required />
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button type="reset" className="bg-gray-400 dark:bg-gray-800 text-white px-4 py-2 rounded-md">Reset</button>
          <button type="submit" className="bg-blue-600 dark:bg-indigo-950 text-white px-4 py-2 rounded-md">Submit</button>
        </div>
      </form>
    </div>
  );
}
