import React, { useState, useEffect } from 'react'
import * as THREE from "three";
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

function color(value) {
  if (value < 0) {
    value = -value
  }
  if (value > 0 && value <= 3) {
    return { color: 0x006600 }
  }
  if (value > 3 && value <= 6) {
    return { color: 0xFFFF00 }
  }
  if (value > 6 && value <= 8) {
    return { color: 0xFF0000 }
  }
}

const scene = new THREE.Scene();
const loader = new GLTFLoader();

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
        options.push({ id: 3, label: "Container Left", value: x })
        setSelectedContainer("/media/3d/container/L/containerL.gltf")
        setCount(1)
        const geometry = new THREE.BoxGeometry(0.01, 2, 4.8);
        const material = new THREE.MeshBasicMaterial(color(x));

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(-0.80, -0.5, -2.5)
        scene.add(cube);
      }

      if (x < -0.5) {
        options.push({ id: 4, label: "Container Right", value: x })
        setSelectedContainer("/media/3d/container/R/containerR.gltf")
        setCount(1)
        const geometry = new THREE.BoxGeometry(0.01, 2, 4.8);
        const material = new THREE.MeshBasicMaterial(color(x));

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(1.27, -0.5, -2.5)
        scene.add(cube);
      }

      if (y > 0.5) {
        options.push({ id: 6, label: "Container Down", value: y })
        setSelectedContainer("/media/3d/container/D/containerD.gltf")
        setCount(1)

        const geometry = new THREE.BoxGeometry(2, 0.01, 4.8);
        const material = new THREE.MeshBasicMaterial(color(y));

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0.25, -1.6, -2.5)
        scene.add(cube);
      }

      if (y < -0.5) {
        options.push({ id: 5, label: "Container Top", value: y })
        setSelectedContainer("/media/3d/container/T/containerT.gltf")
        setCount(1)
        const geometry = new THREE.BoxGeometry(2, 0.01, 4.8);
        const material = new THREE.MeshBasicMaterial(color(y));

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0.25, 0.62, -2.5)
        scene.add(cube);
      }

      if (z > 0.5) {
        options.push({ id: 1, label: "Container Front", value: z })
        setSelectedContainer("/media/3d/container/F/containerF.gltf")
        setCount(1)

        const geometry = new THREE.BoxGeometry(1.9, 2, 0.01);
        const material = new THREE.MeshBasicMaterial(color(z));

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0.25, -0.5, -4.951)
        scene.add(cube);
      }

      if (z < -0.5) {
        options.push({ id: 2, label: "Container Back", value: z })
        setSelectedContainer("/media/3d/container/B/containerB.gltf")
        setCount(1)

        const geometry = new THREE.BoxGeometry(1.9, 2, 0.01);
        const material = new THREE.MeshBasicMaterial(color(z));

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0.25, -0.5, -0.031)
        scene.add(cube);

      }
    }
  }, []);

  const [selectedContainer, setSelectedContainer] = useState("/media/3d/container/R/containerR.gltf")
  const [values, setValues] = useState({ x: 0, y: 0, z: 0 })
  const [valuesReverse, setValuesReverse] = useState({ x: 0, y: 0, z: 0 })
  const [count, setCount] = useState(0)

  const draco = new DRACOLoader();
  draco.setDecoderConfig({ type: 'js' });
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(draco);

  // Load a glTF resource
  loader.load(
    selectedContainer,
    function (gltf) {
      if (count !== 0) {
        scene.add(gltf.scene);
      }
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
      <div>

        <span style={{ "margin": "5px", "background-color": "green", "width": "1.5rem", "height": "1.5rem", "display": "inline-block", " background-color": "green" }}>
        </span>
        <span >
          Interval: 0g - 3g
        </span>

        <span style={{ "margin": "5px", "background-color": "yellow", "width": "1.5rem", "height": "1.5rem", "display": "inline-block", " background-color": "yellow" }}>
        </span>
        <span >
          Interval: 3g - 6g
        </span>

        <span style={{ "margin": "5px", "background-color": "red", "width": "1.5rem", "height": "1.5rem", "display": "inline-block", " background-color": "red" }}>
        </span>
        <span >
          Interval: 6g - 8g
        </span>

      </div>

      <div key={selectedContainer} className='col-xl-11 ' style={{ height: '100vh' }}>
        <span style={{ margin: "4px" }}>
          Current Values: X: {values.x}  Y: {values.y}  Z: {values.z}
        </span>
        <Canvas camera={{ fov: 50 }} key={selectedContainer} >
          <ambientLight intensity={1} />
          <spotLight position={[20, 20, 20]} penumbra={1} />
          <pointLight position={[20, 20, 20]} />
          <spotLight position={[-20, -20, -20]} penumbra={1} />
          <pointLight position={[-20, -20, -20]} />
          <primitive object={Line(values.x, values.y, values.z, "#DD1C1C", 500)} />
          <primitive object={Line(valuesReverse.x, valuesReverse.y, valuesReverse.z, "#000000", 1)} />
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