import React from 'react';

const ChartCard = ({ title }) => {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center min-h-[200px]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
        Chart goes here
      </div>
    </div>
  );
};

export default ChartCard; 