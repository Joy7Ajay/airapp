import React from 'react';

const DataTable = ({ rows = [] }) => (
  <div className="bg-white rounded shadow p-4 mt-8">
    <h2 className="text-xl font-semibold mb-4">Detailed Data Table</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Airline</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.slice(0, 5).map((cell, i) => (
                <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{cell}</td>
              ))}
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className={`${row[5]?.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center text-sm`}>
                  {row[5]?.trend === 'up' ? '▲' : '▼'} {row[5]?.value}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{row[6]}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{row[7]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable; 