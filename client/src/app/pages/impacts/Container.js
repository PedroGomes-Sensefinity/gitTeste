import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Container(props) {
  const { nodes, materials } = useGLTF('/media/3d/container/container_b.gltf')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Container_UV_Shell001_0.geometry} material={materials['UV_Shell.001']} />
            <mesh geometry={nodes.Container_UV_Shell002_0.geometry} material={materials['UV_Shell.002']} />
            <mesh geometry={nodes.Container_UV_Shell003_0.geometry} material={materials['UV_Shell.003']} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/media/3d/container/container_b.gltf')
