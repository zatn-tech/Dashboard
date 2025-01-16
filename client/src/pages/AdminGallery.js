import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../component/Layout';

const AdminGallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [mediaType, setMediaType] = useState('image'); // State to manage whether user is uploading an image or video
  const [file, setFile] = useState(null); // For storing selected image file
  const [files, setFiles] = useState([]); //For storing bulk files
  const [videoLink, setVideoLink] = useState(''); // For storing video URL
  const [description, setDescription] = useState(''); // For storing description input
  const [galleryItems, setGalleryItems] = useState([]);
  const isAuthenticated = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      fetchGalleryItems();
    }
  }, [isAuthenticated]);

  const fetchGalleryItems = async () => {
    try {
      const res = await fetch('https://api.dhanamschool.com/gallery/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      const data = await res.json();
      console.log(data)
      setGalleryItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  // Handle opening the modal
  const handleGalleryClick = () => {
    setIsModalOpen(true); // Open the modal when "+" is clicked
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setVideoLink('');
    setDescription(''); // Reset description when modal is closed
  };

  const renderYouTubeVideo = (videoLink) => {
    console.log("hi")
    const youtubeId = videoLink.split('v=')[1]?.split('&')[0];
    console.log(youtubeId)
    if (youtubeId) {
      return (
        <iframe
          className='w-96 h-64'
          src={`https://www.youtube.com/embed/${youtubeId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
        ></iframe>
      );
    }
    return <p>Invalid YouTube URL</p>;
  };

  // Handle media type selection (image or video)
  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value); // Update media type (image or video)
  };

  // Handle file input (for images)
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the selected file
  };

  //Handle bulk file change
  const handleBulkFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Handle video URL input
  const handleVideoLinkChange = (event) => {
    setVideoLink(event.target.value); // Store the video URL
  };

  // Handle description input
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Store the description
  };

  //Handle bulk
  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      alert('Please provide a description');
      return;
    }

    const formData = new FormData();
    formData.append("type", mediaType)
    for (let i = 0; i < files.length; i++) {
      console.log(i)
      formData.append('files', files[i]);
    }
    formData.append('description', description);  // Send the description
    console.log(formData)

    try {
      const response = await fetch('https://api.dhanamschool.com/gallery/bulk', {
        method:'POST',
        headers: {
          'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*",
        },
        body:formData,
      });
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };


  // Handle form submission
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("type", mediaType)
    // If image is selected
    if (mediaType === 'image' && file) {
      formData.append('file', file);
    }

    // If video URL is provided
    if (mediaType === 'video' && videoLink) {
      console.log(videoLink)
      formData.append('file', videoLink);
    }

    // Add description
    formData.append('description', description);

    // Call your API for uploading image or video
    const res = await fetch('https://api.dhanamschool.com/gallery', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*",
      },
      body: formData,
    });

    if (res.ok) {
      alert('Media uploaded successfully!');
      closeModal(); // Close the modal after successful upload
      fetchGalleryItems()
    } else {
      alert('Error uploading media.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://api.dhanamschool.com/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
      });
      if (res.ok) {
        alert('Item deleted successfully');
        fetchGalleryItems(); // Refresh the gallery
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className='font-serif my-16'>
      <div className='justify-center flex'>
        <div className='font-bold text-5xl mx-5'>GALLERY</div>
        <div className='my-auto cursor-pointer' onClick={handleGalleryClick}>➕</div>
      </div>
      <div className="mt-8 mx-16">
        <h2 className="text-3xl font-bold mb-4">Images</h2>
        <div className=" space-x-2 overflow-x-scroll grid grid-cols-6 no-scrollbar">
          {galleryItems
            .filter((item) => item.type === 'image') // Filter images
            .map((item) => (
              <div key={item._id} className="relative  group">
                {/* Image container with hover effect */}
                <img
                  src={`https://api.dhanamschool.com/files/${item.file}`} // Display image from server
                  alt={item.description}
                  className="mb-2 h-64 w-96 rounded"
                />
                <p>{item.description}</p>

                {/* Delete button that appears on hover */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  ❌
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Section for videos */}
      <div className="mt-8 mx-16">
        <h2 className="text-3xl font-bold mb-4">Videos</h2>
        <div className="flex overflow-x-scroll no-scrollbar">
          {galleryItems
            .filter((item) => item.type === 'video') // Filter videos
            .map((item) => (
              <div key={item._id} className="relative group">
                {/* Video container with hover effect */}
                {item.file && renderYouTubeVideo(item.file)} {/* Display YouTube video */}
                <p>{item.description}</p>

                {/* Delete button that appears on hover */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  ❌
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Modal for uploading image/video */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Select Media Type (Image or Video) */}
            <div className="mb-4">
              <label className="block text-xl font-semibold">Select Media Type</label>
              <select
                className="w-full p-2 border rounded"
                value={mediaType}
                onChange={handleMediaTypeChange}
              >
                <option value="image">Image</option>
                <option value="video">Video URL</option>
                <option value="bulk">Bulk Image</option>
              </select>
            </div>

            {/* Input for Image Upload */}
            {mediaType === 'image' && (
              <div className="mb-4">
                <label className="block text-xl font-semibold">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {/* Input for Video URL */}
            {mediaType === 'bulk' && (
              <div className="mb-4">
                <label className="block text-xl font-semibold">Select file</label>
                <form >
                  <input type="file" multiple onChange={handleBulkFileChange} />
                  <div className='my-5'>

                  <input
                  className='border-[1px] border-black w-full h-16 text-center'
                    type="text"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                    </div>
                  <button className="bg-blue-500 text-white p-2 rounded" onClick={handleBulkSubmit}>Upload Photos</button>
                </form>
              </div>
            )}

            {mediaType === 'video' && (
              <div className="mb-4">
                <label className="block text-xl font-semibold">Enter Video URL</label>
                <input
                  type="url"
                  value={videoLink}
                  onChange={handleVideoLinkChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {/* Description Input */}
            {mediaType!='bulk'&&<div className="mb-4">
              <label className="block text-xl font-semibold">Description</label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>}

            {/* Submit Button */}
            {mediaType!='bulk'&&<div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Submit
              </button>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
