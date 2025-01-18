import * as THREE from 'three'

// render
export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  return renderer
}
