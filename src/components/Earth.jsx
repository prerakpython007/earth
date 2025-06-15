import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import Moon from './Moon'

export default function Model(props) {
  const group = useRef()
  const cloudRef = useRef()
  const earthRef = useRef()
  const textRefs = useRef([])
  const { camera } = useThree()

  const [scrollY, setScrollY] = useState(0)

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { nodes, materials, animations } = useGLTF('/earth.gltf', true)
  useAnimations(animations, group)

  useEffect(() => {
    const loader = new TextureLoader()

    loader.load('/Material.001_baseColor.jpg', (texture) => {
      if (materials['Material.001']) {
        materials['Material.001'].map = texture
        materials['Material.001'].metalness = 0.4
        materials['Material.001'].roughness = 0.3
        materials['Material.001'].emissive = new THREE.Color(0x000000)
        materials['Material.001'].needsUpdate = true
      }
    })

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

  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.04
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.015

    textRefs.current.forEach(ref => {
      if (ref) ref.lookAt(camera.position)
    })

    // Apply scroll parallax to group Y position
    if (group.current) {
      group.current.position.y = -scrollY * 0.0015 // Tune this multiplier
    }
  })

  // Text Label Positions (wrapped around)
  const labelNames = ['Africa', 'Asia', 'Australia']
  const radius = 7
  const textLabels = labelNames.map((text, i) => {
    const angle = (i / labelNames.length) * Math.PI * 2
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    return { text, position: [x, 0, z] }
  })

  return (
    <group ref={group} {...props} scale={4} dispose={null}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-10, 10, -10]} intensity={1.5} />
      <directionalLight position={[10, -10, -10]} intensity={1.5} />
      <directionalLight position={[-10, -10, 10]} intensity={1.5} />
      <directionalLight position={[0, 15, 0]} intensity={1.2} />
      <directionalLight position={[0, -15, 0]} intensity={1.2} />
      <directionalLight position={[15, 0, 0]} intensity={1.2} />
      <directionalLight position={[-15, 0, 0]} intensity={1.2} />

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
