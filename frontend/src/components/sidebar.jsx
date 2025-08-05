import React, { useContext } from 'react';
import { AppContext } from '../context/Appcontext';
const Sidebar = () => {
  const { setActiveTab, activeTab } = useContext(AppContext);

  return (
    <nav className="h-full py-8 px-4 bg-gray-100 rounded-2xl">
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => setActiveTab('upload')}
            className={`block w-full text-left px-4 py-2 rounded transition font-medium ${
              activeTab === 'upload'
                ? 'bg-blue-100 border-l-4 border-[#75ABFC] text-blue-700 font-bold'
                : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            Upload Document
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('documents')}
            className={`block w-full text-left px-4 py-2 rounded transition font-medium ${
              activeTab === 'documents'
                ? 'bg-blue-100 border-l-4 border-[#75ABFC] text-blue-700 font-bold'
                : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            Documents
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;