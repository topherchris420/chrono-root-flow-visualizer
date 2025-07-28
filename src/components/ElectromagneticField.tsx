import React from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial } from 'three';

const vertexShader = `
  uniform float time;
  uniform float size;
  attribute float scale;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = scale * size * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 color;
  uniform float time;
  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    gl_FragColor = vec4(color, sin(time * 2.0) * 0.5 + 0.5);
  }
`;

interface ElectromagneticFieldProps {
  count: number;
  color: string;
}

export const ElectromagneticField = ({ count, color }: ElectromagneticFieldProps) => {
  const points = React.useRef<Points>(null!);
  const geometry = React.useMemo(() => {
    const geo = new BufferGeometry();
    const vertices = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      vertices[i * 3 + 0] = (Math.random() - 0.5) * 20;
      vertices[i * 3 + 1] = (Math.random() - 0.5) * 20;
      vertices[i * 3 + 2] = (Math.random() - 0.5) * 20;
      scales[i] = Math.random() * 5;
    }
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geo.setAttribute('scale', new Float32BufferAttribute(scales, 1));
    return geo;
  }, [count]);

  const material = React.useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        size: { value: 10 },
        color: { value: new (await import('three')).Color(color) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }, [color]);

  useFrame(({ clock }) => {
    (points.current.material as ShaderMaterial).uniforms.time.value = clock.getElapsedTime();
  });

  return <points ref={points} geometry={geometry} material={material} />;
};
