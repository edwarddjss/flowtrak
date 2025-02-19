'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Scene({ isHovered, scrollProgress }: { isHovered: boolean; scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [rotationSpeed] = useState(() => THREE.MathUtils.randFloat(0.1, 0.4))

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * rotationSpeed
      meshRef.current.rotation.y = state.clock.getElapsedTime() * rotationSpeed * 0.5

      // Distortion based on scroll
      const material = meshRef.current.material as any
      if (material.distort) {
        material.distort = 0.3 + scrollProgress * 0.5
      }
    }
  })

  const { scale } = useSpring({
    scale: isHovered ? 1.2 : 1,
    config: { mass: 2, tension: 170, friction: 26 }
  })

  return (
    <animated.mesh ref={meshRef} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#2a2a2a"
        roughness={0.1}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.1}
        radius={1}
        distort={0.3}
      />
    </animated.mesh>
  )
}

export default function HeroScene() {
  const [hovered, setHovered] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.5
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Scene isHovered={hovered} scrollProgress={scrollProgress} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
