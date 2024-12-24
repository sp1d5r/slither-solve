import React, { useEffect, useState } from 'react';
import { ActivityHeatmapResponse, DailyActivityStats } from 'shared';
import { useApi } from '../../../contexts/ApiContext';
import HeatmapTooltip from './HeatmapTooltip';

const ActivityHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState<ActivityHeatmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState<{
    date: string;
    stats: DailyActivityStats;
    position: { x: number; y: number } | null;
  } | null>(null);
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetchWithAuth('api/sessions/activity/heatmap');
        const data = await response.json();
        setHeatmapData(data);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [fetchWithAuth]);

  if (loading) return <div>Loading activity data...</div>;
  if (!heatmapData) return null;

  // Helper function to get color intensity based on activity count
  const getColorIntensity = (count: number) => {
    const maxIntensity = Math.max(...Object.values(heatmapData.dailyActivity)
      .map(day => day.totalAttempts));
    const intensity = count / maxIntensity;
    return `rgba(34, 197, 94, ${intensity})`; // green-500 with varying opacity
  };

  // Generate last 365 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(dateStr);
    }
    return dates;
  };

  const dates = generateDates();
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const handleMouseMove = (
    e: React.MouseEvent,
    date: string,
    stats: DailyActivityStats
  ) => {
    setTooltipData({
      date,
      stats,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Activity Heatmap</h2>
        <p className="text-gray-600">
          Total Problems: {heatmapData.totalProblems} | 
          Time Spent: {Math.round(heatmapData.totalTimeSpent / 60)} minutes
        </p>
      </div>

      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((date) => {
              const dayData = heatmapData.dailyActivity[date] || {
                totalAttempts: 0,
                totalTimeSpent: 0,
                statusBreakdown: { success: 0, error: 0, warning: 0 }
              };

              return (
                <div
                  key={date}
                  className="w-3 h-3 rounded-sm cursor-pointer transition-colors border border-gray-200"
                  style={{ backgroundColor: getColorIntensity(dayData.totalAttempts) }}
                  onMouseMove={(e) => handleMouseMove(e, date, dayData)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-600">Less</span>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
          <div
            key={opacity}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: `rgba(34, 197, 94, ${opacity})` }}
          />
        ))}
        <span className="text-sm text-gray-600">More</span>
      </div>

      {tooltipData && (
        <HeatmapTooltip
          date={tooltipData.date}
          stats={tooltipData.stats}
          position={tooltipData.position}
        />
      )}
    </div>
  );
};

export default ActivityHeatmap;