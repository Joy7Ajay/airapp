import React, { useState } from 'react';

// Mock data (replace with real data/API integration later)
const mockUser = {
  avatarUrl: '', // Could use a default image or initials
  name: 'Alex Johnson',
  role: 'Airport Operations Analyst',
  organization: 'SkyView Analytics',
  joinDate: '2022-03-15',
  lastActive: '2024-06-10',
  email: 'alex.johnson@skyview.com',
  phone: '+1 555-123-4567',
  timeZone: 'America/New_York',
  units: 'Metric',
  plan: 'Pro',
  homeAirport: 'JFK',
  preferredViews: ['Traffic', 'Weather', 'Delays'],
  notifications: {
    flightDisruptions: true,
    runwayClosures: false,
  },
  recentActivity: [
    { type: 'Report', label: 'JFK Traffic Report', date: '2024-06-09' },
    { type: 'Dashboard', label: 'Custom Delay Dashboard', date: '2024-06-08' },
    { type: 'Bookmark', label: 'LAX Airport', date: '2024-06-07' },
    { type: 'Alert', label: 'Runway Closure at ORD', date: '2024-06-06' },
    { type: 'Export', label: 'EWR Weather Report (PDF)', date: '2024-06-05' },
  ],
  savedAnalyses: [
    { id: 1, title: 'JFK Traffic Trends', type: 'Graph' },
    { id: 2, title: 'LAX Runway Utilization', type: 'Map' },
    { id: 3, title: 'ORD Delay Heatmap', type: 'Heatmap' },
  ],
  quickStats: {
    airportsAnalyzed: 12,
    alertsGenerated: 5,
    reportsDownloaded: 8,
    peakAnalysisTime: 'Wed 14:00',
  },
};

const Profile = () => {
  const [user, setUser] = useState(mockUser);

  // Section: Header
  const Header = () => (
    <div className="flex items-center gap-6 mb-6">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-blue-600">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          user.name.split(' ').map(n => n[0]).join('')
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <div className="text-gray-600">{user.role} @ {user.organization}</div>
        <div className="text-sm text-gray-400">Joined: {user.joinDate} | Last active: {user.lastActive}</div>
      </div>
    </div>
  );

  // Section: Contact & Account Info
  const ContactInfo = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Contact & Account Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>Email: <span className="font-mono">{user.email}</span> <button className="ml-2 text-blue-500 underline text-xs">Edit</button></div>
        <div>Phone: {user.phone || <span className="text-gray-400">(not set)</span>}</div>
        <div>Time Zone: {user.timeZone}</div>
        <div>Preferred Units: {user.units}</div>
        <div>Subscription Plan: <span className="font-semibold">{user.plan}</span></div>
      </div>
    </div>
  );

  // Section: User Preferences
  const Preferences = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">User Preferences</h2>
      <div>Home Airport: {user.homeAirport}</div>
      <div>Preferred Data Views: {user.preferredViews.join(', ')}</div>
      <div>Notifications: 
        <span className="ml-2">Flight Disruptions: {user.notifications.flightDisruptions ? 'On' : 'Off'}</span>,
        <span className="ml-2">Runway Closures: {user.notifications.runwayClosures ? 'On' : 'Off'}</span>
      </div>
    </div>
  );

  // Section: Recent Activity
  const RecentActivity = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
      <ul className="list-disc ml-6">
        {user.recentActivity.map((item, idx) => (
          <li key={idx} className="mb-1">
            <span className="font-semibold">{item.type}:</span> {item.label} <span className="text-gray-400 text-xs">({item.date})</span>
          </li>
        ))}
      </ul>
    </div>
  );

  // Section: Saved Analyses / Dashboards
  const SavedAnalyses = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Saved Analyses / Dashboards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.savedAnalyses.map(analysis => (
          <div key={analysis.id} className="p-3 bg-white rounded border flex flex-col gap-2">
            <div className="font-semibold">{analysis.title}</div>
            <div className="text-xs text-gray-500">Type: {analysis.type}</div>
            <div className="flex gap-2 mt-2">
              <button className="text-blue-500 text-xs underline">Edit</button>
              <button className="text-green-500 text-xs underline">Duplicate</button>
              <button className="text-purple-500 text-xs underline">Share</button>
              <button className="text-red-500 text-xs underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Section: Quick Stats Widget
  const QuickStats = () => (
    <div className="mb-6 p-4 bg-blue-50 rounded shadow flex gap-8 items-center">
      <div>
        <div className="text-2xl font-bold">{user.quickStats.airportsAnalyzed}</div>
        <div className="text-xs text-gray-600">Airports analyzed this month</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{user.quickStats.alertsGenerated}</div>
        <div className="text-xs text-gray-600">Alerts generated</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{user.quickStats.reportsDownloaded}</div>
        <div className="text-xs text-gray-600">Reports downloaded</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{user.quickStats.peakAnalysisTime}</div>
        <div className="text-xs text-gray-600">Peak analysis time</div>
      </div>
    </div>
  );

  // Section: Account Management
  const AccountManagement = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Account Management</h2>
      <div className="flex flex-wrap gap-4">
        <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit Profile</button>
        <button className="bg-gray-500 text-white px-3 py-1 rounded">Change Password</button>
        <button className="bg-yellow-500 text-white px-3 py-1 rounded">Billing & Usage</button>
        <button className="bg-green-500 text-white px-3 py-1 rounded">Download Usage Logs</button>
        <button className="bg-purple-500 text-white px-3 py-1 rounded">API Token</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Header />
      <QuickStats />
      <ContactInfo />
      <Preferences />
      <RecentActivity />
      <SavedAnalyses />
      <AccountManagement />
    </div>
  );
};

export default Profile; 