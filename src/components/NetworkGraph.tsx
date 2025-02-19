'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

// Dynamically import Text component with no SSR
const Text = dynamic(() => import('@react-three/drei').then((mod) => mod.Text), {
  ssr: false
})

interface NodeData {
  id: string
  position: [number, number, number]
  color: string
  type: 'platform' | 'company' | 'you'
  scale?: number
}

interface ConnectionData {
  from: string
  to: string
  color: string
}

const nodes: NodeData[] = [
  { id: 'You', position: [0, 0, 0], color: '#ffffff', type: 'you', scale: 1.2 },
  { id: 'LinkedIn', position: [-2, 2, 0], color: '#0077b5', type: 'platform' },
  { id: 'Indeed', position: [2, 2, 0], color: '#2164f3', type: 'platform' },
  { id: 'Google', position: [-2.5, -1, 0], color: '#34a853', type: 'company' },
  { id: 'Meta', position: [2.5, -1, 0], color: '#1877f2', type: 'company' },
  { id: 'Amazon', position: [0, -2, 0], color: '#ff9900', type: 'company' },
]

const connections: ConnectionData[] = [
  { from: 'You', to: 'LinkedIn', color: '#0077b5' },
  { from: 'You', to: 'Indeed', color: '#2164f3' },
  { from: 'LinkedIn', to: 'Google', color: '#0077b5' },
  { from: 'Indeed', to: 'Meta', color: '#2164f3' },
  { from: 'LinkedIn', to: 'Amazon', color: '#0077b5' },
  { from: 'Indeed', to: 'Amazon', color: '#2164f3' },
]

function Node({ data }: { data: NodeData }) {
  const { position, color, id, type, scale = 1 } = data
  const meshRef = useRef<THREE.Mesh>(null)
  
  const { scaleSpring } = useSpring({
    scaleSpring: scale,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <group position={position}>
      <animated.mesh 
        ref={meshRef} 
        scale={scaleSpring.to(s => [s, s, s])}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </animated.mesh>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {id}
      </Text>
    </group>
  )
}

function Connection({ from, to, color }: ConnectionData) {
  const fromNode = nodes.find(n => n.id === from)
  const toNode = nodes.find(n => n.id === to)
  
  if (!fromNode || !toNode) return null

  const start = new THREE.Vector3(...fromNode.position)
  const end = new THREE.Vector3(...toNode.position)
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  mid.y += 0.5 // Add a slight curve

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end)

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

export function NetworkGraph() {
  return (
    <div className="w-full aspect-[16/9]">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {nodes.map((node) => (
          <Node key={node.id} data={node} />
        ))}
        
        {connections.map((conn, i) => (
          <Connection key={i} {...conn} />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={2}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
