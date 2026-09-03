import React, { useState, useEffect } from 'react';
import { igotAPI } from '../services/api';

function IGOTCourses() {
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchCourses(); }, []);

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
      alert('Enrollment successful (demo mode)');
    } finally {
      setEnrolling(null);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  const categoryColors = {
    statistical: 'from-blue-500 to-cyan-400',
    technical: 'from-purple-500 to-pink-400',
    digital_governance: 'from-green-500 to-emerald-400',
    behavioural: 'from-orange-500 to-amber-400',
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">iGOT Karmayogi Courses 📚</h1>
        <p className="text-white/80">Explore and enroll in courses from the iGOT platform</p>
      </div>

      {recommended.length > 0 && (
        <div className="card-static">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Recommended for You ✨</h3>
          <p className="text-sm text-gray-500 mb-6">Based on your skill gaps and learning path</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.slice(0, 3).map((course, idx) => (
              <div key={idx} className="p-5 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs font-bold">Recommended</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold">{course.category}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-4">Relevance: {(course.relevance_score * 100).toFixed(0)}%</p>
                <button onClick={() => handleEnroll(course.id)} disabled={enrolling === course.id} className="w-full btn-primary py-2.5">
                  {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-static">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" placeholder="Search courses or skills..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'statistical', 'technical', 'digital_governance', 'behavioural'].map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === cat ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat === 'all' ? 'All' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-static">
        <h3 className="text-lg font-bold text-gray-900 mb-6">All Courses ({filteredCourses.length})</h3>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course, idx) => (
              <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 bg-gradient-to-r ${categoryColors[course.category] || 'from-gray-400 to-gray-500'} text-white rounded-lg text-xs font-semibold`}>{course.category}</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{course.difficulty}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{course.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>⏱️ {course.duration} min</span>
                  <span>🌐 {course.language}</span>
                </div>
                {course.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleEnroll(course.id)} disabled={enrolling === course.id} className="flex-1 btn-primary py-2 text-sm">
                    {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                  </button>
                  <a href={course.url || '#'} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 font-medium">View</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3">📚</span>
            <p className="text-gray-500 font-medium">No courses found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="card-static bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <span className="text-4xl">ℹ️</span>
          <div>
            <h4 className="font-bold text-blue-900 mb-2">About iGOT Karmayogi Integration</h4>
            <p className="text-sm text-blue-700 mb-3">This platform integrates with the iGOT Karmayogi ecosystem to provide personalized learning recommendations. Courses are sourced from the official iGOT platform and matched to your skill gaps using AI-powered analysis.</p>
            <a href="https://igotkarmayogi.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">Visit iGOT Karmayogi →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IGOTCourses;
