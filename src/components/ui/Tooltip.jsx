import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Tooltip({ children, content, position = 'top', delay = 300 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = rect.left + rect.width / 2;
        let y = rect.top;

        if (position === 'bottom') y = rect.bottom;
        else if (position === 'left') { x = rect.left; y = rect.top + rect.height / 2; }
        else if (position === 'right') { x = rect.right; y = rect.top + rect.height / 2; }

        setCoords({ x, y });
      }
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const getOriginAndTransform = () => {
    switch (position) {
      case 'bottom': return { originY: 0, x: '-50%', y: 8 };
      case 'left': return { originX: 1, x: 'calc(-100% - 8px)', y: '-50%' };
      case 'right': return { originX: 0, x: 8, y: '-50%' };
      case 'top':
      default: return { originY: 1, x: '-50%', y: 'calc(-100% - 8px)' };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </div>
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                left: coords.x,
                top: coords.y,
                pointerEvents: 'none',
                zIndex: 9999,
                ...getOriginAndTransform()
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-(--text-inverse) bg-(--text-primary) rounded-md shadow-sm whitespace-nowrap"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
