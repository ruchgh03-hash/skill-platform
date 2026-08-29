import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from './services/api';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LearnerDashboard from './pages/LearnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CompetencyAssessment from './pages/CompetencyAssessment';
import QuizBuilder from './pages/QuizBuilder';
import LearningPath from './pages/LearningPath';
import IGOTCourses from './pages/IGOTCourses';

// Layout Component
function Layout({ children, user, onLogout }) {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/competency', label: 'Competency Assessment', icon: '🎯' },
    { path: '/quiz', label: 'Quiz Builder', icon: '📝' },
    { path: '/learning-path', label: 'Learning Path', icon: '🗺️' },
    { path: '/igot-courses', label: 'iGOT Courses', icon: '📚' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin Dashboard', icon: '⚙️' });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-700">Skill Platform</h1>
          <p className="text-xs text-gray-500 mt-1">SIH PS 26101</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-medium">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.designation}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Home Redirect
function HomeRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
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

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
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
