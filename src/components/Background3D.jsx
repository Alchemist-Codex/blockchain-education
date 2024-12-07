import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls, Sphere } from '@react-three/drei'

function AnimatedSpheres() {
  const groupRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    groupRef.current.rotation.y = time * 0.1
  })

  return (
    <group ref={groupRef}>
      {[...Array(50)].map((_, i) => (
        <Sphere
          key={i}
          position={[
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            Math.random() * 20 - 10
          ]}
          scale={Math.random() * 0.2 + 0.1}
        >
          <meshStandardMaterial
            color={`hsl(${Math.random() * 90 + 180}, 70%, 50%)`}
            transparent
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  )
}

function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedSpheres />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate />
      </Canvas>
    </div>
  )
}

export default Background3D 