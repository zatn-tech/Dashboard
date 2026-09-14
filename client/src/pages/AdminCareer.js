import React, { useEffect,useContext, useState } from 'react'
import { AuthContext } from '../component/Layout'; // Import the context

const AdminCareer = () => {
  const [careerObj,setCareerObj] = useState([])
  const [selectedCareer,setSelectedCareer] = useState(null)
  const isAuthenticated = useContext(AuthContext); // Use the context
  
  useEffect(()=>{
    if(isAuthenticated)
    {
      fetchCareerItems();
    }
  },[isAuthenticated])

  const openCareer=(career)=>{
    setSelectedCareer(career)
  }

  const closeModal = () => {
    setSelectedCareer(null);
  };

  const deleteCareer = async(id)=>{
    try{
      const res = await fetch(`https://dhanamschool.com/api/career/${id}`,{
        method:'DELETE',
        headers:{
          'Content-type':'application/json',
          'Access-Control-Allow-Origin':'*',
        }
      })
      if(res.ok)
      {
        alert('Career form deleted successfully')
        closeModal()
        fetchCareerItems()
      }else
      {
        alert('Career form not deleted')
      }
    }
    catch(err)
    {
      alert('contact support')
      console.log(err)
    }
  }
  
  const fetchCareerItems=async()=>{
    try{
      const res = await fetch("https://dhanamschool.com/api/career",{
        method:'GET',
        headers:{
          'Content-type':'application/json',
          "Access-Control-Allow-Origin": "*",
        }
      })
      if(res.ok)
      {
        const data = await res.json()
        console.log(data)
        setCareerObj(data)
      }
      else
      {
        alert("Error fetching Career requests")
      }
    }
    catch(err)
    {
      console.log(err)
    }
  }

  return (
    <div className='py-16 px-5 md:px-32 font-serif'>
      <div className="text-5xl uppercase font-bold text-center mb-8">Career Requests</div>
      <div className='grid grid-cols-5'>
        {careerObj.map((career,index)=>(
          <div onClick={()=>openCareer(career)} className='border-[1px] border-black text-center px-7 py-3 rounded-2xl'>{career.name}</div>
        ))}
      </div>
      {selectedCareer && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
        onClick={closeModal}
      >
        &times;
      </button>

      <div className="mb-6 space-y-4">
        <div className="text-2xl font-semibold text-gray-800">{selectedCareer.name}</div>
        <div className="text-lg text-gray-600">
          <span className="font-medium">Address: </span>{selectedCareer.address}
        </div>
        <div className="text-lg text-gray-600">
          <span className="font-medium">Email: </span>{selectedCareer.email}
        </div>
        <div className="text-lg text-gray-600">
          <span className="font-medium">Position: </span>{selectedCareer.position}
        </div>
        <div className="text-lg text-gray-600">
          <span className="font-medium">Cover Letter: </span>{selectedCareer.coverletter}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105 hover:bg-red-600 focus:outline-none"
          onClick={() => deleteCareer(selectedCareer._id)}
        >
          Delete
        </button>
        <a
          className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-600 focus:outline-none"
          href={`https://dhanamschool.com/api/files/${selectedCareer.resume}`}
          target='_blank'
        >
          Resume
        </a>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default AdminCareer