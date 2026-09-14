import React, { useEffect, useState } from 'react';
import home from '../assets/images/homeicon.png'
import achievement from '../assets/images/achievementicon.png'
import career from '../assets/images/careericon.png'
import contact from '../assets/images/contacticon.png'
import logout from '../assets/images/logouticon.png'
import gallery from '../assets/images/galleryicon.png'

const AdminHome = () => {
  const [dashboardDetails, setDashboardDetails] = useState(null); // Initial state as null

  const getHomePageDetails = async () => {
    try {
      const res = await fetch('https://dhanamschool.com/api/dashboard/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      const resObj = await res.json();
      setDashboardDetails(resObj); // Directly use the response object
      console.log(resObj); // Log the response for debugging
    } catch (err) {
      console.error("Error occurred: ", err);
      alert("Error occurred. Contact Support");
    }
  };

  useEffect(() => {
    getHomePageDetails();
  }, []);

  // Prevent rendering before data is fetched
  if (!dashboardDetails) {
    return (
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <p className="text-xl text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Contact Requests */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className='flex justify-between mb-5'>
            <div className='bg-black w-fit h-fit p-2 rounded-lg'>
              <img className='w-6 ' src={contact}/>
            </div>
            <div>
            <h2 className=" font-semibold text-gray-600">Contact Requests</h2>
            <p className="text-2xl font-bold text-black text-right">
              {dashboardDetails.contact?.count || 0}
            </p>
            </div>
            </div>
            <div className='flex text-sm'>
              <p className={`${(dashboardDetails.contact?.diff||0)>0?"text-green-600":"text-red-600" }`}>{(dashboardDetails.contact?.diff||0)>0?"+":"-" }</p>
            <p className={`${(dashboardDetails.contact?.diff||0)>0?"text-green-600":"text-red-600" } font-bold mr-2`}>{dashboardDetails.contact?.diff || 0}%</p>
            <p className='text-gray-400'> contact request than last week</p>
            </div>
          </div>

          {/* Gallery Items */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className='flex justify-between mb-5'>
            <div className='bg-black w-fit h-fit p-2 rounded-lg'>
              <img className='w-6 ' src={gallery}/>
            </div>
            <div>
            <h2 className=" font-semibold text-gray-600">Gallery Items</h2>
            <p className="text-2xl font-bold text-black text-right">
              {dashboardDetails.gallery?.count || 0}
            </p>
            </div>
            </div>
            <div className='flex text-sm'>
              <p className={`${(dashboardDetails.gallery?.diff||0)>0?"text-green-600":"text-red-600" }`}>{(dashboardDetails.gallery?.diff||0)>0?"+":"-" }</p>
            <p className={`${(dashboardDetails.gallery?.diff||0)>0?"text-green-600":"text-red-600" } font-bold mr-2`}>{dashboardDetails.gallery?.diff || 0}%</p>
            <p className='text-gray-400'> gallery uploads than last week</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className='flex justify-between mb-5'>
            <div className='bg-black w-fit h-fit p-2 rounded-lg'>
              <img className='w-6 ' src={achievement}/>
            </div>
            <div>
            <h2 className=" font-semibold text-gray-600">Achievements</h2>
            <p className="text-2xl font-bold text-black text-right">
              {dashboardDetails.achievement?.count || 0}
            </p>
            </div>
            </div>
            <div className='flex text-sm'>
              <p className={`${(dashboardDetails.achievement?.diff||0)>0?"text-green-600":"text-red-600" }`}>{(dashboardDetails.achievement?.diff||0)>0?"+":"-" }</p>
            <p className={`font-bold ${(dashboardDetails.achievement?.diff||0)>0?"text-green-600":"text-red-600" } mr-2`}>{dashboardDetails.achievement?.diff || 0}%</p>
            <p className='text-gray-400'> achievements than last week</p>
            </div>
          </div>

          {/* Interested Count */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className='flex justify-between mb-5'>
            <div className='bg-black w-fit h-fit p-2 rounded-lg'>
              <img className='w-6 ' src={career}/>
            </div>
            <div>
            <h2 className=" font-semibold text-gray-600">Interested Count</h2>
            <p className="text-2xl font-bold text-black text-right">
              {dashboardDetails.interested?.count || 0}
            </p>
            </div>
            </div>
            <div className='text-sm flex'>
              <p className={`${(dashboardDetails.interested?.diff||0)>0?"text-green-600":"text-red-600" }`}>{(dashboardDetails.interested?.diff||0)>0?"+":"-" }</p>
            <p className={`font-bold ${(dashboardDetails.interested?.diff||0)>0?"text-green-600":"text-red-600" } mr-2`}> {dashboardDetails.interested?.diff || 0}%</p>
            <p className='text-gray-400'> interested people than last week</p>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-400">
              Welcome to the admin dashboard. Here you can manage your contact requests, view gallery items, track achievements, and analyze the interested count. Use the navigation on the left to explore more details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
