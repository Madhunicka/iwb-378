import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal'; 

const BugDetails = () => {
  const location = useLocation();
  const { bugId } = location.state || {};
  const [bugDetails, setBugDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Network'); // State to handle active tab
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [selectedImage, setSelectedImage] = useState(''); // State to manage the selected image
  const [selectedStatus, setSelectedStatus] = useState(''); // State for selected status
  const [userNames, setUserNames] = useState({ reportedBy: '', assignedTo: '' }); // State for user names
  const [allUsers, setAllUsers] = useState([]); // State to store all users
  const [selectedUserId, setSelectedUserId] = useState(null); // State for the selected user ID

  // State for logs
  const [networkLogs, setNetworkLogs] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);

  useEffect(() => {
    if (bugId) {
      const fetchBugDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:9090/api/bugs/${bugId}/details`);
          console.log('Bug Details Response:', response.data);
          setBugDetails(response.data);
          setSelectedStatus(response.data.bug.status); // Initialize selected status
          setSelectedUserId(response.data.bug.assignedTo); // Set the selected user ID

          // Separate logs into network and console logs based on the type
          setNetworkLogs(response.data.logs.filter(log => log.log_type === 'network'));
          setConsoleLogs(response.data.logs.filter(log => log.log_type === 'console'));


          // Fetch user names based on IDs
          const reportedByName = await axios.get(`http://localhost:9090/api/user/${response.data.bug.reportedBy}`);
          const assignedToName = await axios.get(`http://localhost:9090/api/user/${response.data.bug.assignedTo}`);
          
          setUserNames({
            reportedBy: reportedByName.data.name || 'Name not found',
            assignedTo: assignedToName.data.name || 'Name not found',
          });
        } catch (error) {
          console.error('Error fetching bug details:', error);
          setError('Failed to fetch bug details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      const fetchAllUsers = async () => {
        try {
          const response = await axios.get('http://localhost:9090/api/allUsers');
          setAllUsers(response.data); // Set the list of all users
        } catch (error) {
          console.error('Error fetching all users:', error);
        }
      };

      fetchBugDetails();
      fetchAllUsers(); // Fetch all users on component mount
    } else {
      setError('No Bug ID provided.');
      setLoading(false);
    }
  }, [bugId]);

  if (loading) {
    return <div className="p-6">Loading bug details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!bugDetails) {
    return <div className="p-6">No bug details available.</div>;
  }

  const { bug, screenshots, comments } = bugDetails;

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

  // Handle status change
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);

    try {
      await axios.post(`http://localhost:9090/api/bugs/${bugId}/status`, { status: newStatus });
      // Optionally refetch bug details to get the updated data
      const response = await axios.get(`http://localhost:9090/api/bugs/${bugId}/details`);
      setBugDetails(response.data);
    } catch (error) {
      console.error('Error updating bug status:', error);
      setError('Failed to update bug status. Please try again later.');
    }
  };

  // Handle user assignment
  const handleUserAssignment = async (event) => {
    const newUserId = event.target.value;
    setSelectedUserId(newUserId);

    try {
      await axios.post(`http://localhost:9090/api/assignUserToBug?bugId=${bugId}&assignedTo=${newUserId}`);
      // Optionally refetch bug details to get the updated data
      const response = await axios.get(`http://localhost:9090/api/bugs/${bugId}/details`);
      setBugDetails(response.data);

      // Fetch the new assigned user name
      const assignedToName = await axios.get(`http://localhost:9090/api/user/${newUserId}`);
      setUserNames(prevNames => ({ ...prevNames, assignedTo: assignedToName.data.name }));
    } catch (error) {
      console.error('Error assigning user to bug:', error);
      setError('Failed to assign user to bug. Please try again later.');
    }
  };

  // Define the status options
  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Closed', label: 'Closed' },
  ];

  return (
    <div className="flex flex-col p-1 space-x-4">
      {/* Navigation Bar with Bug Title and Description */}
      <div className="bg-gray-800 text-white p-4 rounded mb-4">
        <h1 className="text-2xl font-bold">{bug.title || 'Title not available'}</h1>
        <p>{bug.description || 'Description not available'}</p>
      </div>

      <div className="flex space-x-4">
        {/* Left Side: Logs */}
        <div className="w-1/3 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Logs</h2>
          <div className="flex space-x-2 mb-4">
            <button
              className={`py-2 px-4 rounded ${activeTab === 'Network' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('Network')}
            >
              Network
            </button>
            <button
              className={`py-2 px-4 rounded ${activeTab === 'Console' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('Console')}
            >
              Console
            </button>
          </div>
          {activeTab === 'Network' && networkLogs.length > 0 ? (
            <ul>
              {networkLogs.map((log, index) => (
                <li key={index} className="mb-2">{log.log_data}</li>
              ))}
            </ul>
          ) : activeTab === 'Console' && consoleLogs.length > 0 ? (
            <ul>
              {consoleLogs.map((log, index) => (
                <li key={index} className="mb-2">{log.log_data}</li>
              ))}
            </ul>
          ) : (
            <p>No logs available.</p>
          )}
        </div>

        {/* Center: Screenshots and Comments */}
        <div className="w-1/2 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Screenshots</h2>
          {screenshots && screenshots.length > 0 ? (
            <div className="flex flex-wrap gap-4 mb-4 justify-center">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="w-full p-2 border rounded-lg shadow">
                  <img
                    src={screenshot.screenshot_url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-auto rounded mx-auto cursor-pointer"
                    onClick={() => handleImageClick(screenshot.screenshot_url)} // Handle click to open modal
                  />
                  <p className="text-sm text-gray-500">Uploaded at: {screenshot.createdAt}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No screenshots available.</p>
          )}

          {/* Comments Area */}
          <h2 className="text-lg font-semibold mb-2">Comments</h2>
          {comments && comments.length > 0 ? (
            <ul className="mb-4">
              {comments.map((comment, index) => (
                <li key={index} className="border-b py-2">{comment.comment_text}</li>
              ))}
            </ul>
          ) : (
            <p>No comments available.</p>
          )}
        </div>

        {/* Right Side: Bug Details and User Assignment */}
        <div className="w-1/4 bg-gray-100 p-4 rounded shadow">
  <h2 className="text-lg font-semibold mb-2">Bug Details</h2>
  
  <div className="mb-4">
    <p className="font-medium">Status:</p>
    <select
      value={selectedStatus}
      onChange={handleStatusChange}
      className="mt-2 p-2 border rounded shadow-sm w-full bg-white hover:bg-gray-100"
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>

  <div className="mb-4">
    <p className="font-medium">Reported By:</p>
    <p className="text-gray-700">{userNames.reportedBy || 'Reported by user not found'}</p>
  </div>

  {/* <div className="mb-4">
    <p className="font-medium">Assigned To:</p>
    <p className="text-gray-700">{userNames.assignedTo || 'Assigned user not found'}</p>
  </div> */}

  {/* Dropdown for Assigning Users */}
  <div className="mb-4">
    <label htmlFor="user-dropdown" className="block font-medium">Assign User:</label>
    <select
      id="user-dropdown"
      value={selectedUserId || ''}
      onChange={handleUserAssignment}
      className="mt-2 p-2 border rounded shadow-sm w-full bg-white hover:bg-gray-100"
    >
      <option value="" disabled>Select a user</option>
      {allUsers.map((user) => (
        <option key={user.id} value={user.id}>{user.name}</option>
      ))}
    </select>
  </div>

  {/* Display Created At and Updated At with Formatting */}
  <div className="mb-4">
    <p className="font-medium">Created At:</p>
    <p className="text-gray-700">{new Date(bug.createdAt).toLocaleString() || 'Creation date not available'}</p>
  </div>
  
  <div>
    <p className="font-medium">Updated At:</p>
    <p className="text-gray-700">{new Date(bug.updatedAt).toLocaleString() || 'Update date not available'}</p>
  </div>
</div>

      </div>

      {/* Modal for Viewing Screenshots */}
      <Modal isOpen={isModalOpen} onClose={closeModal} imageSrc={selectedImage} />
    </div>
  );
};

export default BugDetails;
