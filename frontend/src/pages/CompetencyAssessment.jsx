import React, { useState, useEffect } from 'react';
import { competencyAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CompetencyAssessment() {
  const [framework, setFramework] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState(5);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [frameworkLoading, setFrameworkLoading] = useState(true);

  useEffect(() => {
    fetchFramework();
  }, []);

  const fetchFramework = async () => {
    try {
      const res = await competencyAPI.getFramework();
      setFramework(res.data);
    } catch (err) {
      console.error('Failed to fetch framework:', err);
    } finally {
      setFrameworkLoading(false);
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAssess = async () => {
    if (selectedSkills.length === 0) return;
    
    setLoading(true);
    try {
      const res = await competencyAPI.assess(selectedSkills, experience);
      setReport(res.data);
    } catch (err) {
      console.error('Assessment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (frameworkLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Competency Assessment</h1>
        <p className="text-gray-500">Evaluate your skills and identify gaps</p>
      </div>

      {/* Skill Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Skills</h3>
        
        {framework && Object.entries(framework).map(([category, data]) => (
          <div key={category} className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-3 capitalize">
              {category.replace('_', ' ')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience: {experience}
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={experience}
            onChange={(e) => setExperience(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Fresher</span>
            <span>15 years</span>
            <span>30+ years</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleAssess}
            disabled={selectedSkills.length === 0 || loading}
            className="btn-primary"
          >
            {loading ? 'Assessing...' : 'Run Assessment'}
          </button>
          <span className="text-sm text-gray-500">
            {selectedSkills.length} skills selected
          </span>
        </div>
      </div>

      {/* Assessment Report */}
      {report && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overall Competency Score</h3>
                <p className="text-gray-500">Based on your selected skills and experience</p>
              </div>
              <div className="text-5xl font-bold text-primary-600">
                {report.overall_score.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Category Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={Object.entries(report.category_summary).map(([cat, data]) => ({
                  category: cat.replace('_', ' '),
                  average: data.average_level,
                  assessed: data.skills_assessed,
                  total: data.total_skills
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Gaps */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Gaps Identified</h3>
            {report.skill_gaps.length > 0 ? (
              <div className="space-y-3">
                {report.skill_gaps.slice(0, 10).map((gap, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">{gap.skill}</span>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Current: {gap.current_level.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Target: {gap.target_level.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(gap.current_level / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        gap.priority === 'high' ? 'bg-red-100 text-red-700' :
                        gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No significant gaps identified</p>
            )}
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                  <span className="text-primary-600 mt-1">💡</span>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <a href="/learning-path" className="btn-primary">
                View Learning Path
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompetencyAssessment;
