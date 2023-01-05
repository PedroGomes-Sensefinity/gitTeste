import React, { useState }  from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Container from './Container'
import { OrbitControls } from '@react-three/drei'
import * as THREE from "three";
import { useFormik } from 'formik';

function Line(x, y ,z, color ){
  const material = new THREE.LineBasicMaterial( { color: color, linewidth: 50 } );
  const points = [];
  points.push( new THREE.Vector3(0 ,0, 0 ) );
  points.push( new THREE.Vector3(x,y,z) );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const line = new THREE.Line( geometry, material );
  return line
}

export function Impacts() {
  const [linePos, setLinePos] = useState({x:0,y:0,z:0})

  const formik = useFormik({
    initialValues: {
      x: 0,
      y: 0,
      z: 0,
    },
    onSubmit: values => {
      setLinePos({x:values.y,y:-values.x,z:values.z})
    },
  });

  const style = {"height": '100vh'}
  const stylePad = {"margin": '10px'}
  return (
    <div className='row'>
      <div className='col-xl-9 ' style={{height: '100vh'}}>
        
        <Canvas>       
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[10, 10, 10]} />
            <primitive object={Line(linePos.x,linePos.y,linePos.z, "#DD1C1C")} />
            <primitive object={new THREE.AxesHelper(1)} />
            <Suspense fallback={null}>
                <Container position={[0.25, -1.85, -3]} />
            </Suspense>
            <OrbitControls />
          </Canvas>
      </div>
      <div className='col-xl-3 form'  >
        <form className='card card-custom'  onSubmit={formik.handleSubmit}>
          <h2 style={{"textAlign": "center"}}>Convert Device Coordinates</h2>
            <label style={stylePad} htmlFor="x">X:</label>
              <input
                id="x"
                name="x"
                type="number"
                style={stylePad}
                onChange={formik.handleChange}
                value={formik.values.x}
              />
              <label style={stylePad} htmlFor="y">Y:</label>
              <input
                id="y"
                name="y"
                type="number"
                style={stylePad}
                onChange={formik.handleChange}
                value={formik.values.y}
              />
              <label style={stylePad} htmlFor="z">Z:</label>
              <input
                id="z"
                name="z"
                type="number"
                style={stylePad}
                onChange={formik.handleChange}
                value={formik.values.z}
              />
              <h3 style={{"textAlign": "center"}}>Result:</h3>
              <h3 style={{"color": "#F1BA21", "textAlign": "center"}}>X: {linePos.x}</h3>
              <h3 style={{"color": "#327536", "textAlign": "center"}}>Y: {linePos.y}</h3>
              <h3 style={{"color": "#2A3BB3", "textAlign": "center"}}>Z: {linePos.z}</h3>
            <button style={stylePad}  className='btn btn-success mr-2' type="submit">Submit</button>

        </form>
        </div>
    </div>
  )
}