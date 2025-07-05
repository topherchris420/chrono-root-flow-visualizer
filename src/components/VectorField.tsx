import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Vector3, BufferGeometry, Float32BufferAttribute, Group, Color } from 'three';
import { Line, Points } from '@react-three/drei';
import { useState, useEffect } from 'react';

interface VectorFieldProps {
  energyDensity: number;
  timeSync: number;
  spinDistribution: number;
}

export const VectorField = ({ energyDensity, timeSync, spinDistribution }: VectorFieldProps) => {
  const groupRef = useRef<Group>(null);
  const [vectorData, setVectorData] = useState<{
    positions: Float32Array;
    directions: Float32Array;
    magnitudes: Float32Array;
  }>({ positions: new Float32Array(0), directions: new Float32Array(0), magnitudes: new Float32Array(0) });

  // Generate 4D vector field data
  const generateVectorField = useMemo(() => {
    const gridSize = 8;
    const spacing = 2;
    const positions: number[] = [];
    const directions: number[] = [];
    const magnitudes: number[] = [];

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        for (let z = -gridSize; z <= gridSize; z += spacing) {
          // Position of vector
          positions.push(x, y, z);

          // Calculate chrono-spatial displacement vector
          const t = timeSync * 0.1;
          const r = Math.sqrt(x*x + y*y + z*z);
          
          // Riemann-Cartan geometry influence
          const curvature = Math.exp(-r * 0.1) * energyDensity;
          const torsion = Math.sin(r * 0.2 + t) * spinDistribution;
          
          // Vector direction influenced by spacetime curvature and torsion
          const dx = curvature * Math.cos(t + r * 0.1) + torsion * y;
          const dy = curvature * Math.sin(t + r * 0.1) - torsion * x;
          const dz = curvature * Math.cos(r * 0.15 + t) + torsion * 0.5;
          
          directions.push(dx, dy, dz);
          
          // Magnitude represents field strength
          const magnitude = Math.sqrt(dx*dx + dy*dy + dz*dz);
          magnitudes.push(magnitude);
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      directions: new Float32Array(directions),
      magnitudes: new Float32Array(magnitudes)
    };
  }, [energyDensity, timeSync, spinDistribution]);

  useEffect(() => {
    setVectorData(generateVectorField);
  }, [generateVectorField]);

  // Animate the vector field
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      
      // Subtle pulsing based on energy density
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * energyDensity;
      groupRef.current.scale.setScalar(scale);
    }
  });

  // Create vector arrows
  const vectorArrows = useMemo(() => {
    const arrows = [];
    const numVectors = vectorData.positions.length / 3;

    for (let i = 0; i < numVectors; i++) {
      const startPos = new Vector3(
        vectorData.positions[i * 3],
        vectorData.positions[i * 3 + 1],
        vectorData.positions[i * 3 + 2]
      );

      const direction = new Vector3(
        vectorData.directions[i * 3],
        vectorData.directions[i * 3 + 1],
        vectorData.directions[i * 3 + 2]
      );

      const magnitude = vectorData.magnitudes[i];
      const normalizedDir = direction.normalize().multiplyScalar(Math.min(magnitude * 2, 1.5));
      const endPos = startPos.clone().add(normalizedDir);

      // Color based on magnitude
      const color = new Color().setHSL(
        0.6 - magnitude * 0.4, // Blue to red based on magnitude
        0.8,
        0.5 + magnitude * 0.3
      );

      arrows.push({
        key: i,
        start: startPos,
        end: endPos,
        color: color,
        magnitude: magnitude
      });
    }

    return arrows;
  }, [vectorData]);

  return (
    <group ref={groupRef}>
      {/* Vector field lines */}
      {vectorArrows.map((arrow) => (
        <Line
          key={arrow.key}
          points={[arrow.start, arrow.end]}
          color={arrow.color}
          lineWidth={Math.max(arrow.magnitude * 3, 1)}
          transparent
          opacity={0.7}
        />
      ))}

      {/* Field points for better visualization */}
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={vectorData.positions}
            count={vectorData.positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={new Float32Array(vectorData.positions.length).map((_, i) => {
              const magnitude = vectorData.magnitudes[Math.floor(i / 3)] || 0;
              const hue = 0.6 - magnitude * 0.4;
              const color = new Color().setHSL(hue, 0.8, 0.6);
              return i % 3 === 0 ? color.r : i % 3 === 1 ? color.g : color.b;
            })}
            count={vectorData.positions.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </Points>

      {/* Geodesic lines representing curved spacetime */}
      <group>
        {Array.from({ length: 5 }, (_, i) => {
          const t = (i / 4) * Math.PI * 2;
          const radius = 8;
          const points = Array.from({ length: 50 }, (_, j) => {
            const s = (j / 49) * Math.PI * 2;
            const curvature = energyDensity * 0.5;
            return new Vector3(
              radius * Math.cos(s + t) + curvature * Math.sin(s * 3),
              radius * Math.sin(s + t) + curvature * Math.cos(s * 2),
              2 * Math.sin(s * 2 + t) + curvature * Math.sin(s)
            );
          });

          return (
            <Line
              key={`geodesic-${i}`}
              points={points}
              color="#00ffaa"
              lineWidth={2}
              transparent
              opacity={0.3}
            />
          );
        })}
      </group>
    </group>
  );
};