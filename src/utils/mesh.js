import * as THREE from 'three'
import { createGeometry, createSphereGeometry } from './geometry'
import {
  createMaterial,
  createSunMaterial,
  createEarthMaterial,
  createMoonMaterial,
} from './material'

// 空节点
export function createBlankMesh() {
  return new THREE.Object3D()
}

// 正方体
export function createCubeMesh() {
  const geometry = createGeometry()
  const material = createMaterial()
  return new THREE.Mesh(geometry, material)
}

// 太阳
export function createSunMesh() {
  const geometry = createSphereGeometry()
  const material = createSunMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  // 扩充太阳大小
  mesh.scale.set(3, 3, 3)
  return mesh
}

// 地球
export function createEarthMesh() {
  const geometry = createSphereGeometry()
  const material = createEarthMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  // mesh.position.x = 10
  return mesh
}

// 月亮
export function createMoonMesh() {
  const geometry = createSphereGeometry()
  const material = createMoonMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.scale.set(0.5, 0.5, 0.5)
  return mesh
}
