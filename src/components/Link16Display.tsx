import React from 'react';
import { Sphere } from '@react-three/drei';
import { Vector3 } from 'three';

interface Link16DisplayProps {
  data: any[];
}

export const Link16Display = ({ data }: Link16DisplayProps) => {
  return (
    <group>
      {data.map(track => (
        <Sphere
          key={track.id}
          position={new Vector3(
            (track.position.lon / 180) * 10,
            (track.altitude / 10000) * 10,
            (track.position.lat / 90) * 10
          )}
          args={[0.1, 8, 8]}
        >
          <meshBasicMaterial color="cyan" />
        </Sphere>
      ))}
    </group>
  );
};
