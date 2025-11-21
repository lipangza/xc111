import React, { useState, useMemo, useEffect } from 'react';
import { IOSStatusBar } from './components/IOSStatusBar';
import { BottomNav } from './components/BottomNav';
import { GalleryCard } from './components/GalleryCard';
import { MOCK_MEDIA } from './constants';
import { MediaItem, MediaType, TabType } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [mediaList, setMediaList] = useState<MediaItem[]>(MOCK_MEDIA);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // --- Filtering ---
  const filteredList = useMemo(() => {
    if (activeTab === 'all') return mediaList;
    if (activeTab === 'photos') return mediaList.filter(m => m.type === MediaType.PHOTO);
    if (activeTab === 'videos') return mediaList.filter(m => m.type === MediaType.VIDEO);
    return mediaList;
  }, [mediaList, activeTab]);

  // Reset index when tab changes to avoid out-of-bounds
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // --- Handlers ---
  
  const handleRemove = (id: string) => {
    // Add a slight delay to allow animation to finish before DOM removal
    setTimeout(() => {
        setMediaList(prev => prev.filter(item => item.id !== id));
        // If we removed the last item, adjust index
        if (currentIndex >= filteredList.length - 1) {
            setCurrentIndex(Math.max(0, filteredList.length - 2));
        }
    }, 400);
  };

  const handleFavorite = (id: string) => {
    setMediaList(prev => prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
    // Auto advance after favorite? iOS usually doesn't, but Tinder does. 
    // Let's stay on the card but show visual feedback, handled in GalleryCard.
    // Actually, prompts says "Down: Collection/Favorite".
    // Let's just toggle it.
  };

  const handleNext = () => {
    if (currentIndex < filteredList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setMediaList(MOCK_MEDIA);
    setCurrentIndex(0);
    setActiveTab('all');
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Blur Element for Ambiance */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
         {filteredList[currentIndex] && (
            <img 
                src={filteredList[currentIndex].url} 
                className="w-full h-full object-cover blur-3xl scale-125 transition-all duration-700" 
                alt="Ambient Background"
            />
         )}
         <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Status Bar */}
      <IOSStatusBar />

      {/* Main Viewport */}
      <div className="flex-1 relative w-full h-full max-w-md mx-auto z-10 mt-4 mb-20">
        <div className="w-full h-full relative flex items-center justify-center">
            
            {filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-white/50 gap-4">
                    <div className="bg-white/10 p-6 rounded-full">
                        <Heart size={48} strokeWidth={1} />
                    </div>
                    <p className="text-lg font-light">No Media Available</p>
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                    >
                        <RefreshCw size={14} />
                        <span>Reset Gallery</span>
                    </button>
                </div>
            ) : (
                // Render cards.
                // We render them in a specific order so z-index works naturally, 
                // though strict z-index in CSS is handled in component.
                filteredList.map((item, index) => (
                    <GalleryCard
                        key={item.id}
                        item={item}
                        index={index}
                        currentIndex={currentIndex}
                        total={filteredList.length}
                        onRemove={handleRemove}
                        onFavorite={handleFavorite}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                ))
            )}
        </div>
      </div>

      {/* Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Instructions Overlay (Fades out after interaction? Or minimal UI) */}
      <div className="absolute top-20 right-4 z-40 text-white/30 text-[10px] font-mono flex flex-col items-end pointer-events-none gap-1">
        <span>↑ DEL</span>
        <span>↓ FAV</span>
        <span>←→ NAV</span>
      </div>
    </div>
  );
};

export default App;