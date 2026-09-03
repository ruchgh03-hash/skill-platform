import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function LearnerDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardAPI.getLearnerDashboard();
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  const statCards = [
    { 
      title: 'Overall Score', 
      value: dashboardData?.competency_summary?.overall_score || 0, 
      icon: '🎯', 
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Skills Assessed', 
      value: dashboardData?.competency_summary?.skills_assessed || 0, 
      icon: '📚', 
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      title: 'Quiz Average', 
      value: `${dashboardData?.quiz_performance?.average_score || 0}%`, 
      icon: '📝', 
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      title: 'Courses Enrolled', 
      value: dashboardData?.learning_progress?.courses_enrolled || 0, 
      icon: '🎓', 
      color: 'from-orange-500 to-amber-400',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.full_name?.split(' ')[0]}! 👋</h1>
            <p className="text-white/80">{user?.designation} • {user?.department}</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/competency" className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
              Take Assessment
            </Link>
            <Link to="/quiz" className="bg-white text-primary-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
              Start Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills Chart */}
        <div className="card-static">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Skills</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Last 30 days</span>
          </div>
          {dashboardData?.competency_summary?.top_skills?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboardData.competency_summary.top_skills} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skill" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="level" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <span className="text-5xl mb-3">📊</span>
              <p>No skills data yet. Take an assessment to see your skills.</p>
            </div>
          )}
        </div>

        {/* Improvement Areas */}
        <div className="card-static">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Areas for Improvement</h3>
            <Link to="/competency" className="text-sm text-primary-600 font-medium hover:text-primary-700">View All →</Link>
          </div>
          {dashboardData?.competency_summary?.improvement_areas?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.competency_summary.improvement_areas.map((area, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{area.skill}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full" 
                          style={{ width: `${Math.min(100, (1 - area.gap / 5) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-red-600">Gap: {area.gap.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <span className="text-5xl mb-3">✅</span>
              <p>No significant gaps identified. Great job!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quiz Attempts */}
        <div className="lg:col-span-2 card-static">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Quiz Attempts</h3>
            <Link to="/quiz" className="text-sm text-primary-600 font-medium hover:text-primary-700">Take New Quiz →</Link>
          </div>
          {dashboardData?.quiz_performance?.recent_attempts?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.quiz_performance.recent_attempts.map((attempt, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                    attempt.score >= 70 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                    attempt.score >= 50 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                    'bg-gradient-to-br from-red-400 to-pink-500'
                  }`}>
                    {attempt.score}%
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Quiz #{attempt.quiz_id}</p>
                    <p className="text-sm text-gray-500">{new Date(attempt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    attempt.score >= 70 ? 'bg-green-100 text-green-700' :
                    attempt.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {attempt.score >= 70 ? 'Passed' : attempt.score >= 50 ? 'Average' : 'Needs Work'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <p>No quiz attempts yet. Start your first quiz!</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-static">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/competency" className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Take Assessment</h4>
                <p className="text-xs text-gray-500">Evaluate your skills</p>
              </div>
            </Link>

            <Link to="/quiz" className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Generate Quiz</h4>
                <p className="text-xs text-gray-500">Practice with AI quizzes</p>
              </div>
            </Link>

            <Link to="/learning-path" className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🗺️</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Learning Path</h4>
                <p className="text-xs text-gray-500">View recommended courses</p>
              </div>
            </Link>

            <Link to="/igot-courses" className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">iGOT Courses</h4>
                <p className="text-xs text-gray-500">Browse available courses</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnerDashboard;
