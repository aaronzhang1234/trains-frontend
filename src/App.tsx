import React, {Suspense, useState, useRef } from 'react'
import * as THREE from 'three'
import './App.css'
import {Canvas, useFrame, ThreeElements, useLoader} from '@react-three/fiber'
import {Environment, OrbitControls} from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Model() {
  const gltf = useLoader(GLTFLoader, "./CTA_COMPLETE_COLOR.glb");
  return(
    <>
      <primitive object={gltf.scene} scale={1}/>
    </>
  )
}

function Box(props: ThreeElements['mesh']){
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => {
        console.log(event)
      }}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <sphereGeometry args={[.08, 32]} />
      <meshStandardMaterial color={hovered ? 'red' : 'white'} />
    </mesh>
  )
}

function App() {
  const locations = [
  {"lat": 41.966099, "long":-87.709426},
  {"lat": 41.939562, "long":-87.653345},
]
  return (
    <React.Fragment>
    <Canvas style={{width:"100vw"}}>
      <ambientLight intensity={Math.PI / 2} />
      <Suspense fallback={null}>
        <OrbitControls
          enablePan= {false}
          maxDistance= {10.0}
        />
        {
          locations.map((train)=> {
            let lat = (train.lat - 41.893185) * -19.7119071783;
            let long = (train.long + 87.75289) * 50.7119071783;
            console.log(lat)
            console.log(long)
            return <Box position={[lat, long, -.25]}/>;
          })
        }
        <Box position={[0,0,-.25]}/>
        <Model/>
      </Suspense>
    </Canvas>
    </React.Fragment>

  )
}

export default App

.047