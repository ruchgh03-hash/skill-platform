import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationAPI } from '../services/api';

function LearningPath() {
  const [learningPath, setLearningPath] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchPaths(); }, []);

  const fetchPaths = async () => {
    try {
      const [pathRes, activeRes] = await Promise.all([
        recommendationAPI.getActivePath(),
        recommendationAPI.getLearningPath().catch(() => null)
      ]);
      if (activeRes.data?.path) setActivePath(activeRes.data.path);
      if (activeRes.data) setLearningPath(activeRes.data);
    } catch (err) {
      console.error('Failed to fetch paths:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPath = async () => {
    setGenerating(true);
    try {
      const res = await recommendationAPI.getLearningPath();
      setLearningPath(res.data);
      setActivePath(res.data);
    } catch (err) {
      console.error('Failed to generate path:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading learning path...</p>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Learning Path 🗺️</h1>
          <p className="text-white/80">Personalized course recommendations based on your skill gaps</p>
        </div>
        <div className="card-static text-center py-16">
          <span className="text-7xl block mb-4">🗺️</span>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Learning Path Yet</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Take the competency assessment first to generate your personalized learning path</p>
          <div className="flex justify-center gap-4">
            <Link to="/competency" className="btn-primary py-3 px-8">Take Assessment</Link>
            <button onClick={generateNewPath} disabled={generating} className="btn-secondary py-3 px-8">{generating ? 'Generating...' : 'Generate Path'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Learning Path 🗺️</h1>
          <p className="text-white/80">Personalized course recommendations based on your skill gaps</p>
        </div>
        <button onClick={generateNewPath} disabled={generating} className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-colors">
          {generating ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Courses', value: learningPath.total_courses || learningPath.recommended_courses?.length || 0, icon: '📚', color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Duration', value: `${learningPath.estimated_duration_hours || 0}h`, icon: '⏱️', color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: 'Completion', value: `${learningPath.estimated_completion_days || 0}d`, icon: '📅', color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Skill Gaps', value: learningPath.skill_gaps?.length || 0, icon: '🎯', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-2xl p-5 text-center`}>
            <span className="text-3xl block mb-2">{stat.icon}</span>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {learningPath.skill_gaps?.length > 0 && (
        <div className="card-static">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Identified Skill Gaps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningPath.skill_gaps.slice(0, 9).map((gap, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{gap.skill}</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${gap.priority === 'high' ? 'bg-red-100 text-red-700' : gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{gap.priority}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{gap.current_level}</span><span>→</span><span>{gap.target_level}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-400 to-purple-500 rounded-full" style={{ width: `${(gap.current_level / gap.target_level) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {learningPath.learning_milestones?.length > 0 && (
        <div className="card-static">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Milestones</h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-purple-400"></div>
            <div className="space-y-6">
              {learningPath.learning_milestones.map((milestone, idx) => (
                <div key={idx} className="relative pl-14">
                  <div className="absolute left-3 w-6 h-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{milestone.course}</span>
                      <span className="text-sm text-gray-400">{milestone.estimated_completion}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{milestone.checkpoint}</p>
                    {milestone.skills_to_gain?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {milestone.skills_to_gain.map((skill, sIdx) => (
                          <span key={sIdx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card-static">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recommended Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(learningPath.recommended_courses || []).map((course, idx) => (
            <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold">{course.category}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{course.difficulty}</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{course.title}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>⏱️ {course.duration} min</span>
                <span>📊 {(course.relevance_score * 100).toFixed(0)}%</span>
              </div>
              {course.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.skills.slice(0, 3).map((skill, sIdx) => (
                    <span key={sIdx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>
                  ))}
                </div>
              )}
              <a href={course.url || '#'} target="_blank" rel="noopener noreferrer" className="block text-center py-2.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-xl hover:from-primary-600 hover:to-purple-600 transition-all text-sm font-semibold">
                View on iGOT →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LearningPath;
