import * as THREE from 'three'

// 相机
export function createCamera() {
  const fov = 75 // 垂直方向75度
  const aspect = 2 // 相机默认值
  const near = 0.1 // 近平面
  const far = 5 // 远平面
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 2
  return camera
}

// 观察太阳的相机
export function createSunCamera() {
  const fov = 40
  const aspect = 2 // the canvas default
  const near = 0.1
  const far = 1000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 50, 0)
  camera.up.set(0, 0, 1)
  camera.lookAt(0, 0, 0)
  return camera
}
