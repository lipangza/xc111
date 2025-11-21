import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { MediaItem, MediaType } from '../types';
import { Trash2, Heart, PlayCircle, MapPin } from 'lucide-react';

interface GalleryCardProps {
  item: MediaItem;
  index: number;
  currentIndex: number;
  onRemove: (id: string) => void;
  onFavorite: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
  total: number;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  index,
  currentIndex,
  onRemove,
  onFavorite,
  onNext,
  onPrev,
  total
}) => {
  const isCurrent = index === currentIndex;
  // Calculate distance from current index. 
  // We use a circular-ish logic for the stack visuals if desired, 
  // but for simplicity and cleaner logic, we'll treat it as a linear list here.
  const offset = index - currentIndex; 
  
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Motion Values for Drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // Dynamic visuals based on drag
  const opacityTrash = useTransform(y, [-150, -50], [1, 0]);
  const opacityHeart = useTransform(y, [50, 150], [0, 1]);
  const opacityOverlay = useTransform(y, [-150, 0, 150], [0.5, 0, 0.5]);
  const colorOverlay = useTransform(y, [-100, 0, 100], ["rgba(239, 68, 68, 1)", "rgba(0,0,0,0)", "rgba(236, 72, 153, 1)"]);

  // Reset position when index changes (if recycled)
  useEffect(() => {
    x.set(0);
    y.set(0);
    controls.start({ x: 0, y: 0, scale: 1, opacity: 1 });
  }, [index, currentIndex, controls, x, y]);

  // Visual Stack Logic
  // We only render items close to current to save resources (windowing)
  if (Math.abs(offset) > 2) return null;

  const isVisible = Math.abs(offset) <= 2;
  
  // Calculate stack styles
  let zIndex = 0;
  let scale = 1;
  let xOffset = 0;
  let opacity = 1;
  let brightness = 1;
  let blur = 0;

  if (offset === 0) {
    // Active card
    zIndex = 50;
    scale = 1;
    xOffset = 0;
    opacity = 1;
  } else if (offset === 1) {
    // Next card (peeking right)
    zIndex = 40;
    scale = 0.92;
    xOffset = 40; 
    opacity = 0.6;
    brightness = 0.7;
    blur = 4;
  } else if (offset === -1) {
    // Previous card (peeking left)
    zIndex = 40;
    scale = 0.92;
    xOffset = -40;
    opacity = 0.6;
    brightness = 0.7;
    blur = 4;
  } else {
    // Further back
    zIndex = 30;
    scale = 0.85;
    xOffset = offset > 0 ? 80 : -80;
    opacity = 0;
  }

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity;

    // Vertical Actions (Delete / Favorite)
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      if (info.offset.y < -threshold) {
        // Swipe Up -> Delete
        await controls.start({ y: -800, opacity: 0, transition: { duration: 0.4 } });
        onRemove(item.id);
      } else if (info.offset.y > threshold) {
        // Swipe Down -> Favorite
        await controls.start({ y: 800, opacity: 0, transition: { duration: 0.4 } });
        onFavorite(item.id);
      } else {
        // Snap back
        controls.start({ x: 0, y: 0 });
      }
    } 
    // Horizontal Actions (Navigate)
    else {
      if (info.offset.x < -threshold / 2) {
        // Swipe Left -> Next
        if (index < total - 1) {
          onNext();
        } else {
           controls.start({ x: 0, y: 0 });
        }
      } else if (info.offset.x > threshold / 2) {
        // Swipe Right -> Prev
        if (index > 0) {
          onPrev();
        } else {
           controls.start({ x: 0, y: 0 });
        }
      } else {
        controls.start({ x: 0, y: 0 });
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      drag={isCurrent ? true : false} // Only allow dragging current card
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Use constraints to simulate elastic snapback unless committed
      dragElastic={0.6} // Make it feel rubbery
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{
        x,
        y,
        rotate: isCurrent ? rotate : offset * 5, // Static rotation for background cards
        zIndex,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: 1000,
      }}
      initial={false}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {/* Animated Container for the Stack Effect */}
      <motion.div
        className="relative w-full h-full overflow-hidden shadow-2xl bg-black"
        animate={{
          scale,
          x: isCurrent ? 0 : xOffset, // If current, x is controlled by drag (motion value), if not, by state
          opacity,
          filter: `brightness(${brightness}) blur(${blur}px)`,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{
          // Typically apps apply a slight rotation to back cards
          transformOrigin: "center bottom"
        }}
      >
        {/* Background Image */}
        <img 
          src={item.url} 
          alt="Gallery Item" 
          className="w-full h-full object-cover pointer-events-none select-none" 
        />
        
        {/* Video Indicator */}
        {item.type === MediaType.VIDEO && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                    <PlayCircle size={48} fill="white" className="text-white/80" />
                </div>
            </div>
        )}

        {/* Top Gradient Overlay for Text Visibility */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Header Info */}
        <div className="absolute top-14 left-0 w-full text-center z-10 pointer-events-none">
          <h2 className="text-white/90 font-semibold text-lg tracking-wide drop-shadow-md">{item.date}</h2>
          {item.location && (
            <div className="flex items-center justify-center gap-1 text-white/70 text-xs mt-1">
                <MapPin size={10} />
                <span>{item.location}</span>
            </div>
          )}
        </div>

        {/* Action Feedback Overlays (Only active on current card drag) */}
        {isCurrent && (
          <>
            {/* Delete Overlay */}
            <motion.div 
              style={{ opacity: opacityTrash }}
              className="absolute inset-0 bg-red-500/30 flex flex-col items-center justify-start pt-32 z-20"
            >
              <div className="bg-white p-4 rounded-full shadow-xl">
                <Trash2 className="text-red-500 w-10 h-10" />
              </div>
              <span className="text-white font-bold mt-4 text-xl tracking-widest uppercase drop-shadow-md">Delete</span>
            </motion.div>

            {/* Favorite Overlay */}
            <motion.div 
              style={{ opacity: opacityHeart }}
              className="absolute inset-0 bg-pink-500/30 flex flex-col items-center justify-end pb-40 z-20"
            >
               <span className="text-white font-bold mb-4 text-xl tracking-widest uppercase drop-shadow-md">Favorite</span>
               <div className="bg-white p-4 rounded-full shadow-xl">
                <Heart className="text-pink-500 w-10 h-10 fill-current" />
              </div>
            </motion.div>
          </>
        )}
        
        {/* Favorite Status Indicator (Permanent) */}
        {item.isFavorite && !isCurrent && (
             <div className="absolute bottom-32 right-6 z-10">
                 <Heart className="text-pink-500 fill-current drop-shadow-lg" size={28} />
             </div>
        )}

      </motion.div>
    </motion.div>
  );
};