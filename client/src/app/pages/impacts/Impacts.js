import React, { useState } from 'react'
import * as THREE from "three";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Container from './Container'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Line(x, y, z, color) {
  const material = new THREE.LineBasicMaterial({ color: color, linewidth: 50 });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(x, y, z));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line
}


export function Impacts() {

  const [linePos, setLinePos] = useState({ x: 0, y: 0, z: 0 })
  const viewOptions = [
    { id: 1, label: "Container Front" },
    { id: 2, label: "Container Back" },
    { id: 3, label: "Container Left" },
    { id: 4, label: "Container Right" },
    { id: 5, label: "Container Top" },
    { id: 6, label: "Container Down" },
  ]
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedContainer, setSelectedContainer] = useState(<Container file={"/media/3d/container/F/containerF.gltf"}></Container>)

  function onChangeOption(e) {
    setSelectedOption(e.target.value);
    console.log(e.target.value)
    switch (e.target.value) {
      case 1:
        setSelectedContainer(<Container file={"/media/3d/container/F/containerF.gltf"}></Container>)
        break
      case 2:
        setSelectedContainer(<Container file={"/media/3d/container/B/containerB.gltf"}></Container>)
        break
      case 3:
        setSelectedContainer(<Container file={"/media/3d/container/L/containerL.gltf"}></Container>)
        break
      case 4:
        setSelectedContainer(<Container file={"/media/3d/container/R/containerR.gltf"}></Container>)
        break
      case 5:
        setSelectedContainer(<Container file={"/media/3d/container/T/containerT.gltf"}></Container>)
        break
      case 6:
        setSelectedContainer(<Container file={"/media/3d/container/D/containerD.gltf"}></Container>)
        break
    }

  }

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
        {selectedContainer}
      </div>
    </div>

  )
}
