import React, {Suspense, useState, useRef } from 'react'
import * as THREE from 'three'
import './Map.css'
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
        alert("clicked!")
      }}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <sphereGeometry args={[.08, 32]} />
      <meshStandardMaterial color={hovered ? 'red' : 'white'} />
    </mesh>
  )
}

function Map() {
  const locations = [{"lat":.50, "long":-.25}, {"lat":.20, "long":.25}];
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
          locations.map((train)=>
            <Box position={[train.lat, train.long, -.25]}/>)
        }
        <Box position={[.95,2,-.25]}/>
        <Model/>
      </Suspense>
    </Canvas>
    </React.Fragment>

  )
}

export default Map
