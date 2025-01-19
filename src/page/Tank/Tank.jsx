import { useEffect, useRef } from 'react'
import { tankProcess } from '../../utils/index'

import './index.css'

function Tank() {
  const tankCanvas = useRef(null)
  useEffect(() => {
    const canvas = tankCanvas.current
    tankProcess(canvas)
  }, [])
  return (
    <div className="Tank">
      <canvas ref={tankCanvas} id="tankCanvas"></canvas>
      <div id="info"></div>
    </div>
  )
}

export default Tank
