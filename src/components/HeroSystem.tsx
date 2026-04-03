import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, Html, Ring, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import type { PanelType } from '../context/UIContext';

interface PlanetProps {
  radius: number;
  speed: number;
  color: string;
  emissiveColor: string;
  size: number;
  label: string;
  panelId: PanelType;
  angleOffset: number;
  hasRing?: boolean;
  bumpScale?: number;
  onPlanetClick: (panelId: PanelType) => void;
}

// Procedural texture generator for realistic planet surfaces
function useProceduralTexture(baseColor: string, variant: number) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 256, 256);
    
    // Add noise/crater pattern
    const base = new THREE.Color(baseColor);
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 8 + 1;
      const brightness = 0.7 + Math.random() * 0.6;
      const color = base.clone().multiplyScalar(brightness);
      ctx.fillStyle = `rgb(${Math.floor(color.r*255)},${Math.floor(color.g*255)},${Math.floor(color.b*255)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add bands for gas giants
    if (variant > 2) {
      for (let i = 0; i < 12; i++) {
        const y = (i / 12) * 256;
        const alpha = 0.05 + Math.random() * 0.15;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(0, y, 256, 8 + Math.random() * 16);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, [baseColor, variant]);
}

function useBumpTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 5 + 0.5;
      const gray = Math.floor(Math.random() * 128 + 64);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
}

function Planet({ radius, speed, color, emissiveColor, size, label, panelId, angleOffset, hasRing, onPlanetClick }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const texture = useProceduralTexture(color, radius);
  const bumpTexture = useBumpTexture();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (clock.getElapsedTime() * speed) + angleOffset;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Line */}
      <Ring args={[radius - 0.02, radius + 0.02, 128]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#9B6DFF" transparent opacity={0.12} side={THREE.DoubleSide} />
      </Ring>
      
      {/* Planet */}
      <mesh 
        ref={planetRef}
        position={[radius, 0, 0]} 
        onClick={(e) => { 
          e.stopPropagation(); 
          onPlanetClick(panelId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
          metalness={0.3}
          roughness={0.6}
          emissive={emissiveColor}
          emissiveIntensity={hovered ? 0.8 : 0.15}
        />
        
        {/* Atmosphere glow */}
        <Sphere args={[size * 1.15, 32, 32]}>
          <meshBasicMaterial 
            color={emissiveColor} 
            transparent 
            opacity={hovered ? 0.25 : 0.08} 
            side={THREE.BackSide} 
          />
        </Sphere>

        {/* Atmosphere outer glow */}
        <Sphere args={[size * 1.35, 32, 32]}>
          <meshBasicMaterial 
            color={emissiveColor} 
            transparent 
            opacity={hovered ? 0.1 : 0.03} 
            side={THREE.BackSide} 
          />
        </Sphere>
        
        {/* Optional Ring */}
        {hasRing && (
          <Ring args={[size * 1.4, size * 2.2, 64]} rotation={[-Math.PI / 2.5, 0, 0]}>
            <meshBasicMaterial color={emissiveColor} transparent opacity={0.3} side={THREE.DoubleSide} />
          </Ring>
        )}
        
        {/* Planet Label */}
        <Html position={[0, size + 0.5, 0]} center className="pointer-events-none">
          <div className={`px-3 py-1 rounded-full backdrop-blur-md border transition-all duration-300 ${hovered ? 'border-[#C4A1FF]/60 text-white bg-[#9B6DFF]/30 shadow-[0_0_20px_rgba(155,109,255,0.5)] scale-110' : 'border-white/15 text-white/70 bg-black/40'} text-[10px] font-bold whitespace-nowrap`}>
            {label}
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// Animated twinkling star field
function TwinklingStars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const [positions, colors, sizes] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const purpleColors = [
      new THREE.Color('#C4A1FF'),
      new THREE.Color('#9B6DFF'),
      new THREE.Color('#7B61FF'),
      new THREE.Color('#E8D5FF'),
      new THREE.Color('#FFFFFF'),
    ];
    
    for (let i = 0; i < count; i++) {
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 150;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const color = purpleColors[Math.floor(Math.random() * purpleColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return [positions, colors, sizes];
  }, []);
  
  useFrame(({ clock }) => {
    if (starsRef.current) {
      const sizeAttr = starsRef.current.geometry.getAttribute('size') as THREE.BufferAttribute;
      const time = clock.getElapsedTime();
      for (let i = 0; i < sizes.length; i++) {
        sizeAttr.array[i] = sizes[i] * (0.6 + 0.4 * Math.sin(time * (0.5 + i * 0.001) + i));
      }
      sizeAttr.needsUpdate = true;
      starsRef.current.rotation.y = time * 0.005;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial 
        size={1.5} 
        vertexColors 
        transparent 
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Nebula clouds
function NebulaCloud({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.02;
      ref.current.material.opacity = 0.03 + Math.sin(clock.getElapsedTime() * 0.3) * 0.01;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[scale, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.04} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SolarSystem({ t, onPlanetClick }: { t: (key: string) => string; onPlanetClick: (panelId: PanelType) => void }) {
  const sunRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#C4A1FF" />
      <pointLight position={[0, 0, 0]} intensity={3} color="#C4A1FF" distance={100} decay={2} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#9B6DFF" distance={50} decay={2} />
      
      {/* Sun — Purple-Lavender */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#B388FF" />
        {/* Sun inner glow */}
        <Sphere args={[1.7, 32, 32]}>
          <meshBasicMaterial color="#9B6DFF" transparent opacity={0.2} side={THREE.BackSide} />
        </Sphere>
        {/* Sun mid glow */}
        <Sphere args={[2.2, 32, 32]}>
          <meshBasicMaterial color="#7B61FF" transparent opacity={0.1} side={THREE.BackSide} />
        </Sphere>
        {/* Sun outer glow */}
        <Sphere args={[3.0, 32, 32]}>
          <meshBasicMaterial color="#C4A1FF" transparent opacity={0.04} side={THREE.BackSide} />
        </Sphere>
      </mesh>

      {/* Nebula clouds */}
      <NebulaCloud position={[-30, 15, -40]} color="#7B61FF" scale={25} />
      <NebulaCloud position={[25, -10, -50]} color="#9B6DFF" scale={20} />
      <NebulaCloud position={[40, 20, -30]} color="#C4A1FF" scale={18} />

      {/* Planets */}
      <Planet radius={3.5} speed={0.35} size={0.3} color="#6C63FF" emissiveColor="#9B6DFF" label={t('projects')} panelId="page-projects" angleOffset={0} onPlanetClick={onPlanetClick} />
      <Planet radius={5.5} speed={0.22} size={0.45} color="#8B5CF6" emissiveColor="#A78BFA" label={t('services')} panelId="page-services" angleOffset={Math.PI / 2} hasRing onPlanetClick={onPlanetClick} />
      <Planet radius={7.5} speed={0.15} size={0.35} color="#7C3AED" emissiveColor="#8B5CF6" label={t('courses')} panelId="page-courses" angleOffset={Math.PI} onPlanetClick={onPlanetClick} />
      <Planet radius={9.5} speed={0.1} size={0.5} color="#DDD6FE" emissiveColor="#C4B5FD" label={t('resume')} panelId="page-resume" angleOffset={Math.PI * 1.5} hasRing onPlanetClick={onPlanetClick} />
      <Planet radius={11.5} speed={0.07} size={0.3} color="#A78BFA" emissiveColor="#C4A1FF" label={t('contact')} panelId="page-contact" angleOffset={Math.PI / 4} onPlanetClick={onPlanetClick} />
    </>
  );
}

export default function HeroSystem() {
  const { t } = useLanguage();
  const { setActivePanel } = useUI();
  
  const handlePlanetClick = (panelId: PanelType) => {
    setActivePanel(panelId);
  };
  
  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0d0520 40%, #0a0515 70%, #050210 100%)' }}>
      <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
        <fog attach="fog" args={['#0a0515', 50, 200]} />
        <TwinklingStars />
        <Stars radius={200} depth={100} count={8000} factor={3} saturation={0.8} fade speed={1.5} />
        <SolarSystem t={t} onPlanetClick={handlePlanetClick} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={5} 
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 + 0.2} 
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
