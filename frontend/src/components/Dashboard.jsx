import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  RiFlightTakeoffLine, RiUserLine, RiPlaneLine, RiMapPinLine, RiMoneyDollarCircleLine, RiArrowUpSLine, RiArrowDownSLine, RiNotification3Line, RiSearchLine, RiFilter3Line, RiDownloadLine, RiMore2Fill, RiArrowLeftSLine, RiArrowRightSLine, RiLightbulbLine, RiLineChartLine, RiFlightLandLine, RiCheckLine, RiRefreshLine, RiShieldCheckLine, RiLockLine, RiEyeLine, RiHistoryLine
} from 'react-icons/ri';
import * as echarts from "echarts";
import { getPassengerPrediction, getAnomalies, getInsights } from '../api';
import AppLogo from '../assets/react.svg';
import { DataContext } from './DataContext';


const Dashboard = ({ goToFileUpload, uploadedData }) => {
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
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();
  const [passengerChartType, setPassengerChartType] = useState('line');
  const [airlineChartType, setAirlineChartType] = useState('pie');
  const [destinationChartType, setDestinationChartType] = useState('bar');
  const [revenueChartType, setRevenueChartType] = useState('line');
  const [openMenu, setOpenMenu] = useState(null);

  const { tableRows: contextTableRows, setTableRows: setContextTableRows, passengerData, setPassengerData } = useContext(DataContext);

  const extractKpis = (data) => {
    if (!data) return [];
    let topAirline = '-';
    let topAirlineCount = 0;
    let topDestination = '-';
    let topDestinationCount = 0;
    let totalPassengers = data.total_passengers || 0;
    const airlineCounts = {};
    const destinationCounts = {};
    (data.rows || []).forEach(row => {
      const airline = row.airline || '-';
      const dest = row.destination || '-';
      const passengers = Number(row.passengers) || 0;
      airlineCounts[airline] = (airlineCounts[airline] || 0) + passengers;
      destinationCounts[dest] = (destinationCounts[dest] || 0) + passengers;
    });
    for (const [airline, count] of Object.entries(airlineCounts)) {
      if (count > topAirlineCount) {
        topAirline = airline;
        topAirlineCount = count;
      }
    }
    for (const [dest, count] of Object.entries(destinationCounts)) {
      if (count > topDestinationCount) {
        topDestination = dest;
        topDestinationCount = count;
      }
    }
    const airlineMarketShare = totalPassengers > 0 ? ((topAirlineCount / totalPassengers) * 100).toFixed(1) : '-';
    return [
      { label: 'Total Passengers', value: data.total_passengers?.toLocaleString() || '-', icon: <RiUserLine className="text-primary text-2xl" />, bg: 'bg-blue-100', color: 'text-primary', trend: 'up', percent: '', trendColor: 'text-green-600', sub: '' },
      { label: 'Top Airline', value: topAirline, icon: <RiPlaneLine className="text-green-600 text-2xl" />, bg: 'bg-green-100', color: 'text-green-600', trend: 'up', percent: airlineMarketShare !== '-' ? `${airlineMarketShare}% market share` : '-', trendColor: 'text-green-600', sub: airlineMarketShare !== '-' ? `${airlineMarketShare}% market share` : '-' },
      { label: 'Top Destination', value: topDestination, icon: <RiMapPinLine className="text-purple-600 text-2xl" />, bg: 'bg-purple-100', color: 'text-purple-600', trend: 'up', percent: '', trendColor: 'text-green-600', sub: topDestinationCount ? `${topDestinationCount.toLocaleString()} passengers` : '-' },
      { label: 'Total Revenue', value: data.total_revenue ? `$${data.total_revenue.toLocaleString()}` : '-', icon: <RiMoneyDollarCircleLine className="text-amber-600 text-2xl" />, bg: 'bg-amber-100', color: 'text-amber-600', trend: 'up', percent: '', trendColor: 'text-green-600', sub: '' },
    ];
  };

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
    if (uploadedData) {
      setKpiData(extractKpis(uploadedData));
      setTableRows(
        uploadedData.rows?.map(row => [
          row.date || row.timestamp || '-',
          row.airline || '-',
          row.destination || '-',
          row.passengers || '-',
          row.revenue || '-',
          { trend: 'up', value: '0%' },
          row.gender || '-',
          row.age_group || row.age || '-',
        ]) || []
      );
      const dateLabels = uploadedData.rows?.map(row => row.date || row.timestamp || '-') || [];
      const passengerCounts = uploadedData.rows?.map(row => Number(row.passengers) || 0) || [];
      setPassengerOption({
        animation: false,
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#e5e7eb', textStyle: { color: '#1f2937' } },
        grid: { top: 10, right: 10, bottom: 20, left: 40 },
        xAxis: { type: 'category', data: dateLabels, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#1f2937' } },
        yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#1f2937' }, splitLine: { lineStyle: { color: '#f3f4f6' } } },
        series: [{ data: passengerCounts, type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 3, color: 'rgba(87,181,231,1)' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(87,181,231,0.2)' }, { offset: 1, color: 'rgba(87,181,231,0.01)' }] } } }]
      });
      const airlineCounts = {};
      uploadedData.rows?.forEach(row => {
        const airline = row.airline || '-';
        airlineCounts[airline] = (airlineCounts[airline] || 0) + (Number(row.passengers) || 0);
      });
      setAirlineOption({
        animation: false,
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [{
          name: 'Passengers',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: Object.entries(airlineCounts).map(([name, value]) => ({ name, value }))
        }]
      });
      const destinationCounts = {};
      uploadedData.rows?.forEach(row => {
        const dest = row.destination || '-';
        destinationCounts[dest] = (destinationCounts[dest] || 0) + (Number(row.passengers) || 0);
      });
      setDestinationOption({
        animation: false,
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [{
          name: 'Passengers',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: Object.entries(destinationCounts).map(([name, value]) => ({ name, value }))
        }]
      });
      const revenueValues = uploadedData.rows?.map(row => Number(row.revenue) || 0) || [];
      setRevenueOption({
        animation: false,
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#e5e7eb', textStyle: { color: '#1f2937' } },
        grid: { top: 10, right: 10, bottom: 20, left: 40 },
        xAxis: { type: 'category', data: dateLabels, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#1f2937' } },
        yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#1f2937' }, splitLine: { lineStyle: { color: '#f3f4f6' } } },
        series: [{ data: revenueValues, type: 'bar', barWidth: 24, itemStyle: { color: '#1a73e8' } }]
      });
    } else {
      const airlines = ['Delta Air', 'United Airlines', 'American Airlines', 'Emirates', 'Lufthansa'];
      const destinations = ['Tokyo, Japan', 'London, UK', 'Paris, France', 'Dubai, UAE', 'Berlin, Germany'];
      const topAirlineIdx = Math.floor(Math.random() * airlines.length);
      const topDestinationIdx = Math.floor(Math.random() * destinations.length);
      const totalPassengers = Math.floor(Math.random() * 50000) + 80000;
      const topAirlineShare = (Math.random() * 20 + 20).toFixed(1);
      const topDestinationPassengers = Math.floor(Math.random() * 10000) + 8000;
      const totalRevenue = (Math.random() * 2 + 3).toFixed(2);
      const passengerTrend = (Math.random() * 20 - 5).toFixed(1);
      const airlineTrend = (Math.random() * 10).toFixed(1);
      const destinationTrend = (Math.random() * 10).toFixed(1);
      const revenueTrend = (Math.random() * 10 - 5).toFixed(1);
      const revenueDown = Math.random() < 0.5;
      const fetchedKpiData = [
        { label: 'Total Passengers', value: totalPassengers.toLocaleString(), icon: <RiUserLine className="text-primary text-2xl" />, bg: 'bg-blue-100', color: 'text-primary', trend: 'up', percent: `${passengerTrend}%`, trendColor: 'text-green-600', sub: 'vs previous period' },
        { label: 'Top Airline', value: airlines[topAirlineIdx], icon: <RiPlaneLine className="text-green-600 text-2xl" />, bg: 'bg-green-100', color: 'text-green-600', trend: 'up', percent: `${topAirlineShare}% market share`, trendColor: 'text-green-600', sub: `${topAirlineShare}% market share` },
        { label: 'Top Destination', value: destinations[topDestinationIdx], icon: <RiMapPinLine className="text-purple-600 text-2xl" />, bg: 'bg-purple-100', color: 'text-purple-600', trend: 'up', percent: `${destinationTrend}%`, trendColor: 'text-green-600', sub: `${topDestinationPassengers.toLocaleString()} passengers` },
        { label: 'Total Revenue', value: `$${totalRevenue}M`, icon: <RiMoneyDollarCircleLine className="text-amber-600 text-2xl" />, bg: 'bg-amber-100', color: 'text-amber-600', trend: revenueDown ? 'down' : 'up', percent: `${revenueTrend}%`, trendColor: revenueDown ? 'text-red-600' : 'text-green-600', sub: 'vs previous period' },
      ];
      setKpiData(fetchedKpiData);
      setTableRows(generateDemoRows(20));
      const mockDates = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      const mockPassengers = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10000) + 10000);
      setPassengerOption({
          animation: false,
          tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#e5e7eb', textStyle: { color: '#1f2937' } },
          grid: { top: 10, right: 10, bottom: 20, left: 40 },
        xAxis: { type: 'category', data: mockDates, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#1f2937' } },
        yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#1f2937' }, splitLine: { lineStyle: { color: '#f3f4f6' } } },
        series: [{ data: mockPassengers, type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 3, color: 'rgba(87,181,231,1)' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(87,181,231,0.2)' }, { offset: 1, color: 'rgba(87,181,231,0.01)' }] } } }]
      });
      setAirlineOption({
        animation: false,
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [{
          name: 'Passengers',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: airlines.map((name, i) => ({ name, value: Math.floor(Math.random() * 10000) + 10000 }))
        }]
      });
      setDestinationOption({
        animation: false,
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [{
          name: 'Passengers',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: destinations.map((name, i) => ({ name, value: Math.floor(Math.random() * 5000) + 5000 }))
        }]
      });
      setRevenueOption({
        animation: false,
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#e5e7eb', textStyle: { color: '#1f2937' } },
        grid: { top: 10, right: 10, bottom: 20, left: 40 },
        xAxis: { type: 'category', data: mockDates, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#1f2937' } },
          yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#1f2937' }, splitLine: { lineStyle: { color: '#f3f4f6' } } },
        series: [{ data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50000) + 100000), type: 'bar', barWidth: 24, itemStyle: { color: '#1a73e8' } }]
      });
    }
  }, [uploadedData, selectedPeriod]);

  useEffect(() => {
    const fetchPassengerData = async () => {
      try {
        const response = await fetch('/api/passenger_data');
        const data = await response.json();
        if (Array.isArray(data)) {
          setContextTableRows(
            data.map(row => [
              row.timestamp,
              row.airline,
              row.destination,
              row.passengers,
              row.revenue,
              { trend: Math.random() > 0.5 ? 'up' : 'down', value: `${(Math.random() * 20).toFixed(1)}%` },
              row.gender || 'N/A',
              row.age_group || 'N/A',
            ])
          );
          setPassengerData({
            labels: data.map(row => row.timestamp.split('T')[0]),
            values: data.map(row => row.passengers),
            total: data.reduce((sum, row) => sum + (row.passengers || 0), 0),
          });
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    if (contextTableRows.length === 0) {
      fetchPassengerData();
    }
  }, [setContextTableRows, setPassengerData, contextTableRows.length]);

  const filteredRows = tableRows.filter(row => {
    const genderOk = genderFilters[row[6]];
    const ageGroupOk = ageFilters[row[7]];
    let ageOk = true;
    const ageValue = typeof row[7] === 'number' ? row[7] : (row[8] && !isNaN(Number(row[8])) ? Number(row[8]) : null);
    if (ageValue !== null && ageValue !== undefined && ageRange.min !== '' && ageRange.max !== '') {
      ageOk = ageValue >= Number(ageRange.min) && ageValue <= Number(ageRange.max);
    }
    return genderOk && ageGroupOk && ageOk;
  });

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

  function getPassengerChartOption(type) {
    if (!passengerOption.series) return passengerOption;
    const base = { ...passengerOption };
    if (type === 'pie') {
      return {
        ...base,
        xAxis: undefined,
        yAxis: undefined,
        series: [{
          type: 'pie',
          data: base.series[0].data.map((value, i) => ({ value, name: base.xAxis?.data?.[i] || `Item ${i + 1}` })),
          radius: ['40%', '70%'],
          label: { show: false },
        }],
        legend: { top: '5%', left: 'center' },
      };
    } else {
      return {
        ...base,
        series: [{ ...base.series[0], type }],
      };
    }
  }
  function getAirlineChartOption(type) {
    if (!airlineOption.series) return airlineOption;
    const base = { ...airlineOption };
    if (type === 'pie') {
      return base;
    } else {
      const data = base.series[0].data;
      return {
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data.map(d => d.name) },
        yAxis: { type: 'value' },
        series: [{ data: data.map(d => d.value), type, barWidth: 24, itemStyle: { color: '#1a73e8' } }],
        grid: { top: 10, right: 10, bottom: 20, left: 40 },
      };
    }
  }
  function getDestinationChartOption(type) {
    if (!destinationOption.series) return destinationOption;
    const base = { ...destinationOption };
    if (type === 'pie') {
      const data = base.series[0].data;
      return {
        ...base,
        xAxis: undefined,
        yAxis: undefined,
        series: [{
          type: 'pie',
          data: data.map((d, i) => ({ value: d.value, name: d.name })),
          radius: ['40%', '70%'],
          label: { show: false },
        }],
        legend: { top: '5%', left: 'center' },
      };
    } else {
      const data = base.series[0].data;
      return {
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data.map(d => d.name) },
        yAxis: { type: 'value' },
        series: [{ data: data.map(d => d.value), type, barWidth: 24, itemStyle: { color: '#1a73e8' } }],
        grid: { top: 10, right: 10, bottom: 20, left: 40 },
      };
    }
  }
  function getRevenueChartOption(type) {
    if (!revenueOption.series) return revenueOption;
    const base = { ...revenueOption };
    if (type === 'pie') {
      return {
        ...base,
        xAxis: undefined,
        yAxis: undefined,
        series: [{
          type: 'pie',
          data: base.series[0].data.map((value, i) => ({ value, name: base.xAxis?.data?.[i] || `Item ${i + 1}` })),
          radius: ['40%', '70%'],
          label: { show: false },
        }],
        legend: { top: '5%', left: 'center' },
      };
    } else if (type === 'waterfall') {
      const data = base.series[0].data;
      const xLabels = base.xAxis?.data || data.map((_, i) => `Item ${i + 1}`);
      let sum = 0;
      const waterfallData = data.map((v, i) => {
        const prev = sum;
        sum += v;
        return [prev, sum];
      });
      return {
        animation: false,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { type: 'category', data: xLabels },
        yAxis: { type: 'value' },
        series: [{
          type: 'custom',
          renderItem: (params, api) => {
            const y0 = api.coord([api.value(0), 0]);
            const y1 = api.coord([api.value(1), 0]);
            const height = y0[1] - y1[1];
            return {
              type: 'rect',
              shape: {
                x: y0[0] - 15,
                y: y1[1],
                width: 30,
                height: height
              },
              style: api.style()
            };
          },
          data: waterfallData,
          itemStyle: { color: '#1a73e8' }
        }],
        grid: { top: 10, right: 10, bottom: 20, left: 40 },
      };
    } else {
      return {
        ...base,
        series: [{ ...base.series[0], type }],
      };
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-['Inter',sans-serif]">
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
                {(() => {
                  const profileImage = localStorage.getItem('userProfileImage');
                  const avatarInitial = localStorage.getItem('userAvatarInitial');
                  if (profileImage) {
                    return <img src={profileImage} alt="User" className="w-full h-full object-cover" />;
                  } else if (avatarInitial) {
                    return <span className="text-xl font-bold text-primary">{avatarInitial}</span>;
                  } else {
                    return <img src={AppLogo} alt="App Logo" className="w-7 h-7 object-contain" />;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Airport Analytics Dashboard</h2>
          <div className="bg-white rounded-full shadow-sm p-1 inline-flex">
            <button onClick={() => handlePeriodChange('week')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap rounded-button ${selectedPeriod === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Week</button>
            <button onClick={() => handlePeriodChange('month')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap rounded-button ${selectedPeriod === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Month</button>
            <button onClick={() => handlePeriodChange('year')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap rounded-button ${selectedPeriod === 'year' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Year</button>
          </div>
        </div>
        <div className="mb-6 bg-white rounded shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Current Period:</span>
            <span className="font-medium text-gray-800">{currentPeriod}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 whitespace-nowrap rounded-button"><RiArrowLeftSLine className="text-lg" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 whitespace-nowrap rounded-button"><RiArrowRightSLine className="text-lg" /></button>
            <div className="h-6 border-l border-gray-300 mx-1"></div>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap rounded-button">Today</button>
          </div>
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Passenger Traffic Trend</h3>
              <div className="flex items-center gap-2 relative">
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap rounded-button" onClick={() => setOpenMenu(openMenu === 'passenger' ? null : 'passenger')}><RiMore2Fill /></button>
                {openMenu === 'passenger' && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-20">
                    {['line', 'bar', 'pie'].map(type => (
                      <button key={type} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${passengerChartType === type ? 'font-bold text-primary' : ''}`} onClick={() => { setPassengerChartType(type); setOpenMenu(null); }}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ReactECharts option={getPassengerChartOption(passengerChartType)} style={{ height: 256 }} />
          </div>
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Airline Market Share</h3>
              <div className="flex items-center gap-2 relative">
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap rounded-button" onClick={() => setOpenMenu(openMenu === 'airline' ? null : 'airline')}><RiMore2Fill /></button>
                {openMenu === 'airline' && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-20">
                    {['line', 'bar', 'pie'].map(type => (
                      <button key={type} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${airlineChartType === type ? 'font-bold text-primary' : ''}`} onClick={() => { setAirlineChartType(type); setOpenMenu(null); }}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ReactECharts option={getAirlineChartOption(airlineChartType)} style={{ height: 256 }} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Top Destinations</h3>
              <div className="flex items-center gap-2 relative">
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap rounded-button" onClick={() => setOpenMenu(openMenu === 'destination' ? null : 'destination')}><RiMore2Fill /></button>
                {openMenu === 'destination' && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-20">
                    {['bar', 'pie'].map(type => (
                      <button key={type} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${destinationChartType === type ? 'font-bold text-primary' : ''}`} onClick={() => { setDestinationChartType(type); setOpenMenu(null); }}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ReactECharts option={getDestinationChartOption(destinationChartType)} style={{ height: 256 }} />
          </div>
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Revenue Analysis</h3>
              <div className="flex items-center gap-2 relative">
                <button className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded whitespace-nowrap rounded-button" onClick={() => setOpenMenu(openMenu === 'revenue' ? null : 'revenue')}><RiMore2Fill /></button>
                {openMenu === 'revenue' && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-20">
                    {['line', 'bar', 'pie', 'waterfall'].map(type => (
                      <button key={type} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${revenueChartType === type ? 'font-bold text-primary' : ''}`} onClick={() => { setRevenueChartType(type); setOpenMenu(null); }}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {(() => {
              const option = getRevenueChartOption(revenueChartType);
              const hasData = option && option.series && option.series[0] && Array.isArray(option.series[0].data) && option.series[0].data.length > 0 && option.series[0].data.some(v => Array.isArray(v) ? v.some(n => typeof n === 'number' && !isNaN(n)) : typeof v === 'number' && !isNaN(v));
              if (!hasData) {
                return <div className="h-64 flex items-center justify-center text-gray-400">No data available for this chart type.</div>;
              }
              return <ReactECharts option={option} style={{ height: 256 }} />;
            })()}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Detailed Analytics</h3>
              <div className="flex items-center gap-3">
                <div className="relative" ref={filterRef}>
                  <button
                    className="px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 whitespace-nowrap rounded-button"
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
                      {['Child', 'Adult'].map(ageGroup => (
                        <label key={ageGroup} className="flex items-center text-sm mb-1">
                          <input
                            type="checkbox"
                            checked={ageFilters[ageGroup]}
                            onChange={() => setAgeFilters(f => ({ ...f, [ageGroup]: !f[ageGroup] }))}
                            className="mr-2"
                          />
                          {ageGroup}
                        </label>
                      ))}
                      <div className="mt-3 mb-2 text-sm font-semibold text-gray-700">Custom Age Range</div>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={ageRange.min}
                          onChange={e => setAgeRange(r => ({ ...r, min: e.target.value }))}
                          className="w-16 px-2 py-1 border rounded text-sm"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={ageRange.max}
                          onChange={e => setAgeRange(r => ({ ...r, max: e.target.value }))}
                          className="w-16 px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <button
                        className="text-xs text-blue-600 hover:underline mt-1"
                        onClick={() => setAgeRange({ min: '', max: '' })}
                        type="button"
                      >
                        Clear Age Range
                      </button>
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
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap rounded-button">Previous</button>
                <button className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 whitespace-nowrap rounded-button">1</button>
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap rounded-button">2</button>
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap rounded-button">3</button>
                <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 whitespace-nowrap rounded-button">Next</button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* The following three cards are being removed: AI Insights, ML Analysis, Security Status */}
        </div>
      </main>
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
    </div>
  );
};

export default Dashboard; 