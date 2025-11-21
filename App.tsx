import React, { useState, useMemo, useEffect, useRef } from 'react';
import { IOSStatusBar } from './components/IOSStatusBar';
import { BottomNav } from './components/BottomNav';
import { GalleryCard } from './components/GalleryCard';
import { LandingView } from './components/LandingView';
import { getRandomSubset } from './constants';
import { MediaItem, MediaType, TabType } from './types';
import { RefreshCw, FolderOpen, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [hasStarted, setHasStarted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    setTimeout(() => {
        setMediaList(prev => prev.filter(item => item.id !== id));
        if (currentIndex >= filteredList.length - 1) {
            setCurrentIndex(Math.max(0, filteredList.length - 2));
        }
    }, 400);
  };

  const handleFavorite = (id: string) => {
    setMediaList(prev => prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
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

  const handleReturnHome = () => {
    setHasStarted(false);
    setMediaList([]);
  };

  // --- "Simulated Scan" Logic ---

  const handleStartScan = () => {
    setIsScanning(true);
    setLoadingStatus('正在获取相册权限...');
    
    // Step 1: Simulate Permission Delay
    setTimeout(() => {
        setLoadingStatus('正在扫描媒体文件...');
        
        // Step 2: Simulate Scanning Delay
        setTimeout(() => {
             setLoadingStatus('正在随机抽取回忆...');
             
             // Step 3: Extract & Start
             setTimeout(() => {
                const randomSet = getRandomSubset(20);
                setMediaList(randomSet);
                setCurrentIndex(0);
                setActiveTab('all');
                setIsScanning(false);
                setHasStarted(true);
             }, 800);
        }, 1000);
    }, 800);
  };

  // --- Native File Handling (Bottom Nav Option) ---

  const handleManualImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newItems: MediaItem[] = Array.from(files).map((file, i) => {
        const f = file as File;
        return {
          id: `local-${Date.now()}-${i}`,
          type: f.type.startsWith('video') ? MediaType.VIDEO : MediaType.PHOTO,
          url: URL.createObjectURL(f),
          date: "刚刚导入", 
          location: "本地相册导入", 
          isFavorite: false,
        };
      });

      setMediaList(newItems); // No shuffle for manual specific import
      setCurrentIndex(0);
      setActiveTab('all');
      setHasStarted(true);
    }
  };

  // --- Render ---

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      <IOSStatusBar />

      {/* Hidden File Input for Manual Import */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden" 
        accept="image/*,video/*" 
        multiple 
      />

      {!hasStarted ? (
        // --- Landing View ---
        <LandingView 
            onStart={handleStartScan} 
            isLoading={isScanning}
            loadingStatus={loadingStatus}
        />
      ) : (
        // --- Main Gallery View ---
        <>
          {/* Background Blur */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none transition-opacity duration-1000">
             {filteredList[currentIndex] && filteredList[currentIndex].type === MediaType.PHOTO && (
                <img 
                    src={filteredList[currentIndex].url} 
                    className="w-full h-full object-cover blur-3xl scale-125" 
                    alt="Ambient Background"
                />
             )}
             <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Back Button (Top Left) */}
          <button 
            onClick={handleReturnHome}
            className="absolute top-12 left-4 z-50 p-2 text-white/50 hover:text-white bg-black/20 backdrop-blur-md rounded-full border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Main Viewport */}
          <div className="flex-1 relative w-full h-full z-10 mt-4 mb-24">
            <div className="w-full h-full relative flex items-center justify-center">
                
                {filteredList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-white/50 gap-4 px-8 text-center">
                        <div className="bg-white/10 p-6 rounded-full">
                            <FolderOpen size={48} strokeWidth={1} />
                        </div>
                        <p className="text-lg font-light">本次整理已完成</p>
                        <button 
                            onClick={handleStartScan}
                            className="mt-4 flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full text-sm font-medium"
                        >
                            <RefreshCw size={14} />
                            <span>再来一组</span>
                        </button>
                    </div>
                ) : (
                    // Render cards
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
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onCameraClick={handleManualImportClick}
          />
          
          {/* Instructions Overlay */}
          <div className="absolute top-16 right-4 z-40 text-white/30 text-[10px] font-mono flex flex-col items-end pointer-events-none gap-1 select-none">
            <span>↑ 删除</span>
            <span>↓ 收藏</span>
          </div>
        </>
      )}
    </div>
  );
};

export default App;