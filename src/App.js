import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './LandingPage';
import ManualEntry from './ManualEntry';
import Upload from './Upload';
import './index.css';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              Two Loonies
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/manual"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/manual' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Manual Entry
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/manual" element={<ManualEntry />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
