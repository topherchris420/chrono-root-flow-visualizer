import { Canvas } from '@react-three/fiber';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization delay for physics engine
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-full h-full bg-card/50 backdrop-blur-sm border-border/50">
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="font-scientific text-sm text-muted-foreground">
                Initializing Riemann-Cartan Framework...
              </span>
            </div>
          </div>
        )}
        
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

              {/* Parameter-responsive objects with safe defaults */}
              <mesh position={[0, 2, 0]}>
                <sphereGeometry args={[
                  Math.max(0.2, Math.abs(fieldParameters?.energyDensity || 1) * 0.5 + 0.5), 
                  16, 
                  16
                ]} />
                <meshBasicMaterial 
                  color={fieldParameters?.energyDensity > 0 ? "orange" : "purple"}
                />
              </mesh>

              {/* Orbiting objects based on spin */}
              {Array.from({ length: Math.max(1, Math.abs(fieldParameters?.spinDistribution || 1) * 3 + 2) }, (_, i) => {
                const angle = (i / 5) * Math.PI * 2;
                const radius = 4;
                return (
                  <mesh 
                    key={i}
                    position={[
                      Math.cos(angle) * radius,
                      0,
                      Math.sin(angle) * radius
                    ]}
                  >
                    <sphereGeometry args={[0.2, 8, 8]} />
                    <meshBasicMaterial color="yellow" />
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
