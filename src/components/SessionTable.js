import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


// const members = ['John Doe', 'Jane Smith', 'Sarah Connor', 'Michael Brown'];

const SessionTable = ({ searchTerm }) => {
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [editingStatusIndex, setEditingStatusIndex] = useState(null);
  const [editingAssigneeIndex, setEditingAssigneeIndex] = useState(null);
  const [changed, setChanged] = useState(false);
  const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all bugs
    const fetchBugs = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/getAllBugs');
        const bugs = response.data;

        // Fetch user details for each bug
        await fetchUserDetails(bugs);
      } catch (error) {
        console.error('Error fetching bugs:', error);
      }
    };

    // Fetch user details based on reportedBy and assignedTo IDs
    const fetchUserDetails = async (bugs) => {
      try {
        const usersMap = {};
        const userRequests = bugs.map(async (bug) => {
          if (!usersMap[bug.reportedBy]) {
            const reporterResponse = await axios.get(`http://localhost:9090/api/user/${bug.reportedBy}`);
            usersMap[bug.reportedBy] = reporterResponse.data.name;
          }
          if (!usersMap[bug.assignedTo]) {
            const assigneeResponse = await axios.get(`http://localhost:9090/api/user/${bug.assignedTo}`);
            usersMap[bug.assignedTo] = assigneeResponse.data.name;
          }
        });

        await Promise.all(userRequests);

        // Format data for sessions
        const formattedData = bugs.map((bug) => ({
          id: bug.id,
          date: bug.createdAt,
          reporter: usersMap[bug.reportedBy] || '',
          assignee: usersMap[bug.assignedTo] || '',
          title: bug.title,
          status: bug.status,
        }));

        setSessions(formattedData);
        console.log("sessions: ", sessions);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/allUsers');
        const userlist = response.data;
        setUsers(userlist);

      } catch (error) {
        console.error('Error fetching bugs:', error);
      }
    };

    fetchUsers();
    fetchBugs();

  }, [sessions]);

  // Filter sessions based on the search term
  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.reporter.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedSessions = [...sessions].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSessions(sortedSessions);
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  
  // Update the bug status
  const handleStatusChange = async (index, newStatus) => {
    const updatedSessions = [...sessions];
    const bugId = updatedSessions[index].id;
    if (!validStatuses.includes(newStatus)) {
      console.error("Invalid status value");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:9090/api/statusChangeToBug?bugId=${bugId}&status=${newStatus}`);
      console.log('Status updated:', response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  const handleAssigneeChange = async (index, newAssigneeId) => {
    const updatedSessions = [...sessions];
    const bugId = updatedSessions[index].id;

    const assignee = users.find(user => user.id === newAssigneeId);

    // Update the assignee locally first
    updatedSessions[index].assignee = assignee; // Use ID for the assignee
    setSessions(updatedSessions);
    setEditingAssigneeIndex(null);
    setChanged(!changed);

    // Send POST request to assign the user to the bug using query parameters
    try {
      await axios.post(`http://localhost:9090/api/assignUserToBug?bugId=${bugId}&assignedTo=${newAssigneeId}`);
      console.log('User assigned to bug successfully.');
    } catch (error) {
      console.error('Error assigning user to bug:', error);
    }
  };

  const openStackOverflow = (bugId) => {
    navigate('/developer-tool', { state: { bugId } });
  };
  
  return (
    <div className="p-6">
      <table className="min-w-full table-fixed bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="w-1/6 p-4 cursor-pointer" onClick={() => handleSort('date')}>
              Date {getSortArrow('date')}
            </th>
            <th className="w-1/6 p-4 cursor-pointer" onClick={() => handleSort('reporter')}>
              Reporter {getSortArrow('reporter')}
            </th>
            {/* <th className="w-1/6 p-4 cursor-pointer" onClick={() => handleSort('assignee')}>
              Assignee {getSortArrow('assignee')}
            </th> */}
            <th className="w-1/6 p-4 cursor-pointer" onClick={() => handleSort('title')}>
              Title {getSortArrow('title')}
            </th>
            <th className="w-1/6 p-4">Status</th>
            <th className="w-1/6 p-4">Actions</th> {/* New Actions Column */}
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map((session, index) => (
            <tr key={index} className="hover:bg-gray-100 border-b border-gray-200 transition duration-300">
              <td className="p-4">{session.date}</td>
              <td className="p-4">{session.reporter}</td>

              {/* Assignee Column */}
              {/* <td className="p-4 relative">
                {editingAssigneeIndex === index ? (
                  <select
                    className="p-2 bg-white border rounded shadow-md w-full"
                    value={session.assignee}
                    onChange={(e) => handleAssigneeChange(index, e.target.value)}
                    onBlur={() => setEditingAssigneeIndex(null)}
                  >
                    <option value="">Select Assignee</option>
                    {users.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="p-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer w-full"
                    onClick={() => setEditingAssigneeIndex(index)}
                  >
                    {session.assignee || 'Select Assignee'}
                  </div>
                )}
              </td> */}

              <td className="p-4">{session.title}</td>

              {/* Status Column */}
              <td className="p-4 relative">
                <div className="p-2 rounded-md text-gray-700 w-full">
                  {session.status || 'To Do'}
                </div>
              </td>

              {/* New Actions Column */}
              <td className="p-4 text-center">
                <button
                  className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-300"
                  // onClick={openStackOverflow}
                  onClick={() => openStackOverflow(session.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;