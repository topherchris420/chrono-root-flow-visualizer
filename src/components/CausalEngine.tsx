
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Group, Vector3, Color, CatmullRomCurve3 } from 'three';
import { Line, Sphere, Tube } from '@react-three/drei';

interface CausalLoop {
  id: string;
  path: Vector3[];
  strength: number;
  temporalPhase: number;
  retrocausalFactor: number;
  echoDepth: number;
}

interface TorsionAnomaly {
  id: string;
  position: Vector3;
  intensity: number;
  radius: number;
  creationTime: number;
}

interface CausalEngineProps {
  fieldParameters: {
    energyDensity: number;
    timeSync: number;
    emFieldTorsion: number;
  };
  causalSettings: {
    retrocausalStrength: number;
    loopStability: number;
    anomalyDensity: number;
  };
  onCausalDataUpdate: (data: any) => void;
}

export const CausalEngine = ({
  fieldParameters,
  causalSettings,
  onCausalDataUpdate
}: CausalEngineProps) => {
  const groupRef = useRef<Group>(null);
  const [causalLoops, setCausalLoops] = useState<CausalLoop[]>([]);
  const [torsionAnomalies, setTorsionAnomalies] = useState<TorsionAnomaly[]>([]);
  const [feedbackMatrix, setFeedbackMatrix] = useState<number[][]>([]);

  // Initialize causal loops
  useEffect(() => {
    const initialLoops: CausalLoop[] = [];

    for (let i = 0; i < 3; i++) {
      const loop: CausalLoop = {
        id: `loop-${i}`,
        path: generateLoopPath(i),
        strength: 0.5 + Math.random() * 0.5,
        temporalPhase: Math.random() * Math.PI * 2,
        retrocausalFactor: causalSettings.retrocausalStrength,
        echoDepth: Math.floor(Math.random() * 5) + 1
      };
      initialLoops.push(loop);
    }

    setCausalLoops(initialLoops);
  }, [causalSettings.retrocausalStrength]);

  // Generate causal loop paths
  function generateLoopPath(index: number): Vector3[] {
    const points: Vector3[] = [];
    const radius = 3 + index * 2;
    const height = index * 1.5;

    for (let t = 0; t <= Math.PI * 2; t += Math.PI / 8) {
      const x = Math.cos(t) * radius + Math.sin(t * 3) * 0.5;
      const y = Math.sin(t) * radius + Math.cos(t * 2) * 0.5;
      const z = height + Math.sin(t * 4) * 0.3;
      points.push(new Vector3(x, y, z));
    }

    // Close the loop - ensure we have points before cloning
    if (points.length > 0) {
      points.push(points[0].clone());
    }
    return points;
  }

  // Retrocausal feedback computation
  const computeFeedbackMatrix = useMemo(() => {
    const size = causalLoops.length;
    const matrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));

    causalLoops.forEach((loop1, i) => {
      causalLoops.forEach((loop2, j) => {
        if (i !== j && loop1?.path?.length > 0 && loop2?.path?.length > 0) {
          const avgDistance = loop1.path.reduce((sum, point1) => {
            if (!point1 || !loop2.path) return sum;
            const validPoints = loop2.path.filter(point2 => point2 && typeof point2.distanceTo === 'function');
            if (validPoints.length === 0) return sum;
            const minDist = Math.min(...validPoints.map(point2 => point1.distanceTo(point2)));
            return sum + minDist;
          }, 0) / loop1.path.length;

          const feedback = Math.exp(-avgDistance * 0.1) *
                          (loop1.retrocausalFactor || 0) *
                          (loop2.retrocausalFactor || 0) *
                          causalSettings.retrocausalStrength;

          matrix[i][j] = feedback;
        }
      });
    });

    return matrix;
  }, [causalLoops, causalSettings.retrocausalStrength]);

  // Real-time causal anomaly generation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;

      // Update causal loops with retrocausal feedback
      setCausalLoops(prevLoops =>
        prevLoops.map((loop, index) => {
          const feedbackInfluence = computeFeedbackMatrix[index]?.reduce((sum, val) => sum + val, 0) || 0;
          const temporalDrift = Math.sin(time * 0.1 + loop.temporalPhase) * 0.1;

          return {
            ...loop,
            strength: Math.max(0.1, Math.min(1.0, loop.strength + feedbackInfluence * 0.01)),
            temporalPhase: loop.temporalPhase + temporalDrift + feedbackInfluence * 0.02
          };
        })
      );

      // Generate torsion anomalies
      if (Math.random() < causalSettings.anomalyDensity * 0.02) {
        const newAnomaly: TorsionAnomaly = {
          id: `anomaly-${Date.now()}`,
          position: new Vector3(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 8
          ),
          intensity: Math.random() * fieldParameters.emFieldTorsion,
          radius: 0.5 + Math.random() * 2,
          creationTime: time
        };

        setTorsionAnomalies(prev => [...prev, newAnomaly].slice(-10));
      }

      // Update torsion anomalies
      setTorsionAnomalies(prevAnomalies =>
        prevAnomalies.map(anomaly => ({
          ...anomaly,
          intensity: anomaly.intensity * 0.995, // Gradual decay
          radius: anomaly.radius + 0.01 // Gradual expansion
        })).filter(anomaly => anomaly.intensity > 0.01)
      );
    }

    // Send causal data updates
    if (onCausalDataUpdate) {
      onCausalDataUpdate({
        loopCount: causalLoops.length,
        averageStrength: causalLoops.reduce((sum, loop) => sum + loop.strength, 0) / causalLoops.length,
        feedbackMatrix: computeFeedbackMatrix,
        anomalyCount: torsionAnomalies.length,
        retrocausalEnergy: causalLoops.reduce((sum, loop) => sum + loop.retrocausalFactor, 0)
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Causal loop visualizations */}
      {causalLoops.map((loop) => (
        <group key={loop.id}>
          {/* Main causal loop path */}
          <Line
            points={loop.path}
            color={new Color().setHSL(0.8 - loop.strength * 0.3, 0.9, 0.5 + loop.strength * 0.3)}
            lineWidth={loop.strength * 4}
            transparent
            opacity={0.7 + loop.strength * 0.3}
          />

          {/* Echo loops for retrocausal visualization */}
          {Array.from({ length: loop.echoDepth }, (_, echoIndex) => {
            const echoStrength = loop.strength * Math.pow(0.7, echoIndex + 1);
            const echoPath = loop.path.map(point =>
              point.clone().multiplyScalar(1 + (echoIndex + 1) * 0.1)
            );

            return (
              <Line
                key={`echo-${echoIndex}`}
                points={echoPath}
                color={new Color().setHSL(0.8, 0.6, echoStrength)}
                lineWidth={echoStrength * 2}
                transparent
                opacity={echoStrength * 0.5}
              />
            );
          })}

          {/* Loop nodes for phase tracking */}
          {loop.path.slice(0, -1).map((point, pointIndex) => {
            const phaseIntensity = Math.sin(pointIndex * 0.5 + loop.temporalPhase) * 0.5 + 0.5;

            return (
              <Sphere
                key={`node-${pointIndex}`}
                position={[point.x, point.y, point.z]}
                args={[0.05 + phaseIntensity * 0.1, 6, 6]}
              >
                <meshBasicMaterial
                  color={new Color().setHSL(0.8, 0.9, phaseIntensity)}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
            );
          })}
        </group>
      ))}

      {/* Torsion anomalies */}
      {torsionAnomalies.map((anomaly) => (
        <group key={anomaly.id}>
          {/* Anomaly core */}
          <Sphere
            position={[anomaly.position.x, anomaly.position.y, anomaly.position.z]}
            args={[anomaly.radius * 0.3, 8, 8]}
          >
            <meshBasicMaterial
              color={new Color().setHSL(0.05, 1.0, anomaly.intensity)}
              transparent
              opacity={anomaly.intensity}
            />
          </Sphere>

          {/* Distortion field */}
          <Sphere
            position={[anomaly.position.x, anomaly.position.y, anomaly.position.z]}
            args={[anomaly.radius, 16, 16]}
          >
            <meshBasicMaterial
              color={new Color().setHSL(0.05, 0.8, 0.3)}
              transparent
              opacity={anomaly.intensity * 0.2}
              wireframe
            />
          </Sphere>
        </group>
      ))}

      {/* Feedback visualization between loops */}
      {causalLoops.map((loop1, i) =>
        causalLoops.map((loop2, j) => {
          if (i >= j) return null;

          const feedbackStrength = computeFeedbackMatrix[i]?.[j] || 0;
          if (feedbackStrength < 0.1) return null;

          const midpoint1 = loop1.path[Math.floor(loop1.path.length / 2)];
          const midpoint2 = loop2.path[Math.floor(loop2.path.length / 2)];

          return (
            <Line
              key={`feedback-${i}-${j}`}
              points={[midpoint1, midpoint2]}
              color={new Color().setHSL(0.9, 0.8, feedbackStrength)}
              lineWidth={feedbackStrength * 2}
              transparent
              opacity={feedbackStrength * 0.6}
            />
          );
        })
      )}
    </group>
  );
};
