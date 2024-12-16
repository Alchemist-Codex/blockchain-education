import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QAFormInstitute() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic if needed
    navigate('/institution/dashboard');
  };

  return (
    <div class="flex justify-center items-center h-screen bg-blue-50 dark:bg-slate-900">
    <div class="bg-blue-100  dark:bg-blue-900 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 class="text-3xl font-bold text-center text-blue-800  dark:text-blue-100 mb-6">Institute Details</h2>
        <form class="space-y-6" onSubmit={handleSubmit}>
            {/* Institute Name and Email  */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Institute Name  */}
                <div class="flex flex-col">
                    <label for="institute_name" class="text-lg text-blue-800  dark:text-blue-100 font-medium">Institute Name</label>
                    <input type="text" id="institute_name" name="institute_name" class="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>

                {/* Email  */}
                <div class="flex flex-col">
                    <label for="email" class="text-lg text-blue-800  dark:text-blue-100 font-medium">Email</label>
                    <input type="email" id="email" name="email" class="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
            </div>

             {/* Official Website and Year of Establishment  */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* // Official Website  */}
                <div class="flex flex-col">
                    <label for="website" class="text-lg text-blue-800   dark:text-blue-100 font-medium">Official Website</label>
                    <input type="url" id="website" name="website" class="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>

                {/* // Year of Establishment */}
                <div class="flex flex-col">
                    <label for="year_establishment" class="text-lg text-blue-800  dark:text-blue-100 font-medium">Year of Establishment</label>
                    <input type="number" id="year_establishment" name="year_establishment" class="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
            </div>

            {/* // Address (Larger Textarea)  */}
            <div class="flex flex-col">
                <label for="address" class="text-lg text-blue-800  dark:text-blue-100 font-medium">Address</label>
                <textarea id="address" name="address" rows="4" class="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required></textarea>
            </div>

            {/* // Reset and Submit Buttons  */}
            <div class="flex justify-between items-center gap-6 mt-6">
                <button type="reset" class="bg-gray-400 text-white  dark:bg-gray-800 px-4 py-2 rounded-md">Reset</button>
                <button type="submit" class="w-full lg:w-auto px-6 py-3 bg-blue-600  dark:bg-indigo-950 text-white rounded-lg hover:bg-blue-700 focus:outline-none">Submit</button>
            </div>
        </form>
    </div>
</div>

  );
}
