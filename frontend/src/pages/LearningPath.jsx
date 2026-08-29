import React, { useState, useEffect } from 'react';
import { recommendationAPI } from '../services/api';

function LearningPath() {
  const [learningPath, setLearningPath] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const [pathRes, activeRes] = await Promise.all([
        recommendationAPI.getActivePath(),
        recommendationAPI.getLearningPath().catch(() => null)
      ]);
      
      if (activeRes.data?.path) {
        setActivePath(activeRes.data.path);
      }
      
      if (activeRes.data) {
        setLearningPath(activeRes.data);
      }
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Path</h1>
          <p className="text-gray-500">Personalized course recommendations based on your skill gaps</p>
        </div>
        <button
          onClick={generateNewPath}
          disabled={generating}
          className="btn-primary"
        >
          {generating ? 'Generating...' : 'Generate New Path'}
        </button>
      </div>

      {learningPath ? (
        <>
          {/* Path Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stat-card">
              <p className="text-sm text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold text-primary-600">
                {learningPath.total_courses || learningPath.recommended_courses?.length || 0}
              </p>
            </div>
            
            <div className="stat-card">
              <p className="text-sm text-gray-500">Estimated Duration</p>
              <p className="text-2xl font-bold text-accent-600">
                {learningPath.estimated_duration_hours || 0} hours
              </p>
            </div>
            
            <div className="stat-card">
              <p className="text-sm text-gray-500">Completion Days</p>
              <p className="text-2xl font-bold text-green-600">
                {learningPath.estimated_completion_days || 0} days
              </p>
            </div>
            
            <div className="stat-card">
              <p className="text-sm text-gray-500">Skill Gaps</p>
              <p className="text-2xl font-bold text-orange-600">
                {learningPath.skill_gaps?.length || 0}
              </p>
            </div>
          </div>

          {/* Skill Gaps */}
          {learningPath.skill_gaps?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Identified Skill Gaps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningPath.skill_gaps.slice(0, 9).map((gap, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{gap.skill}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        gap.priority === 'high' ? 'bg-red-100 text-red-700' :
                        gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Current: {gap.current_level}</span>
                      <span>→</span>
                      <span>Target: {gap.target_level}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(gap.current_level / gap.target_level) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Milestones */}
          {learningPath.learning_milestones?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Milestones</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {learningPath.learning_milestones.map((milestone, idx) => (
                    <div key={idx} className="relative pl-12">
                      <div className="absolute left-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{milestone.course}</span>
                          <span className="text-sm text-gray-500">{milestone.estimated_completion}</span>
                        </div>
                        <p className="text-sm text-gray-600">{milestone.checkpoint}</p>
                        {milestone.skills_to_gain?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {milestone.skills_to_gain.map((skill, sIdx) => (
                              <span key={sIdx} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                                {skill}
                              </span>
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

          {/* Recommended Courses */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(learningPath.recommended_courses || []).map((course, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {course.difficulty}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>⏱️ {course.duration} min</span>
                    <span>📊 Score: {(course.relevance_score * 100).toFixed(0)}%</span>
                  </div>
                  
                  {course.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.skills.slice(0, 3).map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {course.matched_skills?.length > 0 && (
                    <div className="text-xs text-primary-600">
                      Matches: {course.matched_skills.join(', ')}
                    </div>
                  )}
                  
                  <a 
                    href={course.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-center py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    View on iGOT
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <span className="text-6xl mb-4 block">🗺️</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Learning Path Yet</h3>
          <p className="text-gray-500 mb-6">
            Take the competency assessment first to generate your personalized learning path
          </p>
          <div className="flex justify-center gap-4">
            <a href="/competency" className="btn-primary">
              Take Assessment
            </a>
            <button onClick={generateNewPath} className="btn-secondary">
              Generate Path
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningPath;
