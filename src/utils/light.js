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

// 坦克灯光1
export function createTankLight1() {
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(0, 20, 0)
  return light
}
// 坦克灯光2
export function createTankLight2() {
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(1, 2, 4)
  return light
}
