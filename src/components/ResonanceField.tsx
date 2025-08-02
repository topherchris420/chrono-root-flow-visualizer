import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Group, Vector3, Color } from 'three';
import { Sphere, Line } from '@react-three/drei';
import { useState, useEffect } from 'react';

interface ResonanceFieldProps {
  adaptiveAnchors: boolean;
  phaseTracking: boolean;
  fieldStrength: number;
}

interface ResonanceRoot {
  id: number;
  position: Vector3;
  phase: number;
  stability: number;
  connections: number[];  
}

export const ResonanceField = ({ 
  adaptiveAnchors, 
  phaseTracking, 
  fieldStrength 
}: ResonanceFieldProps) => {
  const groupRef = useRef<Group>(null);
  const [resonanceRoots, setResonanceRoots] = useState<ResonanceRoot[]>([]);

  // Initialize resonance roots
  useEffect(() => {
    const roots: ResonanceRoot[] = [];
    const numRoots = Math.floor(4 + fieldStrength * 8);

    for (let i = 0; i < numRoots; i++) {
      const theta = (i / numRoots) * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 5;

      roots.push({
        id: i,
        position: new Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        phase: Math.random() * Math.PI * 2,
        stability: 0.5 + Math.random() * 0.5,
        connections: []
      });
    }

    // Create connections between nearby roots
    roots.forEach((root, i) => {
      roots.forEach((otherRoot, j) => {
        if (i !== j && root.position.distanceTo(otherRoot.position) < 6) {
          root.connections.push(j);
        }
      });
    });

    setResonanceRoots(roots);
  }, [fieldStrength]);

  // Animate resonance roots
  useFrame((state) => {
    if (groupRef.current && resonanceRoots.length > 0) {
      groupRef.current.rotation.y += 0.001;

      // Update resonance root positions if adaptive anchors are enabled
      if (adaptiveAnchors) {
        setResonanceRoots(prevRoots => 
          prevRoots.map(root => {
            const time = state.clock.elapsedTime;
            const phaseShift = phaseTracking ? Math.sin(time * 2 + root.phase) * 0.1 : 0;
            
            // Adaptive position based on field dynamics
            const adaptiveOffset = new Vector3(
              Math.sin(time * 0.5 + root.phase) * phaseShift,
              Math.cos(time * 0.7 + root.phase) * phaseShift,
              Math.sin(time * 0.3 + root.phase) * phaseShift
            );

            return {
              ...root,
              position: root.position.clone().add(adaptiveOffset),
              phase: root.phase + 0.01,
              stability: Math.max(0.2, root.stability + (Math.random() - 0.5) * 0.01)
            };
          })
        );
      }
    }
  });

  // Create resonance visualization
  const resonanceVisuals = useMemo(() => {
    return resonanceRoots.map(root => {
      const color = new Color().setHSL(
        0.15 + root.stability * 0.3, // Yellow to orange based on stability
        0.8,
        0.4 + root.stability * 0.3
      );

      return {
        ...root,
        color: color,
        size: 0.1 + root.stability * 0.2
      };
    });
  }, [resonanceRoots]);

  // Create connection lines between resonance roots
  const connectionLines = useMemo(() => {
    const lines = [];
    
    resonanceRoots.forEach((root, i) => {
      root.connections.forEach(connectionId => {
        if (connectionId > i) { // Avoid duplicate lines
          const connectedRoot = resonanceRoots[connectionId];
          if (connectedRoot) {
            const distance = root.position.distanceTo(connectedRoot.position);
            const strength = Math.max(0, 1 - distance / 8);
            
            if (strength > 0.1) {
              lines.push({
                key: `${i}-${connectionId}`,
                start: root.position,
                end: connectedRoot.position,
                strength: strength,
                stability: (root.stability + connectedRoot.stability) / 2
              });
            }
          }
        }
      });
    });

    return lines;
  }, [resonanceRoots]);

  return (
    <group ref={groupRef}>
      {/* Resonance roots */}
      {resonanceVisuals.map((root) => (
        <group key={root.id}>
          {/* Main resonance sphere */}
          <Sphere
            position={[root.position.x, root.position.y, root.position.z]}
            args={[root.size, 8, 8]}
          >
            <meshBasicMaterial
              color={root.color}
              transparent
              opacity={0.7}
            />
          </Sphere>

          {/* Resonance field visualization */}
          <Sphere
            position={[root.position.x, root.position.y, root.position.z]}
            args={[root.size * 3, 16, 16]}
          >
            <meshBasicMaterial
              color={root.color}
              transparent
              opacity={0.1}
              wireframe
            />
          </Sphere>

          {/* Phase tracking indicators */}
          {phaseTracking && (
            <group>
              {Array.from({ length: 6 }, (_, i) => {
                const angle = (i / 6) * Math.PI * 2 + root.phase;
                const radius = root.size * 2;
                
                return (
                  <Sphere
                    key={i}
                    position={[
                      root.position.x + Math.cos(angle) * radius,
                      root.position.y,
                      root.position.z + Math.sin(angle) * radius
                    ]}
                    args={[0.02, 4, 4]}
                  >
                    <meshBasicMaterial
                      color={root.color}
                      transparent
                      opacity={0.5}
                    />
                  </Sphere>
                );
              })}
            </group>
          )}
        </group>
      ))}

      {/* Connection lines between resonance roots */}
      {connectionLines.filter(line => 
        line && line.start && line.end && 
        typeof line.start.x === 'number' && typeof line.end.x === 'number'
      ).map((line) => (
        <Line
          key={line.key}
          points={[line.start, line.end]}
          color={new Color().setHSL(0.15 + line.stability * 0.3, 0.6, 0.5)}
          lineWidth={line.strength * 2}
          transparent
          opacity={line.strength * 0.6}
        />
      ))}

      {/* Dynamic resonance field waves */}
      {adaptiveAnchors && (
        <group>
          {Array.from({ length: 3 }, (_, waveIndex) => (
            <group key={`wave-${waveIndex}`}>
              {Array.from({ length: 20 }, (_, pointIndex) => {
                const t = pointIndex / 19;
                const waveRadius = 6 + waveIndex * 2;
                const angle = t * Math.PI * 2;
                const height = Math.sin(t * Math.PI * 4 + waveIndex) * 2;
                
                return (
                  <Sphere
                    key={pointIndex}
                    position={[
                      Math.cos(angle) * waveRadius,
                      height,
                      Math.sin(angle) * waveRadius
                    ]}
                    args={[0.03, 4, 4]}
                  >
                    <meshBasicMaterial
                      color="#ffaa00"
                      transparent
                      opacity={0.3 * fieldStrength}
                    />
                  </Sphere>
                );
              })}
            </group>
          ))}
        </group>
      )}
    </group>
  );
};