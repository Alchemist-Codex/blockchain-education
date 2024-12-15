import React from "react";

function StudentDetails() {
    return (
        <>
            <body className="bg-slate-900 flex justify-center items-center">
                <div className="container border-red-500 w-[80%] h-[80%] flex justify-center items-center">
                    <htmlForm className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-blue-800 my-4">
                            Student Details
                        </h2>
                        <div className="h-[2px] w-[50%] bg-blue-800 rounded-sm mx-auto"></div>
                        {/* Student Name goes here  */}
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mt-6"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />
 
                        {/* Student ages goes here */}
                        <label
                            htmlFor="age"
                            className="inline-block text-sm font-medium text-gray-700"
                        >
                            Age
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />

                        {/* Student gender goes here */}
                        <label
                            htmlFor="gender"
                            className="inline-block text-sm font-medium text-gray-700"
                        >
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Nationality goes here */}
                        <label
                            htmlFor="nationality"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nationality
                        </label>
                        <input
                            type="text"
                            id="nationality"
                            name="nationality"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />

                        {/* Email id goes here */}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email ID
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />
                        
                        {/* Contact number goes here  */}
                        <label
                            htmlFor="contact"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            id="contact"
                            name="contact"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />

                        <h2 className="text-2xl font-bold text-center text-blue-800 my-4">
                            Course Details
                        </h2>
                        <div className="h-[2px]  w-[50%] bg-blue-800 rounded-sm mx-auto"></div>

                        <label
                            htmlFor="institution"
                            className="block text-sm font-medium text-gray-700 mt-6"
                        >
                            Institution Name
                        </label>
                        <input
                            type="text"
                            id="institution"
                            name="institution"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />

                        <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                            Current Course
                        </label>
                        <input
                            type="text"
                            id="course"
                            name="course"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />

                        <label htmlFor="stream" className="block text-sm font-medium text-gray-700">
                            Stream
                        </label>
                        <input
                            type="text"
                            id="stream"
                            name="stream"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />

                        <label
                            htmlFor="course_duration"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Course Duration
                        </label>
                        <input
                            type="number"
                            id="stream"
                            name="stream"
                            required
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />

                        <button
                            type="submit"
                            className="w-full py-3 mt-4 text-white bg-blue-700 rounded-md hover:bg-blue-800"
                        >
                            Submit
                        </button>
                    </htmlForm>
                </div>
            </body>
        </>
    );
}
export default StudentDetails