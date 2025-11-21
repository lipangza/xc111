import React from 'react';
import { Camera, Image as ImageIcon, Video, Grid } from 'lucide-react';
import { TabType } from '../types';
import clsx from 'clsx';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'all', label: 'All', icon: Grid },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-end pointer-events-none">
      {/* Main Pill Container */}
      <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 flex items-center shadow-2xl shadow-black/50 scale-100 transition-transform active:scale-95">
        
        {/* Camera Button (Leading Action) */}
        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white mr-2 transition-colors">
           <Camera size={20} />
        </button>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-full p-1 relative">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={clsx(
                  "relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex flex-col items-center justify-center gap-0.5 min-w-[60px]",
                  isActive ? "text-black" : "text-white/60 hover:text-white"
                )}
              >
                {/* Active Background Pill */}
                {isActive && (
                  <div className="absolute inset-0 bg-white rounded-full shadow-sm" style={{ zIndex: -1 }} />
                )}
                
                <Icon size={16} strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};