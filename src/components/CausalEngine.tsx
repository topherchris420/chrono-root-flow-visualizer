import React from 'react';
import { HypersonicThreat } from './HypersonicThreat';
import { Vector3 } from 'three';

interface CausalEngineProps {
  hypersonicThreat: {
    visible: boolean;
  };
}

export const CausalEngine = ({ hypersonicThreat }: CausalEngineProps) => {
  return (
    <group>
      {hypersonicThreat.visible && (
        <HypersonicThreat
          initialPosition={new Vector3(-10, 10, 0)}
          initialVelocity={new Vector3(5, 0, 0)}
        />
      )}
    </group>
  );
};
