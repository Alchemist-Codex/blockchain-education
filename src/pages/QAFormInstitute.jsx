import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function QAFormInstitute() {
  const navigate = useNavigate();
  const { user, userType } = useAuth();

  const [instituteDetails, setInstituteDetails] = useState({
      iname: '',
      email: '',
      site:'',
      year:'',
      address :'',
    });
  
    const resetHandler = () => {
      setInstituteDetails({
        iname: '',
        email: '',
        site:'',
        year:'',
        address :'',
      });
    };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
          toast.error('You must be logged in to submit this form');
          return;
        }
    
        if (userType !== 'institute') {
          toast.error('Only institutes can submit this form');
          return;
        }
    
        if (!instituteDetails.iname || !instituteDetails.email || !instituteDetails.site || 
            !instituteDetails.year || !instituteDetails.address) {
          toast.error('Please fill in all required fields');
          return;
        }
    
        try {
          const formattedData = {
            ...instituteDetails,
            userId: user.uid,
            year: Number(instituteDetails.year),
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
    
          const instituteRef = doc(db, 'institutions', user.uid);
          await setDoc(instituteRef, formattedData);
    
          toast.success('Form submitted successfully');
          navigate('/institution/dashboard');
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error('Failed to submit form: ' + error.message);
        }
    
  };

  const handleStudentDetailsChange = (e) => {
    setInstituteDetails({ ...instituteDetails, [e.target.name]: e.target.value });
  };

  return ( 
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-blue-50/80 dark:bg-slate-900/90">
        <div className="bg-blue-100/90 dark:bg-blue-900/90 p-8 rounded-lg shadow-lg w-full max-w-4xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-100 mb-6">Institute Details</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Institute Name and Email */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="institute_name" className="text-lg text-blue-800 dark:text-blue-100 font-medium">Institute Name</label>
                <input type="text" onChange={handleStudentDetailsChange} id="institute_name" name="iname" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="text-lg text-blue-800 dark:text-blue-100 font-medium">Email</label>
                <input type="email" onChange={handleStudentDetailsChange} id="email" name="email" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
              </div>
            </div>

            {/* Official Website and Year of Establishment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="website" className="text-lg text-blue-800 dark:text-blue-100 font-medium">Official Website</label>
                <input type="url" onChange={handleStudentDetailsChange} id="website" name="site" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="year_establishment" className="text-lg text-blue-800 dark:text-blue-100 font-medium">Year of Establishment</label>
                <input type="number" onChange={handleStudentDetailsChange} id="year_establishment" name="year" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label htmlFor="address" className="text-lg text-blue-800 dark:text-blue-100 font-medium">Address</label>
              <textarea id="address" onChange={handleStudentDetailsChange} name="address" rows="4" className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required></textarea>
            </div>
 
            {/* Reset and Submit Buttons */}
            <div className="flex justify-between items-center gap-6 mt-6">
              <button type="reset" onClick={resetHandler} className="bg-gray-400 text-white dark:bg-gray-800 px-4 py-2 rounded-md">Reset</button>
              <button type="submit" className="w-full lg:w-auto px-6 py-3 bg-blue-600 dark:bg-indigo-950 text-white rounded-lg hover:bg-blue-700 focus:outline-none">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
