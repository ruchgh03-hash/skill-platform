import React, { useState } from 'react';
import { quizAPI } from '../services/api';

function QuizBuilder() {
  const [mode, setMode] = useState('text'); // text, document, concept
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
    try {
      const res = await quizAPI.submit({
        quiz_id: quiz.id || quiz.quiz_id,
        answers,
        time_taken_seconds: 0
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
  };

  if (results) {
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h2>
          <p className="text-gray-500">Here's how you performed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card text-center">
            <p className="text-sm text-gray-500">Score</p>
            <p className={`text-4xl font-bold ${
              results.score >= 70 ? 'text-green-600' :
              results.score >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {results.score}%
            </p>
            <p className="text-lg font-medium text-gray-700 mt-2">Grade: {results.grade}</p>
          </div>

          <div className="stat-card text-center">
            <p className="text-sm text-gray-500">Correct Answers</p>
            <p className="text-4xl font-bold text-green-600">{results.correct_count}</p>
            <p className="text-gray-500 mt-2">out of {results.total_questions}</p>
          </div>

          <div className="stat-card text-center">
            <p className="text-sm text-gray-500">Accuracy</p>
            <p className="text-4xl font-bold text-primary-600">
              {((results.correct_count / results.total_questions) * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Results</h3>
          <div className="space-y-4">
            {results.results.map((result, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                result.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                    result.is_correct ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {result.is_correct ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{result.question}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Your answer: <span className="font-medium">{result.user_answer}</span>
                    </p>
                    {!result.is_correct && (
                      <p className="text-sm text-green-600 mt-1">
                        Correct answer: <span className="font-medium">{result.correct_answer}</span>
                      </p>
                    )}
                    {result.explanation && (
                      <p className="text-sm text-gray-500 mt-2 italic">{result.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={resetQuiz} className="btn-primary">
            Generate New Quiz
          </button>
          <a href="/dashboard" className="btn-secondary">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (quiz) {
    const questions = quiz.questions || [];
    const q = questions[currentQuestion];

    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {q && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">{q.question}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                    {q.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-accent-100 text-accent-700 rounded text-xs">
                    {q.concept}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {q.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = answers[q.id] === letter;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(q.id, letter)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-700">{letter}.</span>
                      <span className="ml-2 text-gray-600">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
              className="btn-secondary"
            >
              Previous
            </button>
            
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length || loading}
                className="btn-primary"
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Builder</h1>
        <p className="text-gray-500">Generate AI-powered quizzes from your content</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Input Mode</h3>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              mode === 'text' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
          >
            <span className="text-2xl mb-2 block">📄</span>
            <span className="font-medium">Paste Text</span>
          </button>
          
          <button
            onClick={() => setMode('document')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              mode === 'document' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
          >
            <span className="text-2xl mb-2 block">📁</span>
            <span className="font-medium">Upload Document</span>
          </button>
          
          <button
            onClick={() => setMode('concept')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              mode === 'concept' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
          >
            <span className="text-2xl mb-2 block">💡</span>
            <span className="font-medium">Enter Concept</span>
          </button>
        </div>

        {mode === 'text' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste your content here
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-field h-40 resize-none"
              placeholder="Paste text from your learning materials..."
            />
          </div>
        )}

        {mode === 'document' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload a document (PDF, DOCX, PPTX)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.docx,.pptx,.txt"
              className="input-field"
            />
          </div>
        )}

        {mode === 'concept' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a concept or topic
            </label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="input-field"
              placeholder="e.g., Machine Learning, Survey Design, Data Quality"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="input-field"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-field"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || (mode === 'text' && !inputText) || (mode === 'concept' && !concept) || (mode === 'document' && !file)}
          className="btn-primary w-full py-3"
        >
          {loading ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </div>
    </div>
  );
}

export default QuizBuilder;
