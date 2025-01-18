import { useEffect, useRef } from 'react'
import './App.css'
import { renderProcess, renderSunProcess } from './utils'

function App() {
  const threeCanvas = useRef(null)
  useEffect(() => {
    const canvas = threeCanvas.current
    // 正方体
    // renderProcess(canvas)
    // 太阳
    renderSunProcess(canvas)
  }, [])
  return (
    <div className="App">
      <canvas ref={threeCanvas} id="threeCanvas"></canvas>
    </div>
  )
}

export default App
