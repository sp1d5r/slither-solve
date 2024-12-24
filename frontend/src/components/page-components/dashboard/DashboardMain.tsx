import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, BoltIcon, Book, Code, Database, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Session, SessionHistory, SessionHistoryResponse } from 'shared/src/types/CodeEditor';
import { TopicProgress } from 'shared/src/types/CodeEditor';
import { useApi } from '../../../contexts/ApiContext';
import { useAuth } from '../../../contexts/AuthenticationProvider';
import ActivityHeatmap from './ActivityHeatmap';

const DashboardMain = () => {
  const navigate = useNavigate();
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({});
  const [recentActivity, setRecentActivity] = useState<SessionHistoryResponse | null>(null);
  const {fetchWithAuth} = useApi();
  const {authState} = useAuth();

  const topics = useMemo(() => [
    { 
      id: 'variables', 
      name: 'Variables', 
      icon: <Database className="w-6 h-6" />,
      totalCards: 20,
      description: 'Learn about Python variables and data types'
    },
    { 
      id: 'if_statements', 
      name: 'If-Else', 
      icon: <Code className="w-6 h-6" />,
      totalCards: 15,
      description: 'Master conditional statements'
    },
    { 
      id: 'functions', 
      name: 'Functions', 
      icon: <Terminal className="w-6 h-6" />,
      totalCards: 25,
      description: 'Create reusable code blocks'
    },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get topic progress for each topic
        const progress: Record<string, TopicProgress> = {};
        for (const topic of topics) {
            const response = await fetchWithAuth(`api/sessions/progress/topics/${topic.id}`);
            const data: TopicProgress = await response.json();
            progress[topic.id] = data;
        }
        console.log("progress", progress);
        setTopicProgress(progress);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      try {
        // 2. Get recent session history (for streak and activity)
        const historyResponse = await fetchWithAuth('api/sessions/history?page=1&limit=30');
        const historyData: SessionHistoryResponse = await historyResponse.json();
        console.log("historyData", historyData);
        setRecentActivity(historyData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [fetchWithAuth, topics, authState.user]);


  // Get the most recent topic and session stats
  const getContinueTopicData = useMemo(() => {
    if (!recentActivity?.sessions?.length) return null;
    
    const lastSession = recentActivity.sessions[0];
    const topic = topics.find(t => t.id === lastSession.topicStudied);
    
    if (!topic) return null;

    // Calculate session statistics
    const problemStats = lastSession.problemsAttempted.reduce((acc, problem) => {
      return {
        totalProblems: acc.totalProblems + 1,
        correctFirstTry: acc.correctFirstTry + (problem.correct && problem.attemptCount === 1 ? 1 : 0),
        totalCorrect: acc.totalCorrect + (problem.correct ? 1 : 0),
        totalTime: acc.totalTime + problem.timeSpent,
      };
    }, { totalProblems: 0, correctFirstTry: 0, totalCorrect: 0, totalTime: 0 });

    return {
      topicId: lastSession.topicStudied,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      lastSessionStats: {
        ...problemStats,
        accuracy: Math.round((problemStats.totalCorrect / problemStats.totalProblems) * 100),
        averageTime: Math.round(problemStats.totalTime / problemStats.totalProblems),
        timestamp: lastSession.timestamp
      }
    };
  }, [recentActivity, topics]);

  // Update the Topics Grid section to use real data
  const getTopicData = (topicId: string) => {
    const progress = topicProgress[topicId];
    const topic = topics.find(t => t.id === topicId);
    const totalCards = topic?.totalCards || 0;
    
    return {
      masteryLevel: progress?.masteryLevel 
        ? Math.round((progress.masteryLevel / totalCards) * 100)
        : 0,
      totalCards: totalCards,
      completedCards: progress?.masteryLevel || 0
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header - Update with real streak and level */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-500">Slither & Solve</h1>
            <p className="text-pink-600 mt-2 font-bold">Master Python, one card at a time 🐍</p>
          </div>
        </div>

        {/* Add the heatmap after the header */}
        <div className="mb-8">
          <ActivityHeatmap />
        </div>

        {/* Continue Learning Section */}
        {getContinueTopicData && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="space-y-4">
              {/* Topic Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-green-100 to-pink-100 p-3 rounded-lg">
                    {getContinueTopicData.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Continue {getContinueTopicData.name}</h2>
                    <p className="text-gray-600">{getContinueTopicData.description}</p>
                  </div>
                </div>
                <button 
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => navigate(`/session/${getContinueTopicData.topicId}`)}
                >
                  Continue Learning
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-8">
                  <div className="text-sm text-gray-500">
                    Last session: {new Date(getContinueTopicData.lastSessionStats.timestamp).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center">
                      <div className="text-green-500 font-semibold text-lg">
                        {getContinueTopicData.lastSessionStats.accuracy}%
                      </div>
                      <span className="text-gray-600 text-sm ml-2">Accuracy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-pink-500 font-semibold text-lg">
                        {getContinueTopicData.lastSessionStats.correctFirstTry}
                      </div>
                      <span className="text-gray-600 text-sm ml-2">Perfect Solutions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-blue-500 font-semibold text-lg">
                        {getContinueTopicData.lastSessionStats.totalProblems}
                      </div>
                      <span className="text-gray-600 text-sm ml-2">Problems</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-purple-500 font-semibold text-lg">
                        {getContinueTopicData.lastSessionStats.averageTime}s
                      </div>
                      <span className="text-gray-600 text-sm ml-2">Avg. Time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Topics Grid - Update display to show raw numbers and percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const { masteryLevel, totalCards, completedCards } = getTopicData(topic.id);
            return (
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
                  <span>{completedCards} / {totalCards} cards</span>
                  <span>{masteryLevel}% mastery</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-pink-500 rounded-full h-2"
                    style={{width: `${masteryLevel}%`}}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export {DashboardMain};