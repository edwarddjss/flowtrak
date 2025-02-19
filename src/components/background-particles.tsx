import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return

    // Performance optimizations
    const pixelRatio = Math.min(window.devicePixelRatio, 2) // Cap pixel ratio
    const frustumSize = 1000
    const aspect = window.innerWidth / window.innerHeight
    
    // Scene setup with optimized parameters
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      2000
    )
    camera.position.z = 1000

    // Optimized renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable antialiasing for better performance
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Use InstancedMesh for better performance
    const particleCount = 500
    const geometry = new THREE.SphereGeometry(1, 4, 4) // Low poly spheres
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.InstancedMesh(geometry, material, particleCount)
    const dummy = new THREE.Object3D()
    const positions = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const radius = Math.random() * 500

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      speeds[i] = (Math.random() * 0.2 + 0.1) * (Math.random() < 0.5 ? 1 : -1)

      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      )
      dummy.updateMatrix()
      particles.setMatrixAt(i, dummy.matrix)
    }

    scene.add(particles)

    // Mouse interaction
    const mouse = new THREE.Vector2()
    const target = new THREE.Vector2()
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      target.lerp(mouse, 0.1)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Optimized animation loop
    let frameId: number
    let lastTime = 0
    const fpsInterval = 1000 / 30 // Cap at 30 FPS for better performance

    const animate = (currentTime: number) => {
      frameId = requestAnimationFrame(animate)

      // Throttle frame rate
      const elapsed = currentTime - lastTime
      if (elapsed < fpsInterval) return
      lastTime = currentTime - (elapsed % fpsInterval)

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        dummy.position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        )

        // Rotate around center based on mouse position
        dummy.position.applyAxisAngle(
          new THREE.Vector3(target.y, target.x, 0),
          speeds[i] * 0.01
        )

        // Update positions array
        positions[i * 3] = dummy.position.x
        positions[i * 3 + 1] = dummy.position.y
        positions[i * 3 + 2] = dummy.position.z

        dummy.updateMatrix()
        particles.setMatrixAt(i, dummy.matrix)
      }
      particles.instanceMatrix.needsUpdate = true

      // Render scene
      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight
      camera.left = frustumSize * aspect / -2
      camera.right = frustumSize * aspect / 2
      camera.top = frustumSize / 2
      camera.bottom = frustumSize / -2
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Start animation
    animate(0)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />
}
