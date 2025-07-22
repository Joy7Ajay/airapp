import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartCard = ({ title, data }) => {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center min-h-[200px]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {data && data.labels && data.values ? (
        <Bar
          data={{
            labels: data.labels,
            datasets: [
              {
                label: title,
                data: data.values,
                backgroundColor: '#1a73e8',
                borderColor: '#1a73e8',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      ) : (
        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
          Chart goes here
        </div>
      )}
    </div>
  );
};

export default ChartCard; 