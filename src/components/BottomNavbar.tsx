import React, { useRef } from 'react';
import { Home, BookOpen, Wrench, Folder, Mail, FileText, Hexagon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';

function WireframeRobot() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00D1FF" wireframe />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 2, 8]} />
        <meshBasicMaterial color="#7B61FF" wireframe />
      </mesh>
      {/* Arms */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshBasicMaterial color="#4F7CFF" wireframe />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshBasicMaterial color="#4F7CFF" wireframe />
      </mesh>
    </group>
  );
}

export default function BottomNavbar() {
  const { activePanel, togglePanel, setActivePanel } = useUI();
  const { t } = useLanguage();

  const leftIcons = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: BookOpen, label: t('courses'), path: '/courses' },
    { icon: Wrench, label: t('services'), path: '/services' },
  ];

  const rightIcons = [
    { icon: Folder, label: t('projects'), path: '/projects' },
    { icon: Mail, label: t('contact'), path: '/contact' },
    { icon: FileText, label: t('resume'), path: '/resume' },
  ];

  const getTranslateY = (index: number, isLeft: boolean) => {
    if (isLeft) {
      if (index === 0) return 'translate-y-6';
      if (index === 1) return 'translate-y-3';
      return 'translate-y-0';
    } else {
      if (index === 0) return 'translate-y-0';
      if (index === 1) return 'translate-y-3';
      return 'translate-y-6';
    }
  };

  return (
    <>
      <div className="fixed bottom-[-10px] left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] max-w-5xl flex justify-center z-50 pointer-events-none">
        <div 
          className="w-full h-[90px] md:h-[110px] pointer-events-auto flex items-start pt-3 md:pt-5 justify-evenly px-2 md:px-10 relative glass-panel"
          style={{
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            transform: 'perspective(800px) rotateX(10deg)',
            transformOrigin: 'bottom center',
            borderBottom: 'none',
            boxShadow: '0 -10px 40px rgba(79,124,255,0.3), inset 0 10px 20px rgba(255,255,255,0.1)',
          }}
        >
          {/* Left Icons */}
          <div className="flex items-center gap-4 md:gap-16 mt-2">
            {leftIcons.map((item, i) => (
              <Link 
                key={i} 
                to={item.path} 
                onClick={() => setActivePanel('none')}
                className={`text-white/60 hover:text-white hover:scale-110 transition-all duration-300 flex flex-col items-center gap-1 group ${getTranslateY(i, true)}`}
              >
                <item.icon className="w-5 h-5 md:w-6 md:h-6 group-hover:drop-shadow-[0_0_10px_rgba(79,124,255,0.8)]" />
                <span className="text-[8px] md:text-[10px] font-medium tracking-wider hidden sm:block">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Center Button */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3">
            <button 
              onClick={() => togglePanel('video')}
              className="w-[60px] h-[60px] md:w-[75px] md:h-[75px] rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#7B61FF] flex items-center justify-center shadow-[0_0_40px_rgba(123,97,255,0.8)] hover:scale-110 transition-transform duration-300 border-2 border-white/20"
            >
              <Hexagon className="w-6 h-6 md:w-8 md:h-8 text-white fill-white/20" />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-16 mt-2">
            {rightIcons.map((item, i) => (
              <Link 
                key={i} 
                to={item.path} 
                onClick={() => setActivePanel('none')}
                className={`text-white/60 hover:text-white hover:scale-110 transition-all duration-300 flex flex-col items-center gap-1 group ${getTranslateY(i, false)}`}
              >
                <item.icon className="w-5 h-5 md:w-6 md:h-6 group-hover:drop-shadow-[0_0_10px_rgba(79,124,255,0.8)]" />
                <span className="text-[8px] md:text-[10px] font-medium tracking-wider hidden sm:block">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Video Panel */}
      <AnimatePresence>
        {activePanel === 'video' && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-[90px] md:bottom-[120px] left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-6xl max-h-[65dvh] glass-panel rounded-3xl z-40 flex flex-col md:flex-row items-center justify-between p-4 md:p-8 overflow-y-auto custom-scrollbar pointer-events-auto"
          >
            <button onClick={() => setActivePanel('none')} className="absolute top-4 right-4 text-white/50 hover:text-white z-50 bg-black/20 p-2 rounded-full">
              <X size={24} />
            </button>
            
            {/* Left Wireframe */}
            <div className="hidden md:block w-1/4 h-[300px] relative z-10">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <WireframeRobot />
              </Canvas>
            </div>

            {/* Center Video */}
            <div className="w-full md:w-1/2 h-[250px] md:h-[400px] rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(79,124,255,0.3)] relative group z-20 flex-shrink-0">
              <video 
                src="https://www.w3schools.com/html/mov_bbb.mp4" 
                autoPlay 
                loop 
                muted 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A3A]/80 to-transparent flex items-end justify-center pb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider">{t('videoTitle')}</h3>
              </div>
            </div>

            {/* Right Wireframe */}
            <div className="hidden md:block w-1/4 h-[300px] relative z-10">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <WireframeRobot />
              </Canvas>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
