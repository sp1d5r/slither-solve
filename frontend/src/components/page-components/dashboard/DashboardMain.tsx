import React from 'react';
import { Trophy, Star, BoltIcon, Book, Code, Database, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardMain= () => {
  const navigate = useNavigate();

  const topics = [
    { id: 'variables', name: 'Variables', progress: 75, icon: <Database className="w-6 h-6" />, cards: 20 },
    { id: 'if_statements', name: 'If-Else', progress: 45, icon: <Code className="w-6 h-6" />, cards: 15 },
    { id: 'functions', name: 'Functions', progress: 30, icon: <Terminal className="w-6 h-6" />, cards: 25 },
  ];

  const startSession = (topicId: string) => {
    navigate('/session', { state: { selectedTopic: topicId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-500">Slither & Solve</h1>
            <p className="text-pink-600 mt-2 font-bold">Master Python, one card at a time 🐍</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full">
                <BoltIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm mt-1 text-green-700">7 Day Streak</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-pink-600" />
              </div>
              <p className="text-sm mt-1 text-pink-700">Level 5</p>
            </div>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Continue Learning</h2>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Start Session
            </button>
          </div>
          <div className="flex items-center">
            <Book className="w-8 h-8 text-green-500 mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-700">Variables & Data Types</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 rounded-full h-2" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div 
              key={topic.id} 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => startSession(topic.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-100 to-pink-100 p-3 rounded-lg">
                  {topic.icon}
                </div>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{topic.name}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{topic.cards} cards</span>
                <span>{topic.progress}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-pink-500 rounded-full h-2"
                  style={{width: `${topic.progress}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export {DashboardMain};