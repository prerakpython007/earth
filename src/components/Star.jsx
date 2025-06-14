import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Starfield({ count = 1000, radius = 100 }) {
  const starsRef = useRef()

  const starPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * (0.75 + 0.25 * Math.random())

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      positions.push(new THREE.Vector3(x, y, z))
    }
    return positions
  }, [count, radius])

  const starMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ffffff'),
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    })
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005
    }
  })

  return (
    <group ref={starsRef}>
      {starPositions.map((pos, i) => (
        <mesh key={i} position={pos} material={starMaterial}>
          <sphereGeometry args={[0.1, 4, 4]} />
        </mesh>
      ))}
    </group>
  )
}
