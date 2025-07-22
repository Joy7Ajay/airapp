import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);

  React.useEffect(() => {
    let timer;
    if (lockout) {
      timer = setTimeout(() => setLockout(false), 30000); // 30s lockout
    }
    return () => clearTimeout(timer);
  }, [lockout]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (lockout) {
      setError('Too many failed attempts. Please wait 30 seconds.');
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      setSuccess('Login successful! Redirecting...');
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ email }));
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      let apiError = err?.response?.data?.message || err.message || 'Invalid credentials. Please try again.';
      setError(apiError);
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= 5) setLockout(true);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 no-scrollbar" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f9fa', overflowX: 'hidden' }}>
      <div className="min-h-screen flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="airplane-animation absolute">
            <i className="ri-flight-takeoff-line text-primary/20 ri-3x"></i>
          </div>
          <div className="airplane-animation-2 absolute">
            <i className="ri-flight-land-line text-primary/20 ri-3x"></i>
          </div>
        </div>
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to <span className="font-['Pacifico'] text-primary">AeroAnalytics</span></h1>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </div>
          {/* Feature cards */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-primary">
                <i className="ri-line-chart-line ri-lg"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Smart Insights</h3>
                <p className="text-sm text-gray-600">AI-powered trend analysis and predictions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-primary">
                <i className="ri-shield-check-line ri-lg"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Enterprise Security</h3>
                <p className="text-sm text-gray-600">Advanced encryption and data protection</p>
              </div>
            </div>
          </div>
          {/* Error/Success Message */}
          <div aria-live="polite" className="min-h-[24px] mb-2">
            {error && <div className="text-red-600 text-sm mb-2" role="alert">{error}</div>}
            {success && <div className="text-green-600 text-sm mb-2" role="status">{success}</div>}
          </div>
          {/* Login Form */}
          <form className="space-y-4 mb-8" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter your email" required aria-required="true" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter your password" required aria-required="true" minLength={6} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary" />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-primary/80">Forgot password?</a>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors rounded-button disabled:opacity-60" disabled={loading || lockout} aria-disabled={loading || lockout}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          {/* Social Auth Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button type="button" className="flex justify-center items-center py-2 px-4 border rounded-lg hover:bg-gray-50 rounded-button" aria-label="Sign in with Google">
              <i className="ri-google-fill text-[#EA4335] text-xl"></i>
            </button>
            <button type="button" className="flex justify-center items-center py-2 px-4 border rounded-lg hover:bg-gray-50 rounded-button" aria-label="Sign in with Apple">
              <i className="ri-apple-fill text-[#000000] text-xl"></i>
            </button>
            <button type="button" className="flex justify-center items-center py-2 px-4 border rounded-lg hover:bg-gray-50 rounded-button" aria-label="Sign in with Microsoft">
              <i className="ri-microsoft-fill text-[#00A4EF] text-xl"></i>
            </button>
          </div>
          {/* Switch to signup */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button type="button" className="text-primary hover:text-primary/80 font-medium" onClick={() => navigate('/signup')}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 