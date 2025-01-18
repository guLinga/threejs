import * as THREE from 'three'

// 材质
export function createMaterial() {
  return new THREE.MeshBasicMaterial({ color: 0x44aa88 })
}

// 太阳的材质
export function createSunMaterial() {
  return new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
}

// 地球的材质
export function createEarthMaterial() {
  return new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  })
}

// 月球的材质
export function createMoonMaterial() {
  return new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 })
}
