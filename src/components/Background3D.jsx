import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, forwardRef } from 'react'
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
  Stars,
  Trail,
  PointMaterial,
  RoundedBox,
  TorusKnot,
  useGLTF
} from '@react-three/drei'
import { Vector3, Color, MathUtils, Quaternion } from 'three'

// Animated Knot Component
const AnimatedKnot = forwardRef(({ position, scale = 1 }, ref) => {
  const localRef = useRef()
  const actualRef = ref || localRef
  const color = useMemo(() => new Color().setHSL(Math.random(), 0.7, 0.5), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    actualRef.current.rotation.x = t * 0.3
    actualRef.current.rotation.y = t * 0.2
    actualRef.current.scale.x = scale * (1 + Math.sin(t) * 0.1)
    actualRef.current.scale.y = scale * (1 + Math.sin(t + 1) * 0.1)
    actualRef.current.scale.z = scale * (1 + Math.sin(t + 2) * 0.1)
  })

  return (
    <TorusKnot ref={actualRef} position={position} args={[1, 0.3, 128, 16]}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        clearcoat={1}
        transparent
        opacity={0.8}
      />
    </TorusKnot>
  )
})

// Floating Element Component
const FloatingElement = forwardRef(({ geometry: Geometry, position, rotationSpeed = 1, size = 1, color }, ref) => {
  const localRef = useRef()
  const actualRef = ref || localRef
  const initialPosition = new Vector3(...position)
  const randomOffset = useMemo(() => Math.random() * 1000, [])
  const wobbleSpeed = useMemo(() => Math.random() * 2 + 1, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + randomOffset
    
    actualRef.current.rotation.x = time * rotationSpeed * 0.5 + Math.sin(time * wobbleSpeed) * 0.2
    actualRef.current.rotation.y = time * rotationSpeed * 0.3 + Math.cos(time * wobbleSpeed) * 0.2
    actualRef.current.rotation.z = time * rotationSpeed * 0.2 + Math.sin(time * wobbleSpeed + Math.PI) * 0.2
    
    actualRef.current.position.x = initialPosition.x + Math.sin(time * 0.4) * 2 * Math.cos(time * 0.3)
    actualRef.current.position.y = initialPosition.y + Math.sin(time * 0.3) * 2 * Math.sin(time * 0.2)
    actualRef.current.position.z = initialPosition.z + Math.sin(time * 0.5) * 2
    
    const breathingScale = size * (1 + Math.sin(time * 2) * 0.1)
    actualRef.current.scale.set(breathingScale, breathingScale, breathingScale)
  })

  return (
    <Trail
      width={2}
      length={8}
      color={new Color(color).multiplyScalar(0.6)}
      attenuation={(t) => t * t}
    >
      <Geometry
        ref={actualRef}
        position={position}
        scale={size}
      >
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
          toneMapped={false}
        />
      </Geometry>
    </Trail>
  )
})

function ParticleField() {
  const count = 500
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return positions
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] += Math.sin(time + i) * 0.01
      positions[i3 + 1] += Math.cos(time + i) * 0.01
      positions[i3 + 2] += Math.sin(time + i) * 0.01
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  )
}

// Spiral Animation Component
const SpiralAnimation = forwardRef(({ radius = 5, height = 10 }, ref) => {
  const points = useMemo(() => {
    const temp = []
    for(let i = 0; i < 100; i++) {
      const t = i / 100
      const angle = t * Math.PI * 4
      temp.push(
        new Vector3(
          radius * Math.cos(angle),
          height * (t - 0.5),
          radius * Math.sin(angle)
        )
      )
    }
    return temp
  }, [radius, height])

  const sphereRefs = useRef([])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    points.forEach((point, i) => {
      if (sphereRefs.current[i]) {
        const offset = i * 0.1
        const sphere = sphereRefs.current[i]
        sphere.position.x = point.x + Math.sin(time + offset) * 0.5
        sphere.position.y = point.y + Math.cos(time + offset) * 0.5
        sphere.position.z = point.z + Math.sin(time + offset) * 0.5
        sphere.scale.setScalar(0.3 + Math.sin(time * 2 + offset) * 0.1)
      }
    })
  })

  return points.map((point, i) => (
    <Sphere
      key={i}
      ref={el => sphereRefs.current[i] = el}
      position={[point.x, point.y, point.z]}
      args={[0.1, 8, 8]}
    >
      <meshPhysicalMaterial
        color={new Color().setHSL(i / points.length, 0.8, 0.5)}
        transparent
        opacity={0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  ))
})

