import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    designation: '',
    department: '',
    job_role: '',
    years_of_experience: 0,
    educational_qualifications: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-lg animate-fade-in-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Join 50,000+ officials in AI-powered learning</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <span className="text-sm font-medium hidden sm:inline">Account</span>
            </div>
            <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
              <span className="text-sm font-medium hidden sm:inline">Profile</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
              <span className="text-xl">⚠️</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in-up">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., Under Secretary"
                    />
                  </div>
                  <div>
                    <label className="input-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., MoSPI"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Job Role</label>
                    <input
                      type="text"
                      name="job_role"
                      value={formData.job_role}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., Statistician"
                    />
                  </div>
                  <div>
                    <label className="input-label">Years of Experience</label>
                    <input
                      type="number"
                      name="years_of_experience"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                      className="input-field"
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Educational Qualifications</label>
                  <input
                    type="text"
                    name="educational_qualifications"
                    value={formData.educational_qualifications}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., M.Sc. Statistics"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary py-3.5"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 py-3.5 text-base"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg-animated relative overflow-hidden items-center justify-center">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center text-white p-12">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
            <span className="text-6xl">🚀</span>
          </div>
          <h3 className="text-3xl font-bold mb-4">Start Your Journey</h3>
          <p className="text-white/80 text-lg max-w-md">
            Personalized learning paths, AI-powered assessments, and seamless integration with iGOT Karmayogi
          </p>
          <div className="grid grid-cols-3 gap-6 mt-10">
            <div className="glass-card rounded-xl p-4">
              <span className="text-3xl block mb-2">📊</span>
              <p className="text-sm font-medium">Analytics</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <span className="text-3xl block mb-2">🎯</span>
              <p className="text-sm font-medium">Assessment</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <span className="text-3xl block mb-2">📚</span>
              <p className="text-sm font-medium">Learning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
