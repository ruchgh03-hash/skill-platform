import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        dashboardAPI.getAdminDashboard(),
        dashboardAPI.getAnalytics()
      ]);
      setDashboardData(dashRes.data);
      setAnalytics(analyticsRes.data);
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
          <p className="text-gray-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];

  const statCards = [
    { title: 'Total Users', value: dashboardData?.overview?.total_users || 0, icon: '👥', color: 'from-blue-500 to-cyan-400', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { title: 'Avg Competency', value: dashboardData?.overview?.average_competency || 0, icon: '📊', color: 'from-purple-500 to-pink-400', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { title: 'Quiz Attempts', value: dashboardData?.overview?.total_quiz_attempts || 0, icon: '📝', color: 'from-green-500 to-emerald-400', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { title: 'Courses Completed', value: dashboardData?.overview?.courses_completed || 0, icon: '🎓', color: 'from-orange-500 to-amber-400', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard ⚙️</h1>
        <p className="text-white/80">Organization-wide analytics and insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-static">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.category_performance || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="average_level" fill="url(#colorGradientAdmin)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradientAdmin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-static">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData?.skill_distribution?.slice(0, 6) || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="count"
              >
                {(dashboardData?.skill_distribution?.slice(0, 6) || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {(dashboardData?.skill_distribution?.slice(0, 6) || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-xs text-gray-600">{item.skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="card-static">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Predictive Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-3">🔥 Skills in Demand</h4>
            <div className="flex flex-wrap gap-2">
              {analytics?.predictive_insights?.skills_in_demand?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <h4 className="font-bold text-purple-900 mb-3">🎯 Focus Areas</h4>
            <div className="flex flex-wrap gap-2">
              {analytics?.predictive_insights?.recommended_focus_areas?.map((area, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <h4 className="font-bold text-green-900 mb-3">📈 Projected Growth</h4>
            <p className="text-green-700 font-medium">{analytics?.predictive_insights?.projected_growth}</p>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card-static">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Joined</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recent_users?.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{user.name?.charAt(0)}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{user.department}</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(user.joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
