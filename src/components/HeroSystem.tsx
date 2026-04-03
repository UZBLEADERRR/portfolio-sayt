import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, Html, Ring, OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';

interface PlanetProps {
  radius: number;
  speed: number;
  color: string;
  size: number;
  label: string;
  path: string;
  angleOffset: number;
}

function Planet({ radius, speed, color, size, label, path, angleOffset }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (clock.getElapsedTime() * speed) + angleOffset;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Line */}
      <Ring args={[radius - 0.02, radius + 0.02, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#4F7CFF" transparent opacity={0.15} side={THREE.DoubleSide} />
      </Ring>
      
      {/* Planet */}
      <mesh 
        position={[radius, 0, 0]} 
        onClick={(e) => { 
          e.stopPropagation(); 
          navigate(path); 
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.6} 
          roughness={0.2} 
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.1}
        />
        
        {/* Planet Label */}
        <Html position={[0, size + 0.3, 0]} center className="pointer-events-none">
          <div className={`px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border transition-colors duration-300 ${hovered ? 'border-white/50 text-white' : 'border-white/20 text-white/70'} text-[10px] font-bold whitespace-nowrap shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
            {label}
          </div>
        </Html>
      </mesh>
    </group>
  );
}

function SolarSystem({ t }: { t: (key: string) => string }) {
  const sunRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#FFD700" distance={100} decay={2} />
      
      {/* Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#FFD700" />
        {/* Sun Glow */}
        <Sphere args={[1.7, 32, 32]}>
          <meshBasicMaterial color="#FF8C00" transparent opacity={0.15} side={THREE.BackSide} />
        </Sphere>
        <Sphere args={[2.0, 32, 32]}>
          <meshBasicMaterial color="#FF4500" transparent opacity={0.05} side={THREE.BackSide} />
        </Sphere>
      </mesh>

      {/* Planets */}
      <Planet radius={3.5} speed={0.4} size={0.25} color="#00D1FF" label={t('projects')} path="/projects" angleOffset={0} />
      <Planet radius={5.5} speed={0.25} size={0.35} color="#7B61FF" label={t('services')} path="/services" angleOffset={Math.PI / 2} />
      <Planet radius={7.5} speed={0.15} size={0.3} color="#4F7CFF" label={t('courses')} path="/courses" angleOffset={Math.PI} />
      <Planet radius={9.5} speed={0.1} size={0.4} color="#FF4F7C" label={t('resume')} path="/resume" angleOffset={Math.PI * 1.5} />
      <Planet radius={11.5} speed={0.08} size={0.25} color="#00FFD1" label={t('contact')} path="/contact" angleOffset={Math.PI / 4} />
    </>
  );
}

export default function HeroSystem() {
  const { t } = useLanguage();
  
  return (
    <div className="absolute inset-0 w-full h-full bg-[#020611]">
      <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
        <color attach="background" args={['#020611']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
        <SolarSystem t={t} />
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
