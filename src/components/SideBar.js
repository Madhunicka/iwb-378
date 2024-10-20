import React, { useState } from 'react';

const SideBar = ({ setActiveView }) => {
  const [activeOption, setActiveOption] = useState('sessions');

  const handleOptionClick = (option) => {
    setActiveView(option);
    setActiveOption(option);
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-700">BugTracker</div>
      <nav className="flex-grow gap-5">
        <ul className="p-4 gap-3">
          <li
            className={`py-2 px-4 cursor-pointer rounded transition-all duration-300 ${
              activeOption === 'sessions' ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleOptionClick('sessions')}
          >
            Sessions
          </li>
          <li
            className={`py-2 px-4 cursor-pointer rounded transition-all duration-300 ${
              activeOption === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
            onClick={() => handleOptionClick('settings')}
          >
            Settings
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