// Vortex Animation Component
const VortexAnimation = forwardRef(({ count = 50, radius = 8 }, ref) => {
  const particles = useRef([])
  const group = useRef()

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    particles.current.forEach((particle, i) => {
      const angle = (i / count) * Math.PI * 2 + time
      const height = Math.cos(time * 0.5 + i) * 5
      particle.position.x = Math.cos(angle) * (radius + Math.sin(time + i) * 2)
      particle.position.y = height
      particle.position.z = Math.sin(angle) * (radius + Math.sin(time + i) * 2)
      particle.rotation.x = time * 0.5
      particle.rotation.y = time * 0.3
    })
    group.current.rotation.y = time * 0.1
  })

  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, i) => (
        <Octahedron
          key={i}
          ref={el => particles.current[i] = el}
          args={[0.2]}
          position={[0, 0, 0]}
        >
          <meshPhysicalMaterial
            color={new Color().setHSL(i / count, 0.8, 0.5)}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </Octahedron>
      ))}
    </group>
  )
})

// Wave Animation Component
const WaveAnimation = forwardRef(({ width = 10, height = 10, segments = 20 }, ref) => {
  const points = useMemo(() => {
    const temp = []
    for(let x = 0; x < segments; x++) {
      for(let z = 0; z < segments; z++) {
        temp.push(new Vector3(
          (x / segments - 0.5) * width,
          0,
          (z / segments - 0.5) * height
        ))
      }
    }
    return temp
  }, [width, height, segments])

  const sphereRefs = useRef([])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    points.forEach((point, i) => {
      if (sphereRefs.current[i]) {
        const sphere = sphereRefs.current[i]
        sphere.position.y = Math.sin(time * 2 + point.x + point.z) * 2
        sphere.scale.setScalar(0.2 + Math.sin(time + i) * 0.1)
      }
    })
  })

  return points.map((point, i) => (
    <Sphere
      key={i}
      ref={el => sphereRefs.current[i] = el}
      position={[point.x, point.y, point.z]}
      args={[0.1, 8, 8]}
    >
      <meshPhysicalMaterial
        color={new Color().setHSL((point.x + point.z) / (width + height), 0.8, 0.5)}
        transparent
        opacity={0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  ))
})

function AnimatedElements() {
  const groupRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    groupRef.current.rotation.y = time * 0.05
    groupRef.current.rotation.x = Math.sin(time * 0.025) * 0.1
  })

  const elements = [
    { Geometry: Sphere, count: 20, sizeRange: [0.2, 0.4] },
    { Geometry: Box, count: 15, sizeRange: [0.3, 0.5] },
    { Geometry: Torus, count: 12, sizeRange: [0.2, 0.4] },
    { Geometry: Icosahedron, count: 10, sizeRange: [0.3, 0.5] },
    { Geometry: Octahedron, count: 15, sizeRange: [0.2, 0.4] },
    { Geometry: Tetrahedron, count: 12, sizeRange: [0.3, 0.5] },
    { Geometry: Cylinder, count: 10, sizeRange: [0.2, 0.4] },
    { Geometry: Ring, count: 12, sizeRange: [0.4, 0.6] },
    { Geometry: RoundedBox, count: 8, sizeRange: [0.3, 0.5] }
  ]

  return (
    <group ref={groupRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={7000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1.5}
      />
      
      <ParticleField />
      
      {/* Add new animations */}
      <SpiralAnimation />
      <VortexAnimation />
      <WaveAnimation />

      {/* Keep existing elements */}
      <AnimatedKnot position={[5, 5, 0]} scale={0.5} />
      <AnimatedKnot position={[-5, -5, 0]} scale={0.3} />

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
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
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