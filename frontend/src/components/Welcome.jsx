import React, { useEffect } from 'react';

const Welcome = ({ onGetStarted }) => {
  useEffect(() => {
    // Trigger fade-in and slide-up animations after mount
    const fade = document.querySelector('.fade-in');
    const slide = document.querySelector('.slide-up');
    if (fade) fade.style.opacity = 1;
    if (slide) slide.style.opacity = 1;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 no-scrollbar" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f9fa', overflowX: 'hidden' }}>
      <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="airplane-animation absolute">
            <i className="ri-flight-takeoff-line text-primary/20 ri-3x"></i>
          </div>
          <div className="airplane-animation-2 absolute">
            <i className="ri-flight-land-line text-primary/20 ri-3x"></i>
          </div>
        </div>
        <div className="max-w-4xl text-center relative fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-lg text-primary hover-float pulse-animation">
              <i className="ri-flight-takeoff-line ri-2x"></i>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to <span className="font-['Pacifico'] text-primary">AeroAnalytics</span></h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Your comprehensive solution for airport analytics, powered by AI and machine learning. Monitor traffic, analyze trends, and make data-driven decisions.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 slide-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <div className="bg-white p-6 rounded-xl shadow-sm hover-card transform transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full text-primary mb-4 mx-auto hover-float pulse-animation">
                <i className="ri-flight-takeoff-line ri-lg"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Real-time Analytics</h3>
              <p className="text-gray-600 text-sm">Monitor airport traffic and performance with live data updates</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover-card">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full text-primary mb-4 mx-auto">
                <i className="ri-line-chart-line ri-lg"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Smart Insights</h3>
              <p className="text-gray-600 text-sm">AI-powered trend analysis and predictive analytics</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover-card">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full text-primary mb-4 mx-auto">
                <i className="ri-shield-check-line ri-lg"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Enterprise Security</h3>
              <p className="text-gray-600 text-sm">Advanced encryption and data protection systems</p>
            </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors shadow-sm !rounded-button" onClick={onGetStarted}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 