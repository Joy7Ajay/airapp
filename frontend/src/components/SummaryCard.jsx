import React from 'react';

const SummaryCard = ({ icon, label, value, color }) => (
  <div className={`flex items-center bg-white rounded-lg shadow p-4 min-w-[180px] border-t-4 ${color}`}>
    <div className="text-3xl mr-4">{icon}</div>
    <div>
      <div className="text-gray-500 text-xs font-semibold uppercase">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  </div>
);

export default SummaryCard; 