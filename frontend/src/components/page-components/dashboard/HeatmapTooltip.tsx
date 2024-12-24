import { motion, AnimatePresence } from 'framer-motion';
import { DailyActivityStats } from 'shared';

interface TooltipProps {
  date: string;
  stats: DailyActivityStats;
  position: { x: number; y: number } | null;
}

const HeatmapTooltip = ({ date, stats, position }: TooltipProps) => {
  if (!position) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 bg-gray-800 text-white rounded-lg shadow-lg p-3 text-sm"
        style={{
          left: position.x + 10,
          top: position.y - 10,
          pointerEvents: 'none',
        }}
      >
        <div className="font-semibold mb-1">
          {new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="space-y-1">
          <div>
            {stats.totalAttempts} problem{stats.totalAttempts !== 1 ? 's' : ''} attempted
          </div>
          <div className="text-gray-300">
            Time: {Math.round(stats.totalTimeSpent / 60)} minutes
          </div>
          <div className="grid grid-cols-2 gap-x-4 text-xs">
            <div className="text-green-400">
              ✓ {stats.statusBreakdown.success} success
            </div>
            <div className="text-red-400">
              ✕ {stats.statusBreakdown.error} errors
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HeatmapTooltip;