import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../services/api';

function QuizBuilder() {
  const [mode, setMode] = useState('text');
  const [inputText, setInputText] = useState('');
  const [concept, setConcept] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning && !results) {
      timerRef.current = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, results]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === 'document' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('num_questions', numQuestions);
        formData.append('difficulty', difficulty);
        res = await quizAPI.generateFromDocument(formData);
      } else {
        res = await quizAPI.generate({
          text: mode === 'text' ? inputText : undefined,
          concept: mode === 'concept' ? concept : undefined,
          num_questions: numQuestions,
          difficulty,
          title: `Quiz - ${new Date().toLocaleDateString()}`
        });
      }
      setQuiz(res.data);
      setCurrentQuestion(0);
      setAnswers({});
      setResults(null);
      setTimeElapsed(0);
      setIsTimerRunning(true);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsTimerRunning(false);
    try {
      const res = await quizAPI.submit({
        quiz_id: quiz.id || quiz.quiz_id,
        answers,
        time_taken_seconds: timeElapsed
      });
      setResults(res.data);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setResults(null);
    setAnswers({});
    setCurrentQuestion(0);
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

  // Results View
  if (results) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
          <span className="text-5xl block mb-3">🎉</span>
          <h2 className="text-2xl font-bold mb-1">Quiz Complete!</h2>
          <p className="text-white/80">Here's how you performed</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Score', value: `${results.score}%`, icon: '🏆', color: results.score >= 70 ? 'text-green-600' : results.score >= 50 ? 'text-yellow-600' : 'text-red-600', bg: results.score >= 70 ? 'bg-green-50' : results.score >= 50 ? 'bg-yellow-50' : 'bg-red-50' },
            { title: 'Correct', value: `${results.correct_count}/${results.total_questions}`, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
            { title: 'Time Taken', value: formatTime(timeElapsed), icon: '⏱️', color: 'text-primary-600', bg: 'bg-blue-50' },
            { title: 'Grade', value: results.grade, icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.bg} rounded-2xl p-5 text-center`}>
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="card-static">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Detailed Results</h3>
          <div className="space-y-4">
            {results.results.map((result, idx) => (
              <div key={idx} className={`p-5 rounded-xl border-2 ${result.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${result.is_correct ? 'bg-green-500' : 'bg-red-500'}`}>
                    {result.is_correct ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-2">{result.question}</p>
                    <p className="text-sm text-gray-600">Your answer: <span className="font-medium">{result.user_answer}</span></p>
                    {!result.is_correct && (
                      <p className="text-sm text-green-600 mt-1">Correct answer: <span className="font-medium">{result.correct_answer}</span></p>
                    )}
                    {result.explanation && (
                      <p className="text-sm text-gray-500 mt-2 italic bg-white/50 p-2 rounded-lg">💡 {result.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={resetQuiz} className="btn-primary">Generate New Quiz</button>
          <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Quiz Taking View
  if (quiz) {
    const questions = quiz.questions || [];
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="space-y-6">
        <div className="card-static">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl">
                <span className="text-lg">⏱️</span>
                <span className="font-mono font-bold text-primary-600">{formatTime(timeElapsed)}</span>
              </div>
              <span className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          {q && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <p className="text-lg font-semibold text-gray-900 mb-3">{q.question}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold">{q.difficulty}</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">{q.concept}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = answers[q.id] === letter;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(q.id, letter)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>{letter}</span>
                      <span className={`font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button onClick={() => setCurrentQuestion(prev => prev - 1)} disabled={currentQuestion === 0} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
              ← Previous
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length || loading} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Submitting...' : 'Submit Quiz ✓'}
              </button>
            ) : (
              <button onClick={() => setCurrentQuestion(prev => prev + 1)} className="btn-primary">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Generate Quiz View
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Quiz Builder 📝</h1>
        <p className="text-white/80">Generate AI-powered quizzes from your content</p>
      </div>

      <div className="card-static">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Select Input Mode</h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { id: 'text', icon: '📄', label: 'Paste Text' },
            { id: 'document', icon: '📁', label: 'Upload Document' },
            { id: 'concept', icon: '💡', label: 'Enter Concept' },
          ].map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`p-5 rounded-xl border-2 transition-all duration-300 text-center ${
                mode === m.id ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' : 'border-gray-200 hover:border-gray-300'
              }`}>
              <span className="text-3xl block mb-2">{m.icon}</span>
              <span className={`font-semibold ${mode === m.id ? 'text-primary-700' : 'text-gray-700'}`}>{m.label}</span>
            </button>
          ))}
        </div>

        {mode === 'text' && (
          <div className="mb-6">
            <label className="input-label">Paste your content here</label>
            <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="input-field h-40 resize-none" placeholder="Paste text from your learning materials..." />
          </div>
        )}

        {mode === 'document' && (
          <div className="mb-6">
            <label className="input-label">Upload a document (PDF, DOCX, PPTX)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
              <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.docx,.pptx,.txt" className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-4xl block mb-3">📤</span>
                <p className="font-semibold text-gray-700">{file ? file.name : 'Click to upload or drag and drop'}</p>
                <p className="text-sm text-gray-400 mt-1">PDF, DOCX, PPTX up to 10MB</p>
              </label>
            </div>
          </div>
        )}

        {mode === 'concept' && (
          <div className="mb-6">
            <label className="input-label">Enter a concept or topic</label>
            <input type="text" value={concept} onChange={(e) => setConcept(e.target.value)} className="input-field" placeholder="e.g., Machine Learning, Survey Design, Data Quality" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="input-label">Number of Questions</label>
            <select value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} className="input-field">
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </div>
          <div>
            <label className="input-label">Difficulty Level</label>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                    difficulty === d ? 'bg-primary-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || (mode === 'text' && !inputText) || (mode === 'concept' && !concept) || (mode === 'document' && !file)}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Generating Quiz...' : 'Generate Quiz 🚀'}
        </button>
      </div>
    </div>
  );
}

export default QuizBuilder;
