import React, { useState, useEffect } from 'react';
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#d946ef', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name}!</h1>
        <p className="text-gray-500">{user?.designation} • {user?.department}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Score</p>
              <p className="text-2xl font-bold text-primary-600">
                {dashboardData?.competency_summary?.overall_score || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Skills Assessed</p>
              <p className="text-2xl font-bold text-accent-600">
                {dashboardData?.competency_summary?.skills_assessed || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Quiz Average</p>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData?.quiz_performance?.average_score || 0}%
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
              <p className="text-sm text-gray-500">Courses Enrolled</p>
              <p className="text-2xl font-bold text-orange-600">
                {dashboardData?.learning_progress?.courses_enrolled || 0}
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
        {/* Top Skills */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.competency_summary?.top_skills || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="level" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Improvement Areas */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
          {dashboardData?.competency_summary?.improvement_areas?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.competency_summary.improvement_areas.map((area, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{area.skill}</span>
                  <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                    Gap: {area.gap.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Take assessment to see improvement areas</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quiz Attempts</h3>
        {dashboardData?.quiz_performance?.recent_attempts?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Quiz ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.quiz_performance.recent_attempts.map((attempt, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4">Quiz #{attempt.quiz_id}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        attempt.score >= 70 ? 'bg-green-100 text-green-700' :
                        attempt.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {attempt.score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(attempt.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No quiz attempts yet</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/competency" className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Take Assessment</h4>
              <p className="text-sm text-gray-500">Evaluate your skills</p>
            </div>
          </div>
        </a>

        <a href="/quiz" className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Generate Quiz</h4>
              <p className="text-sm text-gray-500">Practice with AI quizzes</p>
            </div>
          </div>
        </a>

        <a href="/learning-path" className="card hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">View Learning Path</h4>
              <p className="text-sm text-gray-500">See recommended courses</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default LearnerDashboard;
