import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { 
  OrbitControls, 
  Sphere, 
  Torus, 
  Box, 
  Icosahedron, 
  Octahedron, 
  Tetrahedron, 
  Cylinder, 
  Ring,
  Stars
} from '@react-three/drei'
import { Vector3 } from 'three'

function FloatingElement({ geometry: Geometry, position, rotationSpeed = 1, size = 1, color }) {
  const ref = useRef()
  const initialPosition = new Vector3(...position)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    ref.current.rotation.x = time * rotationSpeed * 0.5
    ref.current.rotation.y = time * rotationSpeed * 0.3
    ref.current.rotation.z = time * rotationSpeed * 0.2
    
    // Complex floating motion
    ref.current.position.y = initialPosition.y + Math.sin(time * 0.5) * 0.5
    ref.current.position.x = initialPosition.x + Math.cos(time * 0.3) * 0.3
    ref.current.position.z = initialPosition.z + Math.sin(time * 0.4) * 0.4
  })

  return (
    <Geometry
      ref={ref}
      position={position}
      scale={size}
    >
      <meshPhysicalMaterial
        color={color || `hsl(${Math.random() * 90 + 180}, 70%, 50%)`}
        transparent
        opacity={0.6}
        roughness={0.2}
        metalness={0.8}
        clearcoat={0.5}
        clearcoatRoughness={0.1}
      />
    </Geometry>
  )
}

function AnimatedElements() {
  const groupRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    groupRef.current.rotation.y = time * 0.05
  })

  const elements = [
    { Geometry: Sphere, count: 15, sizeRange: [0.2, 0.4] },
    { Geometry: Box, count: 12, sizeRange: [0.3, 0.5] },
    { Geometry: Torus, count: 8, sizeRange: [0.2, 0.4] },
    { Geometry: Icosahedron, count: 6, sizeRange: [0.3, 0.5] },
    { Geometry: Octahedron, count: 10, sizeRange: [0.2, 0.4] },
    { Geometry: Tetrahedron, count: 8, sizeRange: [0.3, 0.5] },
    { Geometry: Cylinder, count: 6, sizeRange: [0.2, 0.4] },
    { Geometry: Ring, count: 8, sizeRange: [0.4, 0.6] }
  ]

  return (
    <group ref={groupRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />

      {elements.map(({ Geometry, count, sizeRange }, elementIndex) =>
        [...Array(count)].map((_, i) => (
          <FloatingElement
            key={`${Geometry.name}-${i}`}
            geometry={Geometry}
            position={[
              Math.random() * 40 - 20,
              Math.random() * 40 - 20,
              Math.random() * 40 - 20
            ]}
            size={Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0]}
            rotationSpeed={Math.random() * 2 + 0.5}
            color={`hsl(${(elementIndex * 40 + Math.random() * 20) % 360}, 70%, 50%)`}
          />
        ))
      )}
    </group>
  )
}

function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 30], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <fog attach="fog" args={['#202030', 5, 50]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />
        <AnimatedElements />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

export default Background3D 