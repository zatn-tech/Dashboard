import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../component/Layout'; // Import the context

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const isAuthenticated = useContext(AuthContext); // Use the context

  useEffect(() => {
    if (isAuthenticated) {
      getAchievements();
    }
  }, [isAuthenticated]);

  // Upload the achievement
  const uploadAchievement = async (topic, description, file, id) => {
    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }
    let res = null;
    try {
      if (id != null) {
        res = await fetch('http://localhost:2003/achievement/' + id, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            "Access-Control-Allow-Origin": "*"
          },
          body: formData,
        });
      } else {
        res = await fetch('http://localhost:2003/achievement/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            "Access-Control-Allow-Origin": "*"
          },
          body: formData,
        });
      }

      if (res.ok) {
        alert('Achievement uploaded successfully!');
        getAchievements()
        // You can refresh or update the list of achievements here
      } else {
        alert("Error uploading achievement.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading achievement.");
    }
  }

  // Get achievements
  const getAchievements = async () => {
    const res = await fetch('http://localhost:2003/achievement/', {
      method: 'GET',
      headers: { 'Content-type': 'application/json' }
    })
    if (res.ok) {
      const achievementArr = await res.json()
      setAchievements(achievementArr)
      console.log(achievementArr)
    } else {
      alert('Failed to load achievements. Kindly contact support')
    }
  }

  // Delete achievement
  const deleteAchievement = async (id) => {
    try {
      const res = await fetch('http://localhost:2003/achievement/' + id, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' }
      })
      if (res.ok) {
        alert('Deleted SuccessFully')
        getAchievements()
      }
      else {
        alert('Something went wrong. Contact Support')
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  // Open the achievement for editing
  const handleAchievementClick = (achievement) => {
    setSelectedAchievement({ ...achievement }); // Reset file to null when editing
  };

  // Close the popup
  const closePopup = () => {
    setSelectedAchievement(null);
  };

  // Handle changes in achievement fields
  const handleEdit = (field, value) => {
    setSelectedAchievement((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image file change
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Update file state with the selected file

    // Create a file reader to display the preview
    const reader = new FileReader();
    reader.onload = () => {
      // Update the selectedAchievement object with the new image preview
      setSelectedAchievement((prev) => ({
        ...prev,
        image: reader.result, // Set image preview
      }));
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile); // Update the preview of the image
    }
  };


  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className='font-serif'>
      <div className='mt-16'>
        <div className='flex justify-center'>
          <div className='text-5xl font-bold text-center mx-5'>ACHIEVEMENTS</div>
          <div className='my-auto cursor-pointer' onClick={() => handleAchievementClick({})}>➕</div>
        </div>
        <div className='grid grid-cols-4 mx-16 space-x-4 mt-16'>
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className='cursor-pointer border-[1px] border-black w-64 px-5 py-3 rounded-xl'
              onClick={() => handleAchievementClick(achievement)}
            >
              {achievement.topic}
            </div>
          ))}
        </div>
      </div>

      {selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closePopup}
            >
              &times;
            </button>
            <div className="mb-4">
              <input
                type="text"
                value={selectedAchievement.topic || topic}
                onChange={(e) => handleEdit("topic", e.target.value)}
                className="w-full p-2 border rounded text-xl font-bold"
              />
            </div>
            <div className="mb-4">
            {selectedAchievement.image || selectedAchievement.file ? (
                <img
                  src={
                    selectedAchievement.image ||
                    `http://localhost:2003/files/${selectedAchievement.file}`
                  }
                  alt="Achievement"
                  className="w-full h-48 mb-2 rounded"
                />
              ) : (
                <div>No Image Available</div>
              )}
              <label className="block text-sm text-blue-500 cursor-pointer">
                <span className="underline">Change Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={selectedAchievement.description}
              onChange={(e) => handleEdit("description", e.target.value)}
              className="w-full p-2 border rounded text-gray-700"
              rows={6}
            />
            <div className="flex justify-between">
              <button onClick={() => uploadAchievement(selectedAchievement.topic, selectedAchievement.description, file != null ? file : selectedAchievement.file, selectedAchievement._id)}>
                {selectedAchievement._id != null ? 'Submit' : 'Add'}
              </button>
              <button onClick={() => deleteAchievement(selectedAchievement._id)}>
                {selectedAchievement._id != null ? 'Delete' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAchievements;
