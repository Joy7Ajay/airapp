import React, { useState } from 'react';
import { login, signup } from '../api';

const Auth = ({ mode = 'login', onSignup, onLogin, onSignupComplete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      if (onLogin) onLogin();
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await signup({ email, password, firstName, lastName });
      if (onSignupComplete) onSignupComplete();
    } catch (err) {
      setError('Could not create account. Please try again.');
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
            <p className="text-gray-600">{mode === 'signup' ? 'Create your account' : 'Sign in to continue to your dashboard'}</p>
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

          {/* Auth Forms */}
          {mode !== 'signup' ? (
            // Login Form
            <form className="space-y-4 mb-8" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter your password" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(v => !v)}>
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
              <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors !rounded-button">Sign In</button>
            </form>
          ) : (
            // Signup Form
            <form className="space-y-4 mb-8" onSubmit={handleSignup}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" id="firstName" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter first name" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter last name" />
                </div>
              </div>
              <div>
                <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="signupEmail" name="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showSignupPassword ? 'text' : 'password'} id="signupPassword" name="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Create a password" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowSignupPassword(v => !v)}>
                    <i className={showSignupPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Confirm your password" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(v => !v)}>
                    <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                  </button>
                </div>
              </div>
              <div className="flex items-start">
                <input type="checkbox" id="terms" name="terms" className="mt-1 w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary" />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                </label>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors !rounded-button">Create Account</button>
            </form>
          )}

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
            <button type="button" className="flex justify-center items-center py-2 px-4 border rounded-lg hover:bg-gray-50 !rounded-button">
              <i className="ri-google-fill text-[#EA4335] text-xl"></i>
            </button>
            <button type="button" className="flex justify-center items-center py-2 px-4 border rounded-lg hover:bg-gray-50 !rounded-button">
              <i className="ri-apple-fill text-[#000000] text-xl"></i>
            </button>
            <button type="button" className="flex justify-center items-center py-2 px-4 border rounded-lg hover:bg-gray-50 !rounded-button">
              <i className="ri-microsoft-fill text-[#00A4EF] text-xl"></i>
            </button>
          </div>

          {/* Switch between login/signup */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button type="button" className="text-primary hover:text-primary/80 font-medium" onClick={onLogin}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button type="button" className="text-primary hover:text-primary/80 font-medium" onClick={onSignup}>
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth; 