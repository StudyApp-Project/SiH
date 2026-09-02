import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Users, Loader2 } from 'lucide-react';
import { useRoom } from '../contexts/RoomContext';
import LeftSidebar from './StudyRoomComponents/LeftSidebar';
import RightSidebar from './StudyRoomComponents/RightSidebar';
import DiscussionWorkspace from './StudyRoomComponents/Workspaces/DiscussionWorkspace';
import NotesWorkspace from './StudyRoomComponents/Workspaces/NotesWorkspace';
import LiveWorkspace from './StudyRoomComponents/Workspaces/LiveWorkspace';
import ProjectWorkspace from './StudyRoomComponents/Workspaces/ProjectWorkspace';

export default function StudyRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeRoom, activeClassroom, setActiveRoom, setActiveClassroom, leaveRoom } = useRoom();

  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Set active room on mount if needed
  useEffect(() => {
    if (!activeRoom || activeRoom.id !== id) {
      setActiveRoom(id);
    }
  }, [id, activeRoom, setActiveRoom]);

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-(--text-muted)" size={32} />
      </div>
    );
  }

  const handleBack = () => {
    leaveRoom();
    navigate('/rooms');
  };

  const handleSelectClassroom = (cId) => {
    setActiveClassroom(cId);
    setIsMobileLeftOpen(false);
  };

  // Render the correct workspace
  const renderWorkspace = () => {
    if (!activeClassroom) return <div className="flex-1" />;
    switch (activeClassroom.type) {
      case 'discussion': return <DiscussionWorkspace />;
      case 'notes': return <NotesWorkspace />;
      case 'live': return <LiveWorkspace />;
      case 'project': return <ProjectWorkspace />;
      default: return <DiscussionWorkspace />;
    }
  };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden relative">
      
      {/* LEFT PANE - Desktop */}
      <div className="hidden lg:flex w-64 shrink-0 z-10">
        <LeftSidebar 
          room={activeRoom} 
          activeClassroomId={activeClassroom?.id} 
          onSelectClassroom={handleSelectClassroom}
          onBack={handleBack}
        />
      </div>

      {/* LEFT PANE - Mobile Drawer */}
      <AnimatePresence>
        {isMobileLeftOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileLeftOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden">
              <LeftSidebar room={activeRoom} activeClassroomId={activeClassroom?.id} onSelectClassroom={handleSelectClassroom} onBack={handleBack} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CENTER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 bg-(--bg-primary) relative z-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-(--border-default) bg-(--bg-elevated)/80 backdrop-blur-md z-10">
          <button onClick={() => setIsMobileLeftOpen(true)} className="p-2 rounded-lg hover:bg-(--bg-glass)">
            <Menu size={20} />
          </button>
          <div className="font-bold text-sm truncate px-2" style={{ fontFamily: 'var(--font-display)' }}>{activeClassroom?.name || activeRoom.name}</div>
          <button onClick={() => setIsMobileRightOpen(true)} className="p-2 rounded-lg hover:bg-(--bg-glass) relative">
            <Users size={20} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500 border-2 border-(--bg-elevated)"></div>
          </button>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClassroom?.id || 'empty'}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col"
            >
              {renderWorkspace()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANE - Desktop */}
      <div className="hidden lg:flex w-80 shrink-0 z-10">
        <RightSidebar room={activeRoom} isMobile={false} />
      </div>

      {/* RIGHT PANE - Mobile Drawer */}
      <AnimatePresence>
        {isMobileRightOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileRightOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 right-0 w-80 z-50 lg:hidden">
              <RightSidebar room={activeRoom} isMobile={true} onClose={() => setIsMobileRightOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}