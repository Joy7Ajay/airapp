import React, { useState } from 'react';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import FileUpload from './components/FileUpload';

export default function App() {
  const [page, setPage] = useState('welcome'); // 'welcome', 'login', 'signup', 'dashboard', 'fileupload'

  // Handler for moving between pages
  const goTo = (nextPage) => setPage(nextPage);

  if (page === 'welcome') {
    return <Welcome onGetStarted={() => goTo('login')} />;
  }
  if (page === 'login') {
    return <Login onSignup={() => goTo('signup')} onLogin={() => goTo('dashboard')} />;
  }
  if (page === 'signup') {
    return <Signup onLogin={() => goTo('login')} onSignupComplete={() => goTo('dashboard')} />;
  }
  if (page === 'fileupload') {
    return <div><FileUpload /><button className="mt-4 bg-gray-200 px-4 py-2 rounded" onClick={() => goTo('dashboard')}>Back to Dashboard</button></div>;
  }
  if (page === 'dashboard') {
    return <Dashboard goToFileUpload={() => goTo('fileupload')} />;
  }
  return null;
}
