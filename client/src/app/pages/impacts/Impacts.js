import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import React, { useState, useEffect } from 'react'
import * as THREE from "three";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Suspense } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { injectIntl } from "react-intl";

function Line(x, y, z, color, lineW) {
  const material = new THREE.LineBasicMaterial({ color: color, linewidth: lineW });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(x, y, z));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line
}

export function Impacts(props) {
  useEffect(() => {
    const url = window.location.href
    let decodedUrl = unescape(url)
    const myArray = decodedUrl.split("?");
    if (myArray.length === 2) {
      const params = new URLSearchParams(myArray[1]);
      let x = params.get('x');
      let y = params.get('y');
      let z = params.get('z');
      let paramObj = {};
      let paramObjReverse = {};
      for (var value of params.keys()) {
        paramObj[value] = params.get(value);
        paramObjReverse[value] = -params.get(value);
      }
      console.log(paramObj)
      setValues(paramObj)
      setValuesReverse(paramObjReverse)
      const options = []
      if (x > 0.5) {
        options.push({ id: 3, label: "Container Left" })
        setSelectedContainer("/media/3d/container/L/containerL.gltf")
        setSelectedOption(3)
      }

      if (x < -0.5) {
        options.push({ id: 4, label: "Container Right" })
        setSelectedContainer("/media/3d/container/R/containerL.gltf")
        setSelectedOption(4)
      }

      if (y > 0.5) {
        options.push({ id: 6, label: "Container Down" })
        setSelectedContainer("/media/3d/container/D/containerD.gltf")
        setSelectedOption(6)
      }

      if (y < -0.5) {
        options.push({ id: 5, label: "Container Top" })
        setSelectedContainer("/media/3d/container/T/containerT.gltf")
        setSelectedOption(5)
      }

      if (z > 0.5) {
        options.push({ id: 1, label: "Container Front" })
        setSelectedContainer("/media/3d/container/F/containerF.gltf")
        setSelectedOption(1)
      }

      if (z < -0.5) {
        options.push({ id: 2, label: "Container Back" })
        setSelectedContainer("/media/3d/container/B/containerB.gltf")
        setSelectedOption(2)
      }
      setViewOptions(options)
    }
  }, []);

  const [viewOptions, setViewOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedContainer, setSelectedContainer] = useState("/media/3d/container/R/containerR.gltf")
  const [values, setValues] = useState({ x: 0, y: 0, z: 0 })
  const [valuesReverse, setValuesReverse] = useState({ x: 0, y: 0, z: 0 })
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
      <div className='col-sm-6 form'  >
        <FormControl style={{ margin: "15px", width: "20em"}}>
          <InputLabel id="select-container">Impact detected probably on the following Faces:</InputLabel>
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
          <primitive object={Line(values.x, values.y, values.z, "#DD1C1C", 100)} />
          <primitive object={Line(valuesReverse.x, valuesReverse.y, valuesReverse.z, "#000000", 2)} />
          <Suspense fallback={null}>
            <primitive object={scene} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>

  )
}

export default injectIntl(Impacts);