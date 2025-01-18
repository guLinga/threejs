import * as THREE from 'three'

// 光线
export function createLight() {
  const color = 0xffffff
  const intensity = 3
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)
  return light
}

// 太阳光线
export function createSunLight() {
  const color = 0xffffff
  const intensity = 500
  const light = new THREE.PointLight(color, intensity)
  return light
}
