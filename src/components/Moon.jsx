import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Moon(props) {
  const { nodes } = useGLTF('/moon.gltf')
  const moonRef = useRef()

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/textures/Material.002_diffuse.jpeg', (texture) => {
      if (moonRef.current) {
        moonRef.current.material.map = texture
        moonRef.current.material.needsUpdate = true
      }
    })
  }, [])

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={moonRef}
        geometry={nodes.Sphere_Material002_0.geometry}
        material={new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1,
          metalness: 0.1,
          toneMapped: false,
        })}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={5}
      />
    </group>
  )
}

useGLTF.preload('/moon.gltf')
