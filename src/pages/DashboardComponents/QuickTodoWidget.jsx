import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, GripVertical, Circle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDashboard } from '../../contexts/DashboardContext';

export default function QuickTodoWidget() {
  const { tasks, toggleTask, addTask } = useDashboard();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle);
      setNewTaskTitle('');
    }
  };

  const handleToggle = (id) => {
    toggleTask(id);
    const task = tasks.find(t => t.id === id);
    if (!task.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399']
      });
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Up Next</h3>
        <div className="text-xs font-medium text-[color:oklch(0.58_0.22_var(--accent-hue))] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] px-2 py-1 rounded-md">
          {pendingTasks.length} pending
        </div>
      </div>

      {/* Task Input */}
      <form onSubmit={handleAdd} className="mb-4 relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task... (Press Enter)"
          className="w-full bg-(--bg-elevated) border border-(--border-default) rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors placeholder:text-(--text-muted)"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)">
          <Plus size={18} />
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        <div>
          <AnimatePresence>
            {pendingTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="group flex items-center gap-3 py-2 border-b border-(--border-subtle) last:border-0 cursor-pointer"
                onClick={() => handleToggle(task.id)}
              >
                <div className="text-(--text-muted) opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing">
                  <GripVertical size={14} />
                </div>
                <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                  <Circle size={18} className="text-(--border-strong) group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors" />
                </div>
                <span className="text-sm font-medium flex-1 truncate transition-colors">{task.title}</span>
                {task.priority === 'high' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {completedTasks.length > 0 && (
          <div className="pt-2 border-t border-(--border-default)">
            <h4 className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider mb-2">Completed</h4>
            <AnimatePresence>
              {completedTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 py-1.5 opacity-50 hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => handleToggle(task.id)}
                >
                  <div className="w-4 h-4 ml-6 flex items-center justify-center shrink-0 bg-green-500 rounded-full">
                    <Check size={10} className="text-white" />
                  </div>
                  <span className="text-sm line-through truncate">{task.title}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}