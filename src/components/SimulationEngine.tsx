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
            {/* Ambient and directional lighting for scientific visualization */}
            <ambientLight intensity={0.2} color="#00ccff" />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={0.5} 
              color="#ffffff"
              castShadow
            />
            <pointLight 
              position={[0, 0, 0]} 
              intensity={0.3} 
              color="#ff6600"
            />

            {/* Reference grid for spatial coordinates */}
            <Grid 
              args={[20, 20]} 
              cellSize={1} 
              cellThickness={0.5} 
              cellColor="#00ccff" 
              sectionSize={5} 
              sectionThickness={1} 
              sectionColor="#ff6600"
              fadeDistance={50}
              fadeStrength={1}
            />

            <group ref={groupRef}>
              {/* 4D Vector Field Visualization */}
              {fieldParameters && 
               !isNaN(fieldParameters.energyDensity) && 
               !isNaN(fieldParameters.timeSync) && 
               !isNaN(fieldParameters.spinDistribution) && (
                <VectorField 
                  energyDensity={fieldParameters.energyDensity}
                  timeSync={fieldParameters.timeSync}
                  spinDistribution={fieldParameters.spinDistribution}
                />
              )}

              {/* Tensor Overlays */}
              {tensorOverlays?.ricci && fieldParameters && !isNaN(fieldParameters.emFieldTorsion) && (
                <TensorOverlay 
                  type="ricci" 
                  intensity={fieldParameters.emFieldTorsion}
                />
              )}
              {tensorOverlays?.torsion && fieldParameters && !isNaN(fieldParameters.emFieldTorsion) && (
                <TensorOverlay 
                  type="torsion" 
                  intensity={fieldParameters.emFieldTorsion}
                />
              )}
              {tensorOverlays?.divergence && fieldParameters && !isNaN(fieldParameters.energyDensity) && (
                <TensorOverlay 
                  type="divergence" 
                  intensity={fieldParameters.energyDensity}
                />
              )}

              {/* Dynamic Resonance Rooting */}
              {drrSettings?.resonanceRoots && fieldParameters && !isNaN(fieldParameters.energyDensity) && (
                <ResonanceField 
                  adaptiveAnchors={Boolean(drrSettings.adaptiveAnchors)}
                  phaseTracking={Boolean(drrSettings.phaseTracking)}
                  fieldStrength={fieldParameters.energyDensity}
                />
              )}

              {/* Extended render components */}
              {renderExtensions}
            </group>

            {/* Orbital controls for navigation */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              dampingFactor={0.05}
              rotateSpeed={0.5}
              zoomSpeed={0.8}
            />

            {/* Performance statistics */}
            <Stats />
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
