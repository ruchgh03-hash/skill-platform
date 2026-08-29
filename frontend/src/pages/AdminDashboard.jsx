import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#d946ef', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Organization-wide analytics and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-primary-600">
                {dashboardData?.overview?.total_users || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Competency</p>
              <p className="text-2xl font-bold text-accent-600">
                {dashboardData?.overview?.average_competency || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Quiz Attempts</p>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData?.overview?.total_quiz_attempts || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Courses Completed</p>
              <p className="text-2xl font-bold text-orange-600">
                {dashboardData?.overview?.courses_completed || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.category_performance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average_level" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData?.skill_distribution?.slice(0, 6) || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ skill, percent }) => `${skill} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(dashboardData?.skill_distribution?.slice(0, 6) || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary-700 mb-2">Skills in Demand</h4>
            <div className="flex flex-wrap gap-2">
              {analytics?.predictive_insights?.skills_in_demand?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-accent-50 rounded-lg">
            <h4 className="font-medium text-accent-700 mb-2">Recommended Focus Areas</h4>
            <div className="flex flex-wrap gap-2">
              {analytics?.predictive_insights?.recommended_focus_areas?.map((area, idx) => (
                <span key={idx} className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700 mb-2">Projected Growth</h4>
            <p className="text-green-600">{analytics?.predictive_insights?.projected_growth}</p>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recent_users?.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{user.department}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
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
