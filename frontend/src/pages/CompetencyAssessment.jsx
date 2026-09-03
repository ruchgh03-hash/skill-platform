import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { competencyAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CompetencyAssessment() {
  const [framework, setFramework] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState(5);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [frameworkLoading, setFrameworkLoading] = useState(true);

  useEffect(() => { fetchFramework(); }, []);

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
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading competency framework...</p>
        </div>
      </div>
    );
  }

  const categoryColors = {
    statistical: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', gradient: 'from-blue-500 to-cyan-400' },
    technical: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', gradient: 'from-purple-500 to-pink-400' },
    digital_governance: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', gradient: 'from-green-500 to-emerald-400' },
    behavioural: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', gradient: 'from-orange-500 to-amber-400' },
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Competency Assessment 🎯</h1>
        <p className="text-white/80">Evaluate your skills and identify gaps against the O*NET framework</p>
      </div>

      {/* Skill Selection */}
      <div className="card-static">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Select Your Skills</h3>
          <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold">{selectedSkills.length} selected</span>
        </div>
        
        {framework && Object.entries(framework).map(([category, data]) => {
          const colors = categoryColors[category] || categoryColors.statistical;
          return (
            <div key={category} className={`mb-6 p-5 rounded-xl border ${colors.border} ${colors.bg}`}>
              <h4 className={`text-base font-bold ${colors.text} mb-3 capitalize flex items-center gap-2`}>
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`}></span>
                {category.replace('_', ' ')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <button key={skill} onClick={() => handleSkillToggle(skill)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedSkills.includes(skill)
                        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}>
                    {selectedSkills.includes(skill) && '✓ '}{skill}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-5 bg-gray-50 rounded-xl">
          <label className="input-label mb-3">Years of Experience: <span className="text-primary-600">{experience}</span></label>
          <input type="range" min="0" max="30" value={experience} onChange={(e) => setExperience(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Fresher</span><span>15 years</span><span>30+ years</span>
          </div>
        </div>

        <button onClick={handleAssess} disabled={selectedSkills.length === 0 || loading}
          className="btn-primary mt-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Assessing...' : `Run Assessment (${selectedSkills.length} skills)`}
        </button>
      </div>

      {/* Results */}
      {report && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <span className="text-5xl block mb-3">🏆</span>
            <p className="text-white/80 mb-2">Overall Competency Score</p>
            <p className="text-6xl font-black">{report.overall_score.toFixed(1)}</p>
          </div>

          <div className="card-static">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Category Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(report.category_summary).map(([cat, data]) => ({
                category: cat.replace('_', ' '), average: data.average_level, assessed: data.skills_assessed
              }))} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="average" fill="url(#colorGradientComp)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradientComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {report.skill_gaps.length > 0 && (
            <div className="card-static">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Gaps Identified</h3>
              <div className="space-y-3">
                {report.skill_gaps.slice(0, 10).map((gap, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center text-white text-sm font-bold">{idx + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{gap.skill}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">Current: {gap.current_level.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">Target: {gap.target_level.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-400 to-purple-500 rounded-full" style={{ width: `${(gap.current_level / 5) * 100}%` }}></div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        gap.priority === 'high' ? 'bg-red-100 text-red-700' : gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>{gap.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-static">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recommendations</h3>
            <div className="space-y-3">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-100">
                  <span className="text-xl mt-0.5">💡</span>
                  <span className="text-gray-700 font-medium">{rec}</span>
                </div>
              ))}
            </div>
            <Link to="/learning-path" className="btn-primary mt-6 inline-block">View Learning Path →</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompetencyAssessment;
