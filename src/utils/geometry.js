import * as THREE from 'three'
import { tankContant } from './contant'

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

// 平面缓冲几何
export function createGroundGeometry() {
  // x、y
  return new THREE.PlaneGeometry(50, 50)
}

// 坦克的身体形状
export function createTankBodyGeometry() {
  const { carWidth, carHeight, carLength } = tankContant
  return new THREE.BoxGeometry(carWidth, carHeight, carLength)
}

// 坦克的轮子形状
export function createTankWheelGeometry() {
  const { wheelRadius, wheelThickness, wheelSegments } = tankContant
  return new THREE.CylinderGeometry(
    wheelRadius, // top radius
    wheelRadius, // bottom radius
    wheelThickness, // height of cylinder
    wheelSegments
  )
}

// 坦克上面的小房子形状
export function createTankDomeGeometry() {
  const {
    domeRadius,
    domeWidthSubdivisions,
    domeHeightSubdivisions,
    domePhiStart,
    domePhiEnd,
    domeThetaStart,
    domeThetaEnd,
  } = tankContant
  return new THREE.SphereGeometry(
    domeRadius,
    domeWidthSubdivisions,
    domeHeightSubdivisions,
    domePhiStart,
    domePhiEnd,
    domeThetaStart,
    domeThetaEnd
  )
}

// 炮塔形状
export function createTankTurretGeometry() {
  const { turretWidth, turretHeight, turretLength } = tankContant
  return new THREE.BoxGeometry(turretWidth, turretHeight, turretLength)
}

// 炮塔指向的目标值 形状
export function createTargetGeometry() {
  return new THREE.SphereGeometry(0.5, 6, 3)
}

// 路线的形状
export function createSineLineGeometry(points) {
  return new THREE.BufferGeometry().setFromPoints(points)
}
