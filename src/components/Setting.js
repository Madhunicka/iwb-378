import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: '' // Add profileImage to the user state
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const defaultImages = [
    'https://th.bing.com/th/id/OIP.yQQfPxRKgHhquAWlnbYciQHaHx?rs=1&pid=ImgDetMain', // Replace these URLs with actual image paths
    'https://yt3.googleusercontent.com/Yr90Ay-wxRLLETiuzUMaA_DjZrtK_hSQI8b5pFKhtaKOLaRdJ7GWrP6gYE9FIH25vOHpSTtzaw=s900-c-k-c0x00ffffff-no-rj',
    'https://th.bing.com/th/id/OIP.C48nQ67xPiqdPSLY4y6wkQHaHa?w=788&h=788&rs=1&pid=ImgDetMain',
    'https://www.kindpng.com/picc/m/377-3776541_circle-hd-png-download.png'
  ];

  // Fetch user data on component load
  useEffect(() => {
    axios.get('http://localhost:9090/api/userSettings')
      .then(response => {
        setUser({
          name: response.data[0].name,
          email: response.data[0].email,
          profileImage: response.data[0].profileImage // Assume API returns profileImage too
        });
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  // Handle form submission to update user settings
  const handleSave = () => {
    axios.put('http://localhost:9090/api/updateSettings', {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage // Include profileImage in the update payload
      })
      .then(response => {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 1000);
      })
      .catch(error => console.error('Error updating settings:', error));
  };

  // Handle profile image selection
  const handleImageSelect = (image) => {
    setUser({ ...user, profileImage: image });
  };

  return (
    <div className="p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      <div className="mb-4">
        <label className="block mb-2">Username:</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Profile Image:</label>
        <div className="flex space-x-4">
          {defaultImages.map((image, index) => (
            <div key={index} className="cursor-pointer" onClick={() => handleImageSelect(image)}>
              <img
                src={image}
                alt={`Profile ${index + 1}`}
                className={`w-16 h-16 rounded-full border-2 ${user.profileImage === image ? 'border-blue-500' : 'border-transparent'}`}
              />
            </div>
          ))}
        </div>
        {user.profileImage && (
          <div className="mt-4">
            <span className="block mb-2">Selected Profile Image:</span>
            <img src={user.profileImage} alt="Selected" className="w-16 h-16 rounded-full border-2 border-blue-500" />
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Changes
      </button>

      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          Successfully updated!
        </div>
      )}
    </div>
  );
};

export default Settings;
