import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const themes = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

const Settings = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Settings</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Theme</h3>
        <div className="flex gap-6">
          {themes.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="theme"
                value={opt.value}
                checked={theme === opt.value}
                onChange={() => setTheme(opt.value)}
                className="form-radio text-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">User Preferences</h3>
        <div className="text-gray-600 dark:text-gray-400 text-sm">(Coming soon: default dashboard view, language, etc.)</div>
      </div>
      <div className="mb-6">
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default Settings; 