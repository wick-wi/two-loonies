import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Take control of your money with Two Loonies.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              A simple way to understand your spending and make smarter financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/upload"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl inline-block text-center"
              >
                Upload a Statement
              </Link>
              <Link 
                to="/manual"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 bg-white hover:bg-gray-50 inline-block text-center"
              >
                Enter Data Manually
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Two Loonies?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to take control of your finances, built for Canadians.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  See where your money goes
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get a clear breakdown of your spending patterns and identify areas where you can save.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Get simple charts and insights
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Visualize your financial data with easy-to-understand charts and actionable insights.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Track across all your accounts
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect all your bank accounts and credit cards for a complete financial picture.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Fast and secure, Canadian-built
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Built in Canada with bank-level security and privacy protection you can trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                See Your Money in Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get a glimpse of how Two Loonies helps you visualize and understand your financial data.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Dashboard Preview</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart Placeholder 1 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-2 opacity-60"></div>
                          <p className="text-sm text-gray-500 font-medium">Spending Chart</p>
                        </div>
                      </div>
                    </div>
                    {/* Chart Placeholder 2 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 opacity-60"></div>
                          <p className="text-sm text-gray-500 font-medium">Budget Overview</p>
                        </div>
                      </div>
                    </div>
                    {/* Chart Placeholder 3 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-500 rounded-lg mx-auto mb-2 opacity-60" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                          <p className="text-sm text-gray-500 font-medium">Trends Analysis</p>
                        </div>
                      </div>
                    </div>
                    {/* Chart Placeholder 4 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="h-32 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-500 rounded-lg mx-auto mb-2 opacity-60"></div>
                          <p className="text-sm text-gray-500 font-medium">Account Summary</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400 italic">
                      Interactive dashboard coming soon - upload your statement to see your personalized insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center space-x-8 mb-4">
                <a href="/about"   className="text-sm text-gray-600 hover:underline">About</a>
                <a href="/privacy" className="text-sm text-gray-600 hover:underline">Privacy</a>
                <a href="/contact" className="text-sm text-gray-600 hover:underline">Contact</a>
              </div>
              <p className="text-gray-500 text-xs">
                © 2024 Two Loonies. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;
