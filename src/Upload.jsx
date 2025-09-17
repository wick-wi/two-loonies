import React from 'react';

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Statement</h1>
          <p className="text-gray-600">Upload your bank statement to automatically extract transaction data</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Feature Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            We're working on adding automatic statement processing. For now, you can use the Manual Entry feature to input your financial data.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.hash = '/manual'}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Try Manual Entry Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
