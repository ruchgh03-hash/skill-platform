import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('token', res.data.access_token);
      
      const userRes = await authAPI.getMe();
      onLogin(userRes.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-lg">SP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SkillBridge</h1>
              <p className="text-[10px] text-primary-600 font-medium">SIH PS 26101 | MoSPI</p>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to continue your learning journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
              <span className="text-xl">⚠️</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="input-label mb-0">Password</label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">New to SkillBridge?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link to="/register" className="btn-outline w-full py-3 text-center block">
            Create an Account
          </Link>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg-animated relative overflow-hidden items-center justify-center">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center text-white p-12">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
            <span className="text-6xl">🎯</span>
          </div>
          <h3 className="text-3xl font-bold mb-4">Skill Intelligence Platform</h3>
          <p className="text-white/80 text-lg max-w-md">
            AI-powered competency assessment and personalized learning for India's Official Statistical System
          </p>
          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-white/60 text-sm">Officials</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">43+</p>
              <p className="text-white/60 text-sm">Skills</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">4</p>
              <p className="text-white/60 text-sm">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
