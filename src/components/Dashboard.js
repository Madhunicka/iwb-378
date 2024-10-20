
import React, { useState } from 'react';
import SessionTable from './SessionTable';
import SearchBar from './SearchBar';
import SideBar from './SideBar';
import Setting from './Setting'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('sessions');

  return (
    <div className="flex">
      <SideBar setActiveView={setActiveView} />
      <div className="flex-1 bg-gray-100">
        <SearchBar setSearchTerm={setSearchTerm} />
        {activeView === 'sessions' ? (
          <SessionTable searchTerm={searchTerm} />
        ) : (
          <Setting />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
