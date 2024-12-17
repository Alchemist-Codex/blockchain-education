import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundAnimation } from '../components/BackgroundAnimation';

export default function QAFormInstitute() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic if needed
    navigate('/institution/dashboard');
  };

  return (
    <BackgroundAnimation>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-blue-800  dark:text-blue-100 mb-6">Institute Details</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Institute Name and Email  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Institute Name  */}
                <div className="flex flex-col">
                    <label htmlFor="institute_name" className="text-lg text-blue-800  dark:text-blue-100 font-medium">Institute Name</label>
                    <input type="text" id="institute_name" name="institute_name" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>

                {/* Email  */}
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-lg text-blue-800  dark:text-blue-100 font-medium">Email</label>
                    <input type="email" id="email" name="email" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
            </div>

             {/* Official Website and Year of Establishment  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* // Official Website  */}
                <div className="flex flex-col">
                    <label htmlFor="website" className="text-lg text-blue-800   dark:text-blue-100 font-medium">Official Website</label>
                    <input type="url" id="website" name="website" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>

                {/* // Year of Establishment */}
                <div className="flex flex-col">
                    <label htmlFor="year_establishment" className="text-lg text-blue-800  dark:text-blue-100 font-medium">Year of Establishment</label>
                    <input type="number" id="year_establishment" name="year_establishment" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
            </div>
                {/* Institute Wallet Address  */}
            <div>
            <label className="block text-blue-800 dark:text-blue-100 font-medium">Wallet Address</label>
            <input type="text" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

            {/* // Address (Larger Textarea)  */}
            <div className="flex flex-col">
                <label htmlFor="address" className="text-lg text-blue-800  dark:text-blue-100 font-medium">Address</label>
                <textarea id="address" name="address" rows="4" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required></textarea>
            </div>

            {/* // Reset and Submit Buttons  */}
            <div className="flex justify-between items-center gap-6 mt-6">
                <button type="reset" className="bg-gray-400 text-white  dark:bg-gray-800 px-4 py-2 rounded-md">Reset</button>
                <button type="submit" className="w-full lg:w-auto px-6 py-3 bg-blue-600  dark:bg-indigo-950 text-white rounded-lg hover:bg-blue-700 focus:outline-none">Submit</button>
            </div>
        </form>
      </div>
    </BackgroundAnimation>
  );
}
