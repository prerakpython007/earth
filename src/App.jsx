// src/App.jsx
import { useState, Suspense } from 'react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Earth from "./components/Earth"
import Moon from "./components/Moon"
import Starfield from "./components/Star"
import './App.css'

function App() {
  return (
    <div className="h-screen">
      <Canvas camera={{ position: [0, 0, 400], fov: 45 }}>
  <ambientLight intensity={0.1} />
<directionalLight
  position={[300, 100, 100]}
  intensity={0.8}
  color="#ffffff"
/>
  <Starfield />
  <OrbitControls 
    maxPolarAngle={Math.PI / 2} 
    minPolarAngle={Math.PI / 2}
  />
  <Suspense fallback={null}>
    <Earth />
    <Moon position={[120, 0, 0]} />
  </Suspense>
</Canvas>
    </div>
  )
}

export default App
