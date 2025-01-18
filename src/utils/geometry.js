import * as THREE from 'three'

// 正方体
export function createGeometry() {
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  return geometry
}

// 球体
export function createSphereGeometry() {
  const radius = 1
  const widthSegments = 6
  const heightSegments = 6
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  )
  return geometry
}
