import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  RiFlightTakeoffLine, RiUserLine, RiPlaneLine, RiMapPinLine, RiMoneyDollarCircleLine, RiArrowUpSLine, RiArrowDownSLine, RiNotification3Line, RiSearchLine, RiFilter3Line, RiDownloadLine, RiMore2Fill, RiArrowLeftSLine, RiArrowRightSLine, RiLightbulbLine, RiLineChartLine, RiFlightLandLine, RiCheckLine, RiRefreshLine, RiShieldCheckLine, RiLockLine, RiEyeLine, RiHistoryLine
} from 'react-icons/ri';
import * as echarts from "echarts";
import { getPassengerPrediction, getAnomalies, getInsights } from '../api';


const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentPeriod, setCurrentPeriod] = useState('June 26 - July 2, 2025');
  const [kpiData, setKpiData] = useState([]);
  const [passengerOption, setPassengerOption] = useState({});
  const [airlineOption, setAirlineOption] = useState({});
  const [destinationOption, setDestinationOption] = useState({});
  const [revenueOption, setRevenueOption] = useState({});
  const [tableRows, setTableRows] = useState([]);
  const [insights, setInsights] = useState([]);
  const [genderFilters, setGenderFilters] = useState({ Female: true, Male: true });
  const [ageFilters, setAgeFilters] = useState({ Child: true, Adult: true });
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period === 'week') setCurrentPeriod('June 26 - July 2, 2025');
    if (period === 'month') setCurrentPeriod('June 1 - June 30, 2025');
    if (period === 'year') setCurrentPeriod('January 1 - December 31, 2025');
  };

  function generateDemoRows(count = 20) {
    const airlines = ['Delta Air', 'United Airlines', 'American Airlines', 'Emirates', 'Lufthansa'];
    const destinations = ['Tokyo, Japan', 'London, UK', 'Paris, France', 'Dubai, UAE', 'Berlin, Germany'];
    const genders = ['Female', 'Male'];
    const ages = ['Child', 'Adult'];
    const rows = [];
    for (let i = 0; i < count; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const destination = destinations[Math.floor(Math.random() * destinations.length)];
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const age = ages[Math.floor(Math.random() * ages.length)];
      const passengers = Math.floor(Math.random() * 2000) + 1000;
      const revenue = `$${(Math.random() * 100000 + 50000).toFixed(0)}`;
      const trend = Math.random() > 0.5 ? 'up' : 'down';
      const value = `${(Math.random() * 20).toFixed(1)}%`;
      const date = `July ${Math.floor(Math.random() * 30) + 1}, 2025`;
      rows.push([date, airline, destination, passengers, revenue, { trend, value }, gender, age]);
    }
    return rows;
  }

  useEffect(() => {
    const fetchData = async () => {
      // Mock historical data for prediction
      const historicalData = {
        // This would be real data from your DB
        '2025-07-01': 18500, '2025-07-02': 16800, '2025-07-03': 19200,
        '2025-07-04': 21500, '2025-07-05': 23200, '2025-07-06': 24800,
        '2025-07-07': 21300,
      };

      const prediction = await getPassengerPrediction(historicalData);
      const anomalies = await getAnomalies({
        passengers: [18500, 16800, 19200, 21500, 23200, 24800, 21300, 25000],
        revenue: [120000, 110000, 130000, 140000, 150000, 160000, 145000, 10000],
        flight_count: [100, 95, 105, 110, 115, 120, 112, 20],
        timestamp: ['2025-07-01 10:00:00', '2025-07-02 10:00:00', '2025-07-03 10:00:00', '2025-07-04 10:00:00', '2025-07-05 10:00:00', '2025-07-06 10:00:00', '2025-07-07 10:00:00', '2025-07-08 10:00:00']
      });
      const kpiForInsights = {
        passengers: 127842,
        top_airline: 'Delta Air',
        airline_share: 28.5,
        top_destination: 'Japan',
        revenue: 4370000,
        growth: 12.3
      };
      const insightReport = await getInsights(kpiForInsights);
      setInsights([insightReport]);


      // Mock data - replace with actual API calls that fetch this data
      const fetchedKpiData = [
          { label: 'Total Passengers', value: '127,842', icon: <RiUserLine className="text-primary text-2xl" />, bg: 'bg-blue-100', color: 'text-primary', trend: 'up', percent: '12.3%', trendColor: 'text-green-600', sub: 'vs previous period' },
          { label: 'Top Airline', value: 'Delta Air', icon: <RiPlaneLine className="text-green-600 text-2xl" />, bg: 'bg-green-100', color: 'text-green-600', trend: 'up', percent: '3.2%', trendColor: 'text-green-600', sub: '28.5% market share' },
          { label: 'Top Destination', value: 'Japan', icon: <RiMapPinLine className="text-purple-600 text-2xl" />, bg: 'bg-purple-100', color: 'text-purple-600', trend: 'up', percent: '8.7%', trendColor: 'text-green-600', sub: '15,642 passengers' },
          { label: 'Total Revenue', value: '$4.37M', icon: <RiMoneyDollarCircleLine className="text-amber-600 text-2xl" />, bg: 'bg-amber-100', color: 'text-amber-600', trend: 'down', percent: '2.1%', trendColor: 'text-red-600', sub: 'vs previous period' },
      ];
      setKpiData(fetchedKpiData);

      const passengerData = prediction.short_term;
      setPassengerOption({
          animation: false,
          tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#e5e7eb', textStyle: { color: '#1f2937' } },
          grid: { top: 10, right: 10, bottom: 20, left: 40 },
          xAxis: { type: 'category', data: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'], axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#1f2937' } },
          yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#1f2937' }, splitLine: { lineStyle: { color: '#f3f4f6' } } },
          series: [{ data: passengerData, type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 3, color: 'rgba(87,181,231,1)' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(87,181,231,0.2)' }, { offset: 1, color: 'rgba(87,181,231,0.01)' }] } } }]
      });

      // Mock data - now with gender and age group
      setTableRows(generateDemoRows(20));
    };

    fetchData();
  }, [selectedPeriod]);

  // Filtering logic
  const filteredRows = tableRows.filter(row =>
    genderFilters[row[6]] && ageFilters[row[7]]
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-full text-white">
              <RiFlightTakeoffLine className="text-2xl" />
            </div>
            <h1 className="text-2xl font-['Pacifico'] text-primary">AeroAnalytics</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-800 hover:text-primary font-medium">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-primary">Reports</a>
              <a href="#" className="text-gray-500 hover:text-primary">Settings</a>
              <a href="#" className="text-gray-500 hover:text-primary">Help</a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-600">
                <RiNotification3Line />
              </div>
              <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
                <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20airport%20executive%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait&width=100&height=100&seq=1&orientation=squarish" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Time Period Selector */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Airport Analytics Dashboard</h2>
          <div className="bg-white rounded-full shadow-sm p-1 inline-flex">
            <button onClick={() => handlePeriodChange('week')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap !rounded-button ${selectedPeriod === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Week</button>
            <button onClick={() => handlePeriodChange('month')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap !rounded-button ${selectedPeriod === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Month</button>
            <button onClick={() => handlePeriodChange('year')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap !rounded-button ${selectedPeriod === 'year' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Year</button>
          </div>
        </div>
        {/* Date Range */}
        <div className="mb-6 bg-white rounded shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Current Period:</span>
            <span className="font-medium text-gray-800">{currentPeriod}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 whitespace-nowrap !rounded-button"><RiArrowLeftSLine className="text-lg" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 whitespace-nowrap !rounded-button"><RiArrowRightSLine className="text-lg" /></button>
            <div className="h-6 border-l border-gray-300 mx-1"></div>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap !rounded-button">Today</button>
          </div>
        </div>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpiData.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">{kpi.label}</h3>
                  <p className="text-3xl font-semibold text-gray-800 mt-1">{kpi.value}</p>
                </div>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${kpi.bg} ${kpi.color}`}>{kpi.icon}</div>
              </div>
              <div className="flex items-center">
                <span className={`${kpi.trendColor} flex items-center text-sm font-medium`}>{kpi.trend === 'up' ? <RiArrowUpSLine /> : <RiArrowDownSLine />}{kpi.percent}</span>
                <span className="text-gray-500 text-sm ml-2">{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Passenger Traffic Trend</h3>
              <div className="flex items-center gap-2">
                <button className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 whitespace-nowrap !rounded-button"><RiDownloadLine className="mr-1 inline" /> Export</button>
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap !rounded-button"><RiMore2Fill /></button>
              </div>
            </div>
            <ReactECharts option={passengerOption} style={{ height: 256 }} />
          </div>
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Airline Market Share</h3>
              <div className="flex items-center gap-2">
                <button className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 whitespace-nowrap !rounded-button"><RiDownloadLine className="mr-1 inline" /> Export</button>
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap !rounded-button"><RiMore2Fill /></button>
              </div>
            </div>
            <ReactECharts option={airlineOption} style={{ height: 256 }} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Top Destinations</h3>
              <div className="flex items-center gap-2">
                <button className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 whitespace-nowrap !rounded-button"><RiDownloadLine className="mr-1 inline" /> Export</button>
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap !rounded-button"><RiMore2Fill /></button>
              </div>
            </div>
            <ReactECharts option={destinationOption} style={{ height: 256 }} />
          </div>
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Revenue Analysis</h3>
              <div className="flex items-center gap-2">
                <button className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 whitespace-nowrap !rounded-button"><RiDownloadLine className="mr-1 inline" /> Export</button>
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap !rounded-button"><RiMore2Fill /></button>
              </div>
            </div>
            <ReactECharts option={revenueOption} style={{ height: 256 }} />
          </div>
        </div>
        {/* Data Table */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Detailed Analytics</h3>
              <div className="flex items-center gap-3">
                <div className="relative" ref={filterRef}>
                  <button
                    className="px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 whitespace-nowrap !rounded-button"
                    onClick={() => setFilterOpen((open) => !open)}
                  >
                    <RiFilter3Line className="mr-1 inline" /> Filter
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-20 p-4">
                      <div className="mb-2 text-sm font-semibold text-gray-700">Gender</div>
                      {['Female', 'Male'].map(gender => (
                        <label key={gender} className="flex items-center text-sm mb-1">
                          <input
                            type="checkbox"
                            checked={genderFilters[gender]}
                            onChange={() => setGenderFilters(f => ({ ...f, [gender]: !f[gender] }))}
                            className="mr-2"
                          />
                          {gender}
                        </label>
                      ))}
                      <div className="mt-3 mb-2 text-sm font-semibold text-gray-700">Age Group</div>
                      {['Child', 'Adult'].map(age => (
                        <label key={age} className="flex items-center text-sm mb-1">
                          <input
                            type="checkbox"
                            checked={ageFilters[age]}
                            onChange={() => setAgeFilters(f => ({ ...f, [age]: !f[age] }))}
                            className="mr-2"
                          />
                          {age}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input type="text" placeholder="Search..." className="pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-56" />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><RiSearchLine /></div>
                </div>
              </div>
            </div>
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
                  {filteredRows.map((row, idx) => (
                    <tr key={idx}>
                      {row.slice(0, 5).map((cell, i) => (
                        <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{cell}</td>
                      ))}
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`${row[5].trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center text-sm`}>
                          {row[5].trend === 'up' ? <RiArrowUpSLine /> : <RiArrowDownSLine />} {row[5].value}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{row[6]}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{row[7]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="text-gray-500">Showing 5 of 124 entries</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap !rounded-button">Previous</button>
                <button className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 whitespace-nowrap !rounded-button">1</button>
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap !rounded-button">2</button>
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap !rounded-button">3</button>
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap !rounded-button">Next</button>
              </div>
            </div>
          </div>
        </div>
        {/* AI & Security Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">AI Insights</h3>
              <div className="flex items-center"><span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Beta</span></div>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-primary flex-shrink-0"><RiLightbulbLine /></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Passenger Trend Prediction</h4>
                    <p className="text-xs text-gray-600 mt-1">Based on current data, we predict a 15% increase in passenger traffic next week due to upcoming holiday season.</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600 flex-shrink-0"><RiLineChartLine /></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Revenue Optimization</h4>
                    <p className="text-xs text-gray-600 mt-1">Retail spending could increase by 8% if duty-free promotions are scheduled during peak travel hours (10AM-2PM).</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full text-amber-600 flex-shrink-0"><RiFlightLandLine /></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Emerging Destination</h4>
                    <p className="text-xs text-gray-600 mt-1">We've detected a 23% increase in bookings to Bali, Indonesia. Consider allocating additional resources.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ML Analysis */}
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">ML Analysis</h3>
              <div className="flex items-center gap-2">
                <label className="custom-switch">
                  <input type="checkbox" checked readOnly />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Anomaly Detection</h4>
                  <p className="text-xs text-gray-500">Monitoring unusual patterns</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600"><RiCheckLine /></div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Predictive Analytics</h4>
                  <p className="text-xs text-gray-500">Forecasting future trends</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-primary"><RiRefreshLine /></div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Pattern Recognition</h4>
                  <p className="text-xs text-gray-500">Identifying recurring behaviors</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600"><RiCheckLine /></div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Data Classification</h4>
                  <p className="text-xs text-gray-500">Categorizing passenger segments</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600"><RiCheckLine /></div>
              </div>
            </div>
          </div>
          {/* Security Status */}
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Security Status</h3>
              <div className="flex items-center"><span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Secure</span></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600 flex-shrink-0"><RiShieldCheckLine /></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Data Encryption</h4>
                    <p className="text-xs text-gray-500">256-bit AES encryption active</p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600 flex-shrink-0"><RiLockLine /></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Access Control</h4>
                    <p className="text-xs text-gray-500">Role-based permissions enabled</p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600 flex-shrink-0"><RiEyeLine /></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Threat Monitoring</h4>
                    <p className="text-xs text-gray-500">Real-time threat detection active</p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full text-amber-600 flex-shrink-0"><RiHistoryLine /></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Audit Logs</h4>
                    <p className="text-xs text-gray-500">Last audit: 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">© 2025 AeroAnalytics. All rights reserved.</div>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary">Contact Support</a>
          </div>
        </div>
      </footer>
      {/* Custom Switch CSS */}
      <style>{`
        .custom-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .custom-switch input { opacity: 0; width: 0; height: 0; }
        .switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
        .switch-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .switch-slider { background-color: #1a73e8; }
        input:checked + .switch-slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
};

export default Dashboard; 