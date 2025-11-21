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
  const offset = index - currentIndex; 
  
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controls = useAnimation();
  
  // Motion Values for Drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // Dynamic visuals based on drag
  const opacityTrash = useTransform(y, [-150, -50], [1, 0]);
  const opacityHeart = useTransform(y, [50, 150], [0, 1]);

  // Video Autoplay Logic
  useEffect(() => {
    if (item.type === MediaType.VIDEO && videoRef.current) {
        if (isCurrent) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Auto-play was prevented:", error);
                });
            }
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }
  }, [isCurrent, item.type]);

  // Reset position when index changes
  useEffect(() => {
    x.set(0);
    y.set(0);
    controls.start({ x: 0, y: 0, scale: 1, opacity: 1 });
  }, [index, currentIndex, controls, x, y]);

  if (Math.abs(offset) > 2) return null;

  const isVisible = Math.abs(offset) <= 2;
  
  let zIndex = 0;
  let scale = 1;
  let xOffset = 0;
  let opacity = 1;
  let brightness = 1;
  let blur = 0;

  if (offset === 0) {
    zIndex = 50;
    scale = 1;
    xOffset = 0;
    opacity = 1;
  } else if (offset === 1) {
    zIndex = 40;
    scale = 0.92;
    xOffset = 40; 
    opacity = 0.6;
    brightness = 0.7;
    blur = 4;
  } else if (offset === -1) {
    zIndex = 40;
    scale = 0.92;
    xOffset = -40;
    opacity = 0.6;
    brightness = 0.7;
    blur = 4;
  } else {
    zIndex = 30;
    scale = 0.85;
    xOffset = offset > 0 ? 80 : -80;
    opacity = 0;
  }

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;

    if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      if (info.offset.y < -threshold) {
        await controls.start({ y: -800, opacity: 0, transition: { duration: 0.4 } });
        onRemove(item.id);
      } else if (info.offset.y > threshold) {
        await controls.start({ y: 800, opacity: 0, transition: { duration: 0.4 } });
        onFavorite(item.id);
      } else {
        controls.start({ x: 0, y: 0 });
      }
    } else {
      if (info.offset.x < -threshold / 2) {
        if (index < total - 1) {
          onNext();
        } else {
           controls.start({ x: 0, y: 0 });
        }
      } else if (info.offset.x > threshold / 2) {
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
      drag={isCurrent ? true : false} 
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{
        x,
        y,
        rotate: isCurrent ? rotate : offset * 5,
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
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        className="relative w-full h-full overflow-hidden shadow-2xl bg-black"
        animate={{
          scale,
          x: isCurrent ? 0 : xOffset,
          opacity,
          filter: `brightness(${brightness}) blur(${blur}px)`,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ transformOrigin: "center bottom" }}
      >
        {item.type === MediaType.VIDEO ? (
           <video
             ref={videoRef}
             src={item.url}
             className="w-full h-full object-cover pointer-events-none select-none"
             playsInline
             loop
             muted
           />
        ) : (
            <img 
              src={item.url} 
              alt="Gallery Item" 
              className="w-full h-full object-cover pointer-events-none select-none" 
            />
        )}
        
        {item.type === MediaType.VIDEO && !isCurrent && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                    <PlayCircle size={48} fill="white" className="text-white/80" />
                </div>
            </div>
        )}

        {/* Gradients */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Enhanced Header Info (Date & Location) */}
        <div className="absolute top-14 left-0 w-full flex flex-col items-center z-10 pointer-events-none">
          <h2 className="text-white font-bold text-xl tracking-wide drop-shadow-lg">{item.date}</h2>
          
          {item.location && (
            <div className="mt-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-white/90 text-xs shadow-sm">
                <MapPin size={10} className="fill-current text-red-400" />
                <span className="font-medium tracking-wide">{item.location}</span>
            </div>
          )}
        </div>

        {/* Action Feedback */}
        {isCurrent && (
          <>
            <motion.div 
              style={{ opacity: opacityTrash }}
              className="absolute inset-0 bg-red-500/30 flex flex-col items-center justify-start pt-32 z-20"
            >
              <div className="bg-white p-4 rounded-full shadow-xl transform scale-110">
                <Trash2 className="text-red-500 w-10 h-10" />
              </div>
              <span className="text-white font-bold mt-4 text-xl tracking-widest uppercase drop-shadow-md">删除</span>
            </motion.div>

            <motion.div 
              style={{ opacity: opacityHeart }}
              className="absolute inset-0 bg-pink-500/30 flex flex-col items-center justify-end pb-40 z-20"
            >
               <span className="text-white font-bold mb-4 text-xl tracking-widest uppercase drop-shadow-md">收藏</span>
               <div className="bg-white p-4 rounded-full shadow-xl transform scale-110">
                <Heart className="text-pink-500 w-10 h-10 fill-current" />
              </div>
            </motion.div>
          </>
        )}
        
        {item.isFavorite && !isCurrent && (
             <div className="absolute bottom-32 right-6 z-10">
                 <Heart className="text-pink-500 fill-current drop-shadow-lg" size={28} />
             </div>
        )}

      </motion.div>
    </motion.div>
  );
};