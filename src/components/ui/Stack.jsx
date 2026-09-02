import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Stack({ cards, renderCard, onSwipeRight, onSwipeLeft, onEmpty }) {
  const [index, setIndex] = useState(0);

  // Notify parent when empty
  useEffect(() => {
    if (index >= cards.length && onEmpty) {
      onEmpty();
    }
  }, [index, cards.length, onEmpty]);

  if (index >= cards.length) {
    return null;
  }

  // To show remaining cards, we slice from the current index to +3
  const activeCards = cards.slice(index, index + 3);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 80;
    if (info.offset.x > swipeThreshold) {
      if (onSwipeRight) onSwipeRight(cards[index]);
      setIndex((prev) => prev + 1);
    } else if (info.offset.x < -swipeThreshold) {
      if (onSwipeLeft) onSwipeLeft(cards[index]);
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-80 h-[26rem] md:w-[32rem] md:h-[36rem] flex items-center justify-center [perspective:1000px]">
      <AnimatePresence>
        {activeCards.reverse().map((card, idx) => {
          // Since we reversed, the top card is the last in the array.
          const isTop = idx === activeCards.length - 1;
          const cardIndex = activeCards.length - 1 - idx; // 0 for top, 1 for middle, 2 for back

          // Depth styling
          const scale = 1 - cardIndex * 0.05;
          const yOffset = cardIndex * 20;
          const zIndex = 10 - cardIndex;

          return (
            <motion.div
              key={card.id}
              className="absolute w-full h-full will-change-transform transform-gpu"
              style={{ zIndex }}
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{
                scale,
                y: yOffset,
                opacity: isTop ? 1 : 0.7,
              }}
              exit={{ 
                x: 300, 
                opacity: 0, 
                scale: 0.5, 
                transition: { duration: 0.2 } 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={isTop ? handleDragEnd : undefined}
              whileDrag={{ scale: 1.05, cursor: "grabbing" }}
            >
              <div className="w-full h-full pointer-events-auto relative">
                {renderCard(card)}
                {/* Blur overlay on non-top cards so text doesn't bleed through */}
                {!isTop && (
                  <div className="absolute inset-0 rounded-3xl backdrop-blur-md bg-(--bg-elevated)/60 pointer-events-none" />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
