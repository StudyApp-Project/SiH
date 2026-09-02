import { motion } from 'framer-motion';
import UserHeroWidget from './ProfileComponents/UserHeroWidget';
import ContributionHeatmap from './ProfileComponents/ContributionHeatmap';
import BadgeWall from './ProfileComponents/BadgeWall';
import WeeklyGoalRing from './ProfileComponents/WeeklyGoalRing';
import ActivityTimeline from './ProfileComponents/ActivityTimeline';
import QuizHistory from './ProfileComponents/QuizHistory';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Profile() {
  return (
    <div className="flex-1 overflow-y-auto bg-(--bg-base) p-4 lg:p-8">
      <motion.div 
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Top Row: Hero and Weekly Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserHeroWidget />
          </div>
          <div className="lg:col-span-1">
            <WeeklyGoalRing />
          </div>
        </div>

        {/* Middle Row: Heatmap */}
        <div>
          <ContributionHeatmap />
        </div>

        {/* Bottom Row: Badges and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BadgeWall />
          </div>
          <div className="lg:col-span-1">
            <ActivityTimeline />
          </div>
        </div>

        {/* Quiz Performance */}
        <div>
          <QuizHistory />
        </div>
      </motion.div>
    </div>
  );
}
