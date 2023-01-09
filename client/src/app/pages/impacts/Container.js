import React, { useState } from 'react'
import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function Container(props) {

    const gltf = useLoader(GLTFLoader, props.file)


    return (
        <Canvas >
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} penumbra={1} />
            <pointLight position={[10, 10, 10]} />
            <spotLight position={[-10, -10, -10]} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            {/*<primitive object={Line(0, 0, 12, "#DD1C1C")} />*/}
            <Suspense fallback={null}>
                <primitive position={[0.30, -1.95, -3]} object={gltf.scene} />
            </Suspense>
            <OrbitControls />
        </Canvas>
    )
}
