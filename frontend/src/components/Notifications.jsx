import React, { useState, useRef, useEffect } from 'react';
import { RiNotification3Line } from 'react-icons/ri';

const demoNotifications = [
  { id: 1, type: 'report', message: 'Report is ready!', read: false },
  { id: 2, type: 'login', message: 'Login attempt successful.', read: false },
  { id: 3, type: 'import', message: 'Data import completed.', read: false },
  { id: 4, type: 'anomaly', message: 'Anomaly detected in analytics.', read: false },
  { id: 5, type: 'maintenance', message: 'Scheduled maintenance tomorrow.', read: false },
  { id: 6, type: 'support', message: 'New message from support.', read: false },
  { id: 7, type: 'password', message: 'Password changed successfully.', read: false },
];

const toastColors = {
  report: 'bg-blue-600',
  login: 'bg-green-600',
  import: 'bg-indigo-600',
  anomaly: 'bg-red-600',
  maintenance: 'bg-amber-600',
  support: 'bg-purple-600',
  password: 'bg-green-600',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeout = useRef();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Show toast when a new notification is triggered
  const triggerNotification = (type) => {
    const demo = demoNotifications.find(n => n.type === type);
    if (demo) {
      setNotifications(prev => [{ ...demo, id: Date.now(), read: false }, ...prev]);
      setToast({ ...demo, id: Date.now() });
    }
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToast(null), 3500);
    }
    return () => clearTimeout(toastTimeout.current);
  }, [toast]);

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button className="relative" onClick={() => setShowDropdown(v => !v)} aria-label="Notifications">
        <RiNotification3Line className="text-2xl text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">{unreadCount}</span>
        )}
      </button>
      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-30">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold text-gray-700">Notifications</span>
            <button className="text-xs text-primary hover:underline" onClick={markAllAsRead}>Mark all as read</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && <div className="p-4 text-gray-500 text-sm">No notifications</div>}
            {notifications.map(n => (
              <div key={n.id} className={`px-4 py-3 border-b last:border-b-0 flex items-center gap-2 ${n.read ? 'bg-gray-50' : 'bg-white'}`}>
                <span className={`inline-block w-2 h-2 rounded-full ${toastColors[n.type]}`}></span>
                <span className="text-sm text-gray-800">{n.message}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-2 border-t bg-gray-50">
            {/* Demo triggers */}
            <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded" onClick={() => triggerNotification('report')}>Report Ready</button>
            <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded" onClick={() => triggerNotification('login')}>Login</button>
            <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded" onClick={() => triggerNotification('import')}>Import</button>
            <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded" onClick={() => triggerNotification('anomaly')}>Anomaly</button>
            <button className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded" onClick={() => triggerNotification('maintenance')}>Maintenance</button>
            <button className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded" onClick={() => triggerNotification('support')}>Support</button>
            <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded" onClick={() => triggerNotification('password')}>Password</button>
          </div>
        </div>
      )}
      {/* Toast Popup */}
      {toast && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-medium text-center ${toastColors[toast.type]}`}
             style={{ minWidth: 240 }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Notifications; 