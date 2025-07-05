import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Mesh, Group, Color, SphereGeometry, MeshBasicMaterial } from 'three';
import { Sphere } from '@react-three/drei';

interface TensorOverlayProps {
  type: 'ricci' | 'torsion' | 'divergence';
  intensity: number;
}

export const TensorOverlay = ({ type, intensity }: TensorOverlayProps) => {
  const groupRef = useRef<Group>(null);

  // Define colors for different tensor types
  const tensorColors = {
    ricci: '#ff6600', // Orange for Ricci curvature
    torsion: '#cc00ff', // Purple for torsion tensor
    divergence: '#00ff99' // Green for vector divergence
  };

  // Generate tensor field visualization points
  const tensorPoints = useMemo(() => {
    const points = [];
    const gridSize = 6;
    const spacing = 3;

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        for (let z = -gridSize; z <= gridSize; z += spacing) {
          const r = Math.sqrt(x*x + y*y + z*z);
          
          let tensorValue = 0;
          
          switch (type) {
            case 'ricci':
              // Ricci curvature tensor visualization
              tensorValue = Math.exp(-r * 0.2) * intensity * (1 + Math.sin(r * 0.5));
              break;
            case 'torsion':
              // Torsion tensor - antisymmetric component
              tensorValue = Math.sin(r * 0.3) * Math.cos(Math.atan2(y, x)) * intensity;
              break;
            case 'divergence':
              // Vector field divergence
              tensorValue = (x + y + z) / r * intensity * Math.exp(-r * 0.15);
              break;
          }

          if (Math.abs(tensorValue) > 0.1) {
            points.push({
              position: [x, y, z],
              value: tensorValue,
              size: Math.abs(tensorValue) * 0.5
            });
          }
        }
      }
    }

    return points;
  }, [type, intensity]);

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation and pulsing
      groupRef.current.rotation.x += 0.001;
      groupRef.current.rotation.z += 0.0005;
      
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {tensorPoints.map((point, index) => (
        <Sphere
          key={`${type}-${index}`}
          position={point.position as [number, number, number]}
          args={[point.size * 0.3, 8, 8]}
        >
          <meshBasicMaterial
            color={tensorColors[type]}
            transparent
            opacity={Math.min(Math.abs(point.value), 0.8)}
            wireframe={type === 'torsion'}
          />
        </Sphere>
      ))}

      {/* Tensor field lines for better visualization */}
      {type === 'ricci' && (
        <group>
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 5 + intensity * 2;
            
            return (
              <mesh
                key={`ricci-ring-${i}`}
                position={[
                  Math.cos(angle) * radius, 
                  0, 
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.1, 4, 4]} />
                <meshBasicMaterial
                  color={tensorColors.ricci}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Torsion spirals */}
      {type === 'torsion' && (
        <group>
          {Array.from({ length: 3 }, (_, spiralIndex) => (
            <group key={`torsion-spiral-${spiralIndex}`}>
              {Array.from({ length: 20 }, (_, pointIndex) => {
                const t = pointIndex / 19;
                const spiralRadius = 4 + spiralIndex;
                const height = (t - 0.5) * 10;
                const angle = t * Math.PI * 4 + spiralIndex * Math.PI / 3;
                
                return (
                  <mesh
                    key={pointIndex}
                    position={[
                      Math.cos(angle) * spiralRadius,
                      height,
                      Math.sin(angle) * spiralRadius
                    ]}
                  >
                    <sphereGeometry args={[0.05, 4, 4]} />
                    <meshBasicMaterial
                      color={tensorColors.torsion}
                      transparent
                      opacity={0.4 + t * 0.4}
                    />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>
      )}
    </group>
  );
};