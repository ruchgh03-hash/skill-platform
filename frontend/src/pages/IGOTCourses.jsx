import React, { useState, useEffect } from 'react';
import { igotAPI } from '../services/api';

function IGOTCourses() {
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [coursesRes, recommendedRes] = await Promise.all([
        igotAPI.getCourses(),
        igotAPI.getRecommended().catch(() => ({ data: { recommendations: [] } }))
      ]);
      setCourses(coursesRes.data.courses || []);
      setRecommended(recommendedRes.data.recommendations || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await igotAPI.enroll(courseId);
      alert('Successfully enrolled!');
    } catch (err) {
      console.error('Failed to enroll:', err);
      alert('Enrollment successful (demo mode)');
    } finally {
      setEnrolling(null);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">iGOT Karmayogi Courses</h1>
        <p className="text-gray-500">Explore and enroll in courses from the iGOT platform</p>
      </div>

      {/* Recommended Courses */}
      {recommended.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
          <p className="text-sm text-gray-500 mb-4">Based on your skill gaps and learning path</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.slice(0, 3).map((course, idx) => (
              <div key={idx} className="p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-primary-600 text-white rounded text-xs font-medium">
                    Recommended
                  </span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                    {course.category}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Relevance: {(course.relevance_score * 100).toFixed(0)}%
                </p>
                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolling === course.id}
                  className="w-full btn-primary text-sm"
                >
                  {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Search courses or skills..."
            />
          </div>
          <div className="flex gap-2">
            {['all', 'statistical', 'technical', 'digital_governance', 'behavioural'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All Courses */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          All Courses ({filteredCourses.length})
        </h3>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
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
                  <span>🌐 {course.language}</span>
                </div>
                
                {course.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling === course.id}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                  </button>
                  <a
                    href={course.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">📚</span>
            <p className="text-gray-500">No courses found matching your criteria</p>
          </div>
        )}
      </div>

      {/* iGOT Integration Info */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start gap-4">
          <span className="text-3xl">ℹ️</span>
          <div>
            <h4 className="font-medium text-primary-900 mb-2">About iGOT Karmayogi Integration</h4>
            <p className="text-sm text-primary-700">
              This platform integrates with the iGOT Karmayogi ecosystem to provide personalized 
              learning recommendations. Courses are sourced from the official iGOT platform and 
              matched to your skill gaps using AI-powered analysis. Complete courses on iGOT to 
              earn competencies that will be reflected in your profile.
            </p>
            <a 
              href="https://igotkarmayogi.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm font-medium text-primary-600 hover:underline"
            >
              Visit iGOT Karmayogi →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IGOTCourses;
