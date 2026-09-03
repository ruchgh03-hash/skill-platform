import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from './services/api';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LearnerDashboard from './pages/LearnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CompetencyAssessment from './pages/CompetencyAssessment';
import QuizBuilder from './pages/QuizBuilder';
import LearningPath from './pages/LearningPath';
import IGOTCourses from './pages/IGOTCourses';

function Layout({ user, onLogout }) {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', color: 'from-blue-500 to-cyan-400' },
    { path: '/competency', label: 'Assessment', icon: '🎯', color: 'from-purple-500 to-pink-400' },
    { path: '/quiz', label: 'Quiz Builder', icon: '📝', color: 'from-green-500 to-emerald-400' },
    { path: '/learning-path', label: 'Learning Path', icon: '🗺️', color: 'from-orange-500 to-amber-400' },
    { path: '/igot-courses', label: 'iGOT Courses', icon: '📚', color: 'from-pink-500 to-rose-400' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: '⚙️', color: 'from-red-500 to-orange-400' });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-100 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
              <span className="text-white font-bold text-lg">SP</span>
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-bold text-gray-900">SkillBridge</h1>
                <p className="text-[10px] text-primary-600 font-medium">SIH PS 26101</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/25' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20' : `bg-gradient-to-r ${item.color}`}`}>
                  <span className="text-sm">{item.icon}</span>
                </div>
                {sidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{user?.full_name?.charAt(0) || 'U'}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.designation}</p>
              </div>
            )}
          </div>
          <button onClick={onLogout} className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function HomeRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);
  return <LandingPage />;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30 animate-pulse">
            <span className="text-white font-bold text-2xl">SP</span>
          </div>
          <p className="text-gray-500 font-medium">Loading SkillBridge...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        {user && (
          <Route element={<Layout user={user} onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<LearnerDashboard user={user} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/competency" element={<CompetencyAssessment />} />
            <Route path="/quiz" element={<QuizBuilder />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/igot-courses" element={<IGOTCourses />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
