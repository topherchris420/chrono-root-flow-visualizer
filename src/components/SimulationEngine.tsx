import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Stats } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Vector3, Group } from 'three';
import { VectorField } from './VectorField';
import { TensorOverlay } from './TensorOverlay';
import { ResonanceField } from './ResonanceField';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SimulationEngineProps {
  fieldParameters: {
    energyDensity: number;
    spinDistribution: number;
    emFieldTorsion: number;
    timeSync: number;
  };
  tensorOverlays: {
    ricci: boolean;
    torsion: boolean;
    divergence: boolean;
  };
  drrSettings: {
    resonanceRoots: boolean;
    adaptiveAnchors: boolean;
    phaseTracking: boolean;
  };
  renderExtensions?: React.ReactNode;
}

export const SimulationEngine = ({ 
  fieldParameters, 
  tensorOverlays, 
  drrSettings,
  renderExtensions 
}: SimulationEngineProps) => {
  const groupRef = useRef<Group>(null);

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the entire simulation
      groupRef.current.rotation.y += 0.01;
      
      // Make the group pulse based on energy density
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * (fieldParameters?.energyDensity || 1) * 0.3;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Card className="w-full h-full bg-card/50 backdrop-blur-sm border-border/50">
      <div className="relative w-full h-full">
        
        <Canvas
          camera={{ 
            position: [10, 10, 10], 
            fov: 50,
            near: 0.1,
            far: 1000 
          }}
          className="w-full h-full"
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            {/* Basic lighting only */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />

            <group ref={groupRef}>
              {/* Always visible test objects */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="red" wireframe />
              </mesh>

              <mesh position={[3, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="blue" />
              </mesh>

              <mesh position={[-3, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
                <meshBasicMaterial color="green" />
              </mesh>

              {/* DRAMATIC parameter-responsive objects */}
              <mesh position={[0, 2, 0]}>
                <sphereGeometry args={[
                  Math.max(0.1, Math.abs(fieldParameters?.energyDensity || 1) * 2 + 0.5), 
                  16, 
                  16
                ]} />
                <meshBasicMaterial 
                  color={fieldParameters?.energyDensity > 0 ? "#ff4400" : "#8800ff"}
                />
              </mesh>

              {/* Many orbiting objects that change dramatically with spin */}
              {Array.from({ length: Math.max(1, Math.floor(Math.abs(fieldParameters?.spinDistribution || 1) * 10 + 3)) }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 3 + Math.abs(fieldParameters?.timeSync || 1) * 0.5;
                return (
                  <mesh 
                    key={i}
                    position={[
                      Math.cos(angle) * radius,
                      Math.sin(i) * (fieldParameters?.emFieldTorsion || 1),
                      Math.sin(angle) * radius
                    ]}
                  >
                    <sphereGeometry args={[0.1 + Math.abs(fieldParameters?.spinDistribution || 0) * 0.3, 8, 8]} />
                    <meshBasicMaterial color={`hsl(${i * 40}, 80%, 60%)`} />
                  </mesh>
                );
              })}

              {/* Field rings that change with EM Field Torsion */}
              {Array.from({ length: Math.max(1, Math.floor(Math.abs(fieldParameters?.emFieldTorsion || 1) * 3)) }, (_, i) => {
                const radius = 1 + i * 0.8;
                return (
                  <mesh 
                    key={`ring-${i}`}
                    position={[0, 0, 0]}
                    rotation={[Math.PI / 2, 0, i * Math.PI / 4]}
                  >
                    <ringGeometry args={[radius, radius + 0.1, 16]} />
                    <meshBasicMaterial 
                      color={`hsl(${120 + i * 60}, 100%, 50%)`}
                      transparent
                      opacity={0.7}
                    />
                  </mesh>
                );
              })}
            </group>

            {/* Basic orbit controls */}
            <OrbitControls />
          </Suspense>
        </Canvas>

        {/* Overlay UI for field information */}
        <div className="absolute top-4 left-4 font-scientific text-xs text-primary/80 space-y-1">
          <div>Energy Density: {fieldParameters.energyDensity.toFixed(3)}</div>
          <div>Spin Distribution: {fieldParameters.spinDistribution.toFixed(3)}</div>
          <div>EM Field Torsion: {fieldParameters.emFieldTorsion.toFixed(3)}</div>
          <div>Time Sync: {fieldParameters.timeSync.toFixed(3)}</div>
        </div>

        {/* Coordinate system indicator */}
        <div className="absolute bottom-4 right-4 font-scientific text-xs text-muted-foreground">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="text-vector-field">X</div>
            <div className="text-tensor-overlay">Y</div>
            <div className="text-resonance-root">Z</div>
            <div className="text-accent">τ</div>
          </div>
          <div className="text-center mt-1 text-[10px]">
            Spacetime Manifold Coordinates
          </div>
        </div>
      </div>
    </Card>
  );
};
