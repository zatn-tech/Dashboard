import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../component/Layout'; // Import the context

const AdminContact = () => {
  const [contact, setContact] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const isAuthenticated = useContext(AuthContext); // Use the context

  useEffect(() => {
    if (isAuthenticated) {
      getContactRequests();
    }
  }, [isAuthenticated]);

  // Fetch contact requests from the backend
  const getContactRequests = async () => {
    try {
      const res = await fetch('http://localhost:2003/contact/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      const contactReqArr = await res.json();
      setContact(contactReqArr);
    } catch (err) {
      alert('Error occurred. Contact Support');
    }
  };

  // Handle contact name click (to view details)
  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  // Close modal
  const closeModal = () => {
    setSelectedContact(null);
  };

  // Delete contact request
  const deleteContact = async (id) => {
    try {
      const res = await fetch(`http://localhost:2003/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        alert('Contact request deleted successfully.');
        getContactRequests(); // Refresh the contact list
      } else {
        alert('Error deleting contact. Please try again.');
      }
    } catch (err) {
      alert('Error deleting contact. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-16 px-5 md:px-32 font-serif">
      <div className="text-5xl uppercase font-bold text-center mb-8">Contact Requests</div>
      {/* Contact List (Only names) */}
      <div className="space-x-4 grid grid-cols-5 my-16">
        {contact.map((contactItem) => (
          <div
            key={contactItem._id}
            className="cursor-pointer text-xl text-primary border-[1px] border-black text-center rounded-xl py-4 hover:text-blue-600"
            onClick={() => handleContactClick(contactItem)}
          >
            {contactItem.name}
          </div>
        ))}
      </div>

      {/* Modal for displaying contact details */}
      {selectedContact && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
        onClick={closeModal}
      >
        &times;
      </button>

      <div className="mb-6 space-y-4">
        <div className="text-2xl font-semibold text-gray-800">{selectedContact.name}</div>
        <div className="text-lg text-gray-600">
          <span className="font-medium">Mobile: </span>{selectedContact.mobile}
        </div>
        <div className="text-lg text-gray-600">
          <span className="font-medium">Email: </span>{selectedContact.email}
        </div>
        <div className="text-lg text-gray-600">
          <span className="font-medium">Message: </span>{selectedContact.message}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105 hover:bg-red-600 focus:outline-none"
          onClick={() => deleteContact(selectedContact._id)}
        >
          Delete
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105 hover:bg-blue-600 focus:outline-none"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminContact;
