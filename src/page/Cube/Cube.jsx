import { useEffect, useRef } from 'react'
import { renderCubeProcess, tankProcess } from '../../utils/index'

import './cube.css'

function Tank() {
  const cubeCanvas = useRef(null)
  useEffect(() => {
    const canvas = cubeCanvas.current
    renderCubeProcess(canvas)
    // tankProcess(canvas)
  }, [])
  return (
    <div className="Tank">
      <canvas ref={cubeCanvas} id="cubeCanvas"></canvas>
      <div id="info"></div>
    </div>
  )
}

export default Tank
