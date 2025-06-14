import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'

export default function Model(props) {
  const group = useRef()
  const cloudRef = useRef()
  const earthRef = useRef() // Ref for the inner Earth
  const { nodes, materials, animations } = useGLTF('/earth.gltf', true)
  useAnimations(animations, group)

  useEffect(() => {
    const loader = new TextureLoader()

    // Earth texture
    loader.load('/Material.001_baseColor.jpg', (texture) => {
      if (materials['Material.001']) {
        materials['Material.001'].map = texture
        materials['Material.001'].metalness = 0.4
        materials['Material.001'].roughness = 0.3
        materials['Material.001'].emissive = new THREE.Color(0x000000)
        materials['Material.001'].needsUpdate = true
      }
    })

    // Cloud texture
    loader.load('/textures/Material.002_baseColor.jpeg', (texture) => {
      if (materials['Material.002']) {
        materials['Material.002'].map = texture
        materials['Material.002'].transparent = true
        materials['Material.002'].opacity = 0.35
        materials['Material.002'].depthWrite = false
        materials['Material.002'].side = THREE.DoubleSide
        materials['Material.002'].needsUpdate = true
      }
    })
  }, [materials])

  // Animate rotation
  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.04 // faster
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.015 // slower than clouds
  })

  return (
    <group ref={group} {...props} scale={4} dispose={null}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[10, -10, -10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[0, 15, 0]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[0, -15, 0]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[15, 0, 0]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-15, 0, 0]} intensity={1.2} color="#ffffff" />

      {/* Earth & Clouds */}
      <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
        <group name="root">
          <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Sphere_1" rotation={[0, Math.PI / 5, 0]} scale={4.499} ref={earthRef}>
              <mesh
                geometry={nodes.Object_4.geometry}
                material={materials['Material.001']}
              />
            </group>
            <group name="Sphere001_2" scale={4.565} ref={cloudRef}>
              <mesh
                geometry={nodes.Object_6.geometry}
                material={materials['Material.002']}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/earth.gltf')
