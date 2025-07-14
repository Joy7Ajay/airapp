import React from 'react';

// Placeholder for world map. Replace with react-simple-maps implementation after install.
const MapChart = ({ title }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-h-[300px]">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="w-full h-64 flex items-center justify-center text-gray-400">
      World map goes here (install react-simple-maps)
    </div>
  </div>
);

export default MapChart; 