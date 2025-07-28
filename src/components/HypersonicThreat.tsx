import React from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Vector3, Color } from 'three';
import { Line, Sphere, Tube } from '@react-three/drei';

interface HypersonicThreatProps {
  initialPosition: Vector3;
  initialVelocity: Vector3;
}

export const HypersonicThreat = ({ initialPosition, initialVelocity }: HypersonicThreatProps) => {
  const [position, setPosition] = React.useState(initialPosition);
  const [velocity, setVelocity] = React.useState(initialVelocity);
  const [path, setPath] = React.useState<Vector3[]>([]);

  useFrame((state, delta) => {
    // Simple physics simulation for the hypersonic missile
    const newPosition = position.clone().add(velocity.clone().multiplyScalar(delta));
    const newVelocity = velocity.clone().add(new Vector3(0, -0.1 * delta, 0)); // Gravity

    setPosition(newPosition);
    setVelocity(newVelocity);
    setPath(prevPath => [...prevPath, newPosition]);
  });

  const predictedPath = React.useMemo(() => {
    const points: Vector3[] = [];
    let currentPosition = position.clone();
    let currentVelocity = velocity.clone();

    for (let i = 0; i < 100; i++) {
      const newPosition = currentPosition.clone().add(currentVelocity.clone().multiplyScalar(0.1));
      const newVelocity = currentVelocity.clone().add(new Vector3(0, -0.1 * 0.1, 0)); // Gravity
      points.push(newPosition);
      currentPosition = newPosition;
      currentVelocity = newVelocity;
    }

    return new CatmullRomCurve3(points);
  }, [position, velocity]);

  return (
    <group>
      {/* Missile */}
      <Sphere position={position} args={[0.2, 16, 16]}>
        <meshBasicMaterial color="red" />
      </Sphere>

      {/* Actual Path */}
      <Line points={path} color="white" lineWidth={2} />

      {/* Predicted Path */}
      <Tube args={[predictedPath, 100, 0.05, 8, false]}>
        <meshBasicMaterial color="yellow" transparent opacity={0.5} />
      </Tube>
    </group>
  );
};
