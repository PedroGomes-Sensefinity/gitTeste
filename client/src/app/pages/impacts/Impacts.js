import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import React, { useState } from 'react'
import * as THREE from "three";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Suspense } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Line(x, y, z, color) {
  const material = new THREE.LineBasicMaterial({ color: color, linewidth: 100 });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(x, y, z));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line
}

export function Impacts(props) {
  console.log(props)
  const viewOptions = [
    { id: 1, label: "Container Front" },
    { id: 2, label: "Container Back" },
    { id: 3, label: "Container Left" },
    { id: 4, label: "Container Right" },
    { id: 5, label: "Container Top" },
    { id: 6, label: "Container Down" },
  ]
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedContainer, setSelectedContainer] = useState("/media/3d/container/R/containerR.gltf")

  function onChangeOption(e) {
    setSelectedOption(e.target.value);
    switch (e.target.value) {
      case 1:
        setSelectedContainer("/media/3d/container/F/containerF.gltf")
        break
      case 2:
        setSelectedContainer("/media/3d/container/B/containerB.gltf")
        break
      case 3:
        setSelectedContainer("/media/3d/container/L/containerL.gltf")
        break
      case 4:
        setSelectedContainer("/media/3d/container/R/containerR.gltf")
        break
      case 5:
        setSelectedContainer("/media/3d/container/T/containerT.gltf")
        break
      case 6:
        setSelectedContainer("/media/3d/container/D/containerD.gltf")
        break
    }

  }
  const scene = new THREE.Scene();
  const loader = new GLTFLoader();

  const draco = new DRACOLoader();
  draco.setDecoderConfig({ type: 'js' });
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(draco);

  // Load a glTF resource
  loader.load(
    selectedContainer,
    function (gltf) {
      scene.add(gltf.scene);
    },
    // loading is progressing
    function (xhr) {
      console.log("Loading...");
    },
    // error
    function (error) {
      console.log('An error happened');
    }
  );

  return (
    <div className='row'>
      <div className='col-xl-1 form'  >
        <FormControl style={{ margin: "15px" }}>
          <InputLabel id="select-container">Container Impact</InputLabel>
          <Select labelId="select-container" value={selectedOption} onChange={onChangeOption}>
            {viewOptions.map(c => (
              <MenuItem value={c.id}>{c.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div key={selectedContainer} className='col-xl-11 ' style={{ height: '100vh' }}>
        <Canvas camera={{ fov: 50 }} key={selectedContainer} >
          <ambientLight intensity={1} />
          <spotLight position={[20, 20, 20]} penumbra={1} />
          <pointLight position={[20, 20, 20]} />
          <spotLight position={[-20, -20, -20]} penumbra={1} />
          <pointLight position={[-20, -20, -20]} />
          <primitive object={Line(props.y, -props.x, props.z, "#DD1C1C")} />
          <Suspense fallback={null}>
            <primitive object={scene} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>

  )
}