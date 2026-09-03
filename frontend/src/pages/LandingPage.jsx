import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const features = [
    {
      icon: '🎯',
      title: 'AI Competency Assessment',
      desc: 'Evaluate skills across 43+ competencies with O*NET-inspired framework tailored for India\'s statistical system.',
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '📝',
      title: 'Smart Quiz Generation',
      desc: 'Auto-generate MCQs from uploaded documents using FLAN-T5 and transformer models.',
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-50',
    },
    {
      icon: '📚',
      title: 'iGOT Karmayogi Integration',
      desc: 'Seamless sync with 15+ government courses for personalized learning recommendations.',
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-50',
    },
    {
      icon: '🗺️',
      title: 'Adaptive Learning Paths',
      desc: 'AI-driven learning journeys with milestone tracking and semantic course matching.',
      color: 'from-orange-500 to-amber-400',
      bgColor: 'bg-orange-50',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      desc: 'Real-time insights for learners and administrators with predictive analytics.',
      color: 'from-pink-500 to-rose-400',
      bgColor: 'bg-pink-50',
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      desc: 'JWT auth, RBAC, bcrypt encryption, and DPDP Act compliance ready.',
      color: 'from-red-500 to-orange-400',
      bgColor: 'bg-red-50',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Government Officials', icon: '👤' },
    { value: '43+', label: 'Competency Skills', icon: '🎯' },
    { value: '15+', label: 'iGOT Courses', icon: '📚' },
    { value: '4', label: 'Skill Categories', icon: '📁' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white font-bold text-lg">SP</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">SkillBridge</h1>
                <p className="text-[10px] text-primary-600 font-medium">SIH PS 26101 | MoSPI</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-secondary text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-bg-animated relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Smart India Hackathon 2026 | MoSPI
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              AI-Enabled Learning Platform
              <span className="block text-3xl md:text-4xl font-bold mt-2 text-white/90">for India's Statistical System</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Strengthening capacity building through personalized training, competency assessment, 
              and AI-powered skill development for 50,000+ government officials.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg">
                Start Learning Free →
              </Link>
              <a href="#features" className="glass-card text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 text-lg">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Everything You Need</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Comprehensive tools for identifying skill gaps and delivering personalized learning at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="card hover-lift group cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Simple 5-Step Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: '01', icon: '📋', title: 'Assess Skills', desc: 'Take competency assessment' },
              { step: '02', icon: '🤖', title: 'AI Analysis', desc: 'NLP maps skill gaps' },
              { step: '03', icon: '📝', title: 'Generate Quiz', desc: 'Auto-create MCQs' },
              { step: '04', icon: '🎯', title: 'Learning Path', desc: 'Personalized courses' },
              { step: '05', icon: '📊', title: 'Track Progress', desc: 'Real-time dashboards' },
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                {idx < 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-primary-100"></div>
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25 relative z-10">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <p className="text-xs text-primary-600 font-bold mb-1">{item.step}</p>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Skills?</h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of government officials already using AI-powered learning to advance their careers.
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg inline-block">
            Get Started Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SP</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">SkillBridge</h3>
                  <p className="text-xs text-gray-400">SIH PS 26101</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                AI-Enabled Learning Platform for India's Official Statistical System. 
                Developed for Smart India Hackathon 2026.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><a href="https://igotkarmayogi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">iGOT Karmayogi</a></li>
                <li><a href="https://sih.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">SIH Portal</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Organization</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Ministry of Statistics & Programme Implementation</li>
                <li>Smart India Hackathon 2026</li>
                <li>Problem Statement PS 26101</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; 2026 SkillBridge. Built with ❤️ for India's Growth.
            </p>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span>FastAPI</span>
              <span>•</span>
              <span>React</span>
              <span>•</span>
              <span>AI/ML</span>
              <span>•</span>
              <span>Docker</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
