import { useState , Suspense } from 'react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Earth from "./components/Earth"
import './App.css'
import Starfield from './components/Star'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Canvas>
      <Starfield/>
      <ambientLight intensity={100} />
      <OrbitControls/>
      <Suspense fallback={null}>
        <Earth/>
      </Suspense>
      </Canvas>
    </>
  )
}

export default App
