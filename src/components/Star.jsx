import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Starfield({ count = 1000, radius = 100 }) {
  const starsRef = useRef()

  const softColors = ['#ffffff', '#ffe6cc', '#add8e6', '#ffccf9', '#ccffcc']

  const starData = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * (0.75 + 0.25 * Math.random())

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      const phase = Math.random() * Math.PI * 2
      const color = new THREE.Color(softColors[Math.floor(Math.random() * softColors.length)])

      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        emissive: color.clone().multiplyScalar(0.6),
        emissiveIntensity: 0.7,
      })

      data.push({ position: new THREE.Vector3(x, y, z), phase, material })
    }
    return data
  }, [count, radius])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005

      starsRef.current.children.forEach((star, i) => {
        const pulse = 0.75 + 0.25 * Math.sin(t * 2 + starData[i].phase)
        star.scale.setScalar(pulse)

        const opacity = 0.5 + 0.5 * Math.sin(t * 2 + starData[i].phase)
        if (star.material) {
          star.material.opacity = opacity
          star.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 2 + starData[i].phase)
        }
      })
    }
  })

  return (
    <group ref={starsRef}>
      {starData.map((data, i) => (
        <mesh key={i} position={data.position} material={data.material}>
          <sphereGeometry args={[0.1, 4, 4]} />
        </mesh>
      ))}
    </group>
  )
}
