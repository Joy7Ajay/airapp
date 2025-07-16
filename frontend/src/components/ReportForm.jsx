import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

const metricsList = [
  { label: 'Passengers', value: 'passengers' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Flights', value: 'flights' },
];
const groupByOptions = [
  { label: 'Airline', value: 'airline' },
  { label: 'Destination', value: 'destination' },
  { label: 'Date', value: 'date' },
];

const mockReportData = (metrics, groupBy) => {
  // Generate mock data for the chart
  const categories = groupBy === 'airline'
    ? ['Delta', 'United', 'Emirates', 'Lufthansa']
    : groupBy === 'destination'
    ? ['Tokyo', 'London', 'Paris', 'Dubai']
    : ['2025-07-01', '2025-07-02', '2025-07-03', '2025-07-04'];
  return {
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: metrics.map(metric => ({
      name: metric,
      type: 'bar',
      data: categories.map(() => Math.floor(Math.random() * 10000) + 1000),
    })),
    legend: { data: metrics },
    tooltip: { trigger: 'axis' },
  };
};

const ReportForm = ({ triggerNotification }) => {
  const [startDate, setStartDate] = useState('2025-07-01');
  const [endDate, setEndDate] = useState('2025-07-04');
  const [metrics, setMetrics] = useState(['passengers']);
  const [groupBy, setGroupBy] = useState('airline');
  const [reportOption, setReportOption] = useState(null);
  const [reportReady, setReportReady] = useState(false);

  const handleMetricChange = (metric) => {
    setMetrics(m => m.includes(metric) ? m.filter(x => x !== metric) : [...m, metric]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const option = mockReportData(metrics, groupBy);
    setReportOption(option);
    setReportReady(true);
    if (triggerNotification) triggerNotification('report');
  };

  const handleDownload = () => {
    // Download as image (simple approach: use ECharts API in real app)
    alert('Download feature coming soon!');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Generate Report</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Date Range</label>
          <div className="flex gap-2">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
            <span className="text-gray-500">to</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Metrics</label>
          <div className="flex gap-4">
            {metricsList.map(m => (
              <label key={m.value} className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={metrics.includes(m.value)}
                  onChange={() => handleMetricChange(m.value)}
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Group By</label>
          <select value={groupBy} onChange={e => setGroupBy(e.target.value)} className="border rounded px-2 py-1">
            {groupByOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Generate Report</button>
      </form>
      {reportReady && reportOption && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Report Result</h3>
          <ReactECharts option={reportOption} style={{ height: 320 }} />
          <button onClick={handleDownload} className="mt-4 bg-gray-200 px-4 py-2 rounded">Download</button>
        </div>
      )}
    </div>
  );
};

export default ReportForm; 