import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Play, Loader2, ScanLine } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  isLoading: boolean;
  loadingStatus: string;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart, isLoading, loadingStatus }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black z-0 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Text */}
      <div className="z-10 flex flex-col items-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white tracking-tight mb-2"
        >
          去留相册
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/50 text-sm font-medium tracking-widest uppercase"
        >
          去留之间
        </motion.p>
      </div>

      {/* Decorative Stack */}
      <div className="relative w-64 h-80 mb-16 z-10 flex items-center justify-center">
        {/* Card 3 (Back) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.6, scale: 0.9, rotate: -12 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute w-full h-full bg-gray-800 rounded-3xl border border-white/10 shadow-2xl"
        />
        {/* Card 2 (Middle) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.8, scale: 0.95, rotate: 6 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="absolute w-full h-full bg-gray-700 rounded-3xl border border-white/10 shadow-2xl"
        />
        {/* Card 1 (Front) - Scanning Effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="absolute w-full h-full bg-gray-600 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center"
        >
           <div className="bg-gradient-to-br from-gray-800 to-black w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
               {isLoading && (
                 <motion.div 
                    className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 />
               )}
               
               {isLoading ? (
                  <ScanLine size={48} className="text-blue-400 mb-4 animate-pulse" />
               ) : (
                  <FolderOpen size={48} className="text-white/40 mb-4" />
               )}
               
               <p className="text-white/80 text-lg font-medium">
                 {isLoading ? loadingStatus : "开始整理"}
               </p>
               <p className="text-white/40 text-xs mt-2 px-4">
                 {isLoading ? "AI 正在分析您的图库..." : "随机抽取 20 张照片开始回顾"}
               </p>
           </div>
        </motion.div>
      </div>

      {/* Action Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoading ? 0.5 : 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onStart}
        disabled={isLoading}
        className="z-10 group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>处理中...</span>
          </>
        ) : (
          <>
            <span>开始整理</span>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Play size={14} fill="white" className="text-white ml-0.5" />
            </div>
          </>
        )}
      </motion.button>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-white/20 text-xs"
      >
        上划删除 · 下划收藏
      </motion.p>
    </div>
  );
};