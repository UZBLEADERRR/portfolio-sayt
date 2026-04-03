import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Ring, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useUI } from '../context/UIContext';
import type { PanelType } from '../context/UIContext';

// Procedural texture for realistic planet surfaces
function useProceduralTexture(baseColor: string, variant: number) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);
    
    const base = new THREE.Color(baseColor);
    
    // Surface details - craters & terrain
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 12 + 1;
      const brightness = 0.5 + Math.random() * 0.8;
      const color = base.clone().multiplyScalar(brightness);
      ctx.fillStyle = `rgb(${Math.floor(color.r*255)},${Math.floor(color.g*255)},${Math.floor(color.b*255)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Gas giant bands
    if (variant > 2) {
      for (let i = 0; i < 16; i++) {
        const y = (i / 16) * 512;
        const alpha = 0.05 + Math.random() * 0.2;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(0, y, 512, 6 + Math.random() * 20);
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
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 6 + 0.5;
      const gray = Math.floor(Math.random() * 128 + 64);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
}

interface PlanetProps {
  radius: number;
  speed: number;
  color: string;
  emissiveColor: string;
  size: number;
  panelId: PanelType;
  angleOffset: number;
  hasRing?: boolean;
  tilt?: number;
  onPlanetClick: (panelId: PanelType) => void;
}

function Planet({ radius, speed, color, emissiveColor, size, panelId, angleOffset, hasRing, tilt = 0.1, onPlanetClick }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  
  const texture = useProceduralTexture(color, radius);
  const bumpTexture = useBumpTexture();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = (clock.getElapsedTime() * speed) + angleOffset;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.008;
      planetRef.current.rotation.x = tilt;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Line */}
      <Ring args={[radius - 0.02, radius + 0.02, 128]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#9B6DFF" transparent opacity={0.08} side={THREE.DoubleSide} />
      </Ring>
      
      {/* Planet - NO labels */}
      <mesh 
        ref={planetRef}
        position={[radius, 0, 0]} 
        onClick={(e) => { e.stopPropagation(); onPlanetClick(panelId); }}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          bumpMap={bumpTexture}
          bumpScale={0.08}
          metalness={0.2}
          roughness={0.7}
          emissive={emissiveColor}
          emissiveIntensity={0.2}
        />
        
        {/* Atmosphere */}
        <Sphere args={[size * 1.12, 32, 32]}>
          <meshBasicMaterial color={emissiveColor} transparent opacity={0.1} side={THREE.BackSide} />
        </Sphere>
        <Sphere args={[size * 1.3, 32, 32]}>
          <meshBasicMaterial color={emissiveColor} transparent opacity={0.04} side={THREE.BackSide} />
        </Sphere>
        
        {/* Ring */}
        {hasRing && (
          <Ring args={[size * 1.4, size * 2.4, 64]} rotation={[-Math.PI / 2.5, 0, 0]}>
            <meshBasicMaterial color={emissiveColor} transparent opacity={0.25} side={THREE.DoubleSide} />
          </Ring>
        )}
      </mesh>
    </group>
  );
}

// Twinkling stars
function TwinklingStars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const [positions, colors, sizes] = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const starColors = [
      new THREE.Color('#C4A1FF'), new THREE.Color('#9B6DFF'),
      new THREE.Color('#7B61FF'), new THREE.Color('#E8D5FF'),
      new THREE.Color('#FFFFFF'),
    ];
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 150;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 2.5 + 0.5;
    }
    
    return [positions, colors, sizes];
  }, []);
  
  useFrame(({ clock }) => {
    if (starsRef.current) {
      const sizeAttr = starsRef.current.geometry.getAttribute('size') as THREE.BufferAttribute;
      const time = clock.getElapsedTime();
      for (let i = 0; i < sizes.length; i++) {
        sizeAttr.array[i] = sizes[i] * (0.5 + 0.5 * Math.sin(time * (0.5 + i * 0.001) + i));
      }
      sizeAttr.needsUpdate = true;
      starsRef.current.rotation.y = time * 0.003;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={1.5} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Nebula clouds
function NebulaCloud({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.02;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.03 + Math.sin(clock.getElapsedTime() * 0.3) * 0.01;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[scale, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.04} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SolarSystem({ onPlanetClick }: { onPlanetClick: (panelId: PanelType) => void }) {
  const sunRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#C4A1FF" />
      <pointLight position={[0, 0, 0]} intensity={4} color="#C4A1FF" distance={100} decay={2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#9B6DFF" distance={50} decay={2} />
      <directionalLight position={[-5, 8, 5]} intensity={0.4} color="#E8D5FF" />
      
      {/* Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#B388FF" />
        <Sphere args={[1.7, 32, 32]}>
          <meshBasicMaterial color="#9B6DFF" transparent opacity={0.2} side={THREE.BackSide} />
        </Sphere>
        <Sphere args={[2.2, 32, 32]}>
          <meshBasicMaterial color="#7B61FF" transparent opacity={0.1} side={THREE.BackSide} />
        </Sphere>
        <Sphere args={[3.0, 32, 32]}>
          <meshBasicMaterial color="#C4A1FF" transparent opacity={0.04} side={THREE.BackSide} />
        </Sphere>
      </mesh>

      {/* Nebula */}
      <NebulaCloud position={[-30, 15, -40]} color="#7B61FF" scale={25} />
      <NebulaCloud position={[25, -10, -50]} color="#9B6DFF" scale={20} />
      <NebulaCloud position={[40, 20, -30]} color="#C4A1FF" scale={18} />

      {/* Planets — NO labels */}
      <Planet radius={3.5} speed={0.35} size={0.4} color="#6C63FF" emissiveColor="#9B6DFF" panelId="page-projects" angleOffset={0} tilt={0.2} onPlanetClick={onPlanetClick} />
      <Planet radius={5.5} speed={0.22} size={0.55} color="#8B5CF6" emissiveColor="#A78BFA" panelId="page-services" angleOffset={Math.PI / 2} hasRing tilt={0.15} onPlanetClick={onPlanetClick} />
      <Planet radius={7.5} speed={0.15} size={0.4} color="#7C3AED" emissiveColor="#8B5CF6" panelId="page-courses" angleOffset={Math.PI} tilt={0.3} onPlanetClick={onPlanetClick} />
      <Planet radius={9.5} speed={0.1} size={0.6} color="#DDD6FE" emissiveColor="#C4B5FD" panelId="page-resume" angleOffset={Math.PI * 1.5} hasRing tilt={0.1} onPlanetClick={onPlanetClick} />
      <Planet radius={11.5} speed={0.07} size={0.35} color="#A78BFA" emissiveColor="#C4A1FF" panelId="page-contact" angleOffset={Math.PI / 4} tilt={0.25} onPlanetClick={onPlanetClick} />
    </>
  );
}

export default function HeroSystem() {
  const { setActivePanel } = useUI();
  
  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0d0520 40%, #0a0515 70%, #050210 100%)' }}>
      <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
        <fog attach="fog" args={['#0a0515', 50, 200]} />
        <TwinklingStars />
        <SolarSystem onPlanetClick={setActivePanel} />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          rotateSpeed={0.4} 
          minDistance={10} 
          maxDistance={60} 
          maxPolarAngle={Math.PI / 1.8} 
          minPolarAngle={Math.PI / 6}
          enablePan={true}
          panSpeed={0.5}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
