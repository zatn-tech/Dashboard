import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../component/Layout';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [file, setFile] = useState(null);
  const [namesAndMarks, setNamesAndMarks] = useState([]);
  const isAuthenticated = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      getAchievements();
    }
  }, [isAuthenticated]);

  const uploadAchievement = async (topic, description, file, id) => {
    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('description', description);
    formData.append('marks', JSON.stringify(namesAndMarks)); // Send marks array
    if (file) {
      formData.append('file', file);
    }

    let res = null;
    try {
      if (id != null) {
        res = await fetch(`https://api.dhanamschool.com/achievement/${id}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: formData,
        });
      } else {
        res = await fetch('https://api.dhanamschool.com/achievement/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: formData,
        });
      }

      if (res.ok) {
        alert('Achievement uploaded successfully!');
        getAchievements();
        closePopup();
      } else {
        alert('Error uploading achievement.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading achievement.');
    }
  };

  const getAchievements = async () => {
    try {
      const res = await fetch('https://api.dhanamschool.com/achievement/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
      if (res.ok) {
        const achievementArr = await res.json();
        setAchievements(achievementArr);
        console.log(achievementArr);
      } else {
        alert('Failed to load achievements. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      alert('Failed to load achievements.');
    }
  };

  const deleteAchievement = async (id) => {
    try {
      const res = await fetch(`https://api.dhanamschool.com/achievement/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
      if (res.ok) {
        alert('Deleted Successfully');
        closePopup()
        getAchievements();
      } else {
        alert('Something went wrong. Please contact support.');
      }
    } catch (err) {
      console.error('Error deleting achievement:', err);
    }
  };

  const handleAchievementClick = (achievement) => {
    console.log(achievement.marks);
    setSelectedAchievement({ ...achievement });
    setNamesAndMarks(achievement.marks || []); // Initialize marks array
  };

  const closePopup = () => {
    setSelectedAchievement(null);
    setNamesAndMarks([]); // Reset marks array
  };

  const handleEdit = (field, value) => {
    setSelectedAchievement((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAchievement((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const addNameAndMarks = () => {
    setNamesAndMarks((prev) => [...prev, { name: '', mark: [] }]);
  };

  const updateNameAndMarks = (index, field, value) => {
    const updated = [...namesAndMarks];
    updated[index][field] = value;
    setNamesAndMarks(updated);
  };

  const addSubjectMark = (index) => {
    const updated = [...namesAndMarks];
    updated[index].mark.push({ subjectName: '', subjectMark: '' });
    setNamesAndMarks(updated);
  };

  const updateSubjectMark = (index, markIndex, field, value) => {
    const updatedNamesAndMarks = [...namesAndMarks];  // Create a copy of the namesAndMarks array
  
    // Ensure the item and mark are available before modifying
    if (updatedNamesAndMarks[index] && updatedNamesAndMarks[index].mark) {
      const updatedMarks = [...updatedNamesAndMarks[index].mark];  // Create a copy of the marks array
  
      if (updatedMarks[markIndex]) {
        // Update either subject or mark based on the field
        if (field === 'subject') {
          updatedMarks[markIndex] = {
            ...updatedMarks[markIndex], // Preserve other properties if any
            subjectName: value,          // Update the subject
          };
        } else if (field === 'mark') {
          updatedMarks[markIndex] = {
            ...updatedMarks[markIndex], // Preserve other properties if any
            subjectMark: value,         // Update the mark
          };
        }
      }
  
      // After updating the mark, replace the mark array in the item
      updatedNamesAndMarks[index].mark = updatedMarks;
      setNamesAndMarks(updatedNamesAndMarks); // Update the state with the modified array
    }
  };
  

  const deleteNameAndMarks = (index) => {
    setNamesAndMarks((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteSubjectMark = (nameIndex, markIndex) => {
    const updated = [...namesAndMarks];
    updated[nameIndex].mark = updated[nameIndex].mark.filter((_, i) => i !== markIndex);
    setNamesAndMarks(updated);
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-serif">
      <div className="mt-16">
        <div className="flex justify-center">
          <div className="text-5xl font-bold text-center mx-5">ACHIEVEMENTS</div>
          <div className="my-auto cursor-pointer" onClick={() => handleAchievementClick({})}>
            ➕
          </div>
        </div>
        <div className="grid grid-cols-4 mx-16 space-y-6 space-x-4 mt-16">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="cursor-pointer border-[1px] border-black w-64 px-5 py-3 rounded-xl"
              onClick={() => handleAchievementClick(achievement)}
            >
              {achievement.topic}
            </div>
          ))}
        </div>
      </div>

      {selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white h-[600px] overflow-y-scroll rounded-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closePopup}
            >
              &times;
            </button>
            <div className="mb-4">
              <input
                type="text"
                value={selectedAchievement.topic || ''}
                onChange={(e) => handleEdit('topic', e.target.value)}
                className="w-full p-2 border rounded text-xl font-bold"
              />
            </div>
            <div className="mb-4">
              {selectedAchievement.image || selectedAchievement.file ? (
                <img
                  src={
                    selectedAchievement.image ||
                    `https://api.dhanamschool.com/files/${selectedAchievement.file}`
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
              value={selectedAchievement.description || ''}
              onChange={(e) => handleEdit('description', e.target.value)}
              className="w-full p-2 border rounded text-gray-700"
              rows={6}
            />
            <div>
              <h3 className="text-lg font-bold">Names and Marks</h3>
              {namesAndMarks.map((item, index) => (
                <div key={index} className="mb-4 border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) => updateNameAndMarks(index, 'name', e.target.value)}
                      className="p-2 border rounded w-full"
                    />
                    <button
                      onClick={() => deleteNameAndMarks(index)}
                      className="ml-2 text-red-500 text-sm underline"
                    >
                      Delete Name
                    </button>
                  </div>
                  {item.mark && Array.isArray(item.mark) && item.mark.map((mark, markIndex) => {


                    return (
                      <div key={markIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Subject"
                          value={mark.subjectName || ''} // Set the subject (key) as the value
                          onChange={(e) =>
                            updateSubjectMark(index, markIndex, 'subject', e.target.value)
                          }
                          className="p-2 border rounded w-1/2"
                        />
                        <input
                          type="text"
                          placeholder="Mark"
                          value={mark.subjectMark || ''} // Set the mark (value) as the value
                          onChange={(e) =>
                            updateSubjectMark(index, markIndex, 'mark', e.target.value)
                          }
                          className="p-2 border rounded w-1/2"
                        />
                        <button
                          onClick={() => deleteSubjectMark(index, markIndex)}
                          className="text-red-500 text-sm underline"
                        >
                          Delete Subject
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => addSubjectMark(index)}
                    className="text-blue-500 text-sm underline"
                  >
                    Add Subject Mark
                  </button>
                </div>
              ))}
              <button
                onClick={addNameAndMarks}
                className="text-blue-500 text-sm underline mt-2"
              >
                Add Name
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() =>
                  uploadAchievement(
                    selectedAchievement.topic,
                    selectedAchievement.description,
                    file || selectedAchievement.file,
                    selectedAchievement._id
                  )
                }
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {selectedAchievement._id ? 'Submit' : 'Add'}
              </button>
              {selectedAchievement._id && (
                <button
                  onClick={() => deleteAchievement(selectedAchievement._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAchievements;
