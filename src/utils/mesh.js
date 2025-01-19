import * as THREE from 'three'
import { tankContant } from './contant'
import {
  createGeometry,
  createSphereGeometry,
  createGroundGeometry,
  createTankBodyGeometry,
  createTankWheelGeometry,
  createTankDomeGeometry,
  createTankTurretGeometry,
  createTargetGeometry,
  createSineLineGeometry,
  createLineGeometry,
} from './geometry'
import {
  createMaterial,
  createSunMaterial,
  createEarthMaterial,
  createMoonMaterial,
  createGroundMaterial,
  createTankBodyMaterial,
  createTankWheelMaterial,
  createTargetMaterial,
  createSineLineMaterial,
  createPlaneMaterial,
  creatCubeLineMaterial,
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

// 地
export function createGroundMesh() {
  const geometry = createGroundGeometry()
  const material = createGroundMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  // 设置地的x轴坐标？没找到属性的具体说明 好像是旋转？ todo
  mesh.rotation.x = Math.PI * -0.5
  // 也没找到 todo
  mesh.receiveShadow = true
  return mesh
}

// 坦克的身体
export function createTankBodyMesh() {
  const geometry = createTankBodyGeometry()
  const material = createTankBodyMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  // todo
  mesh.position.y = 1.4
  // todo
  mesh.castShadow = true
  return mesh
}

// 坦克的轮子
export function createTankWheelMesh() {
  const geometry = createTankWheelGeometry()
  const material = createTankWheelMaterial()
  const { carWidth, carHeight, carLength, wheelThickness } = tankContant
  const wheelPositions = [
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
  ]
  const meshArr = wheelPositions.map((position) => {
    const mesh = new THREE.Mesh(geometry, material)
    // todo
    mesh.position.set(...position)
    // todo
    mesh.rotation.z = Math.PI * 0.5
    mesh.castShadow = true
    return mesh
  })
  return meshArr
}

// 坦克上面的小房子
export function createTankDomeMesh() {
  const geometry = createTankDomeGeometry()
  const material = createTankBodyMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  // todo
  mesh.castShadow = true
  return mesh
}

// 炮塔
export function createTankTurretMesh() {
  const geometry = createTankTurretGeometry()
  const material = createTankBodyMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

// 炮塔指向的目标值
export function createTargetMesh() {
  const geometry = createTargetGeometry()
  const material = createTargetMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  return {
    mesh,
    material,
  }
}

// 路线
export function createSineLineMesh() {
  const curve = new THREE.SplineCurve([
    new THREE.Vector2(-10, 0),
    new THREE.Vector2(-5, 5),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(5, -5),
    new THREE.Vector2(10, 0),
    new THREE.Vector2(5, 10),
    new THREE.Vector2(-5, 10),
    new THREE.Vector2(-10, -10),
    new THREE.Vector2(-15, -8),
    new THREE.Vector2(-10, 0),
  ])
  const points = curve.getPoints(50)
  const geometry = createSineLineGeometry(points)
  const material = createSineLineMaterial()
  const splineObject = new THREE.Line(geometry, material)
  splineObject.rotation.x = Math.PI * 0.5
  splineObject.position.y = 0.05
  return [splineObject, curve]
}

// 魔方的2d平面
export function createPlaneMesh() {
  const geometry = createGroundGeometry()
  const material = createPlaneMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  // 设置地的x轴旋转
  mesh.rotation.x = Math.PI * -0.5
  mesh.position.y = -20
  // 也没找到 todo
  mesh.receiveShadow = true
  return mesh
}

// 魔方x轴
export function createCubeXMesh() {
  const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(300, 0, 0)]
  const geometry = createLineGeometry(points)
  const material = creatCubeLineMaterial()
  return new THREE.Line(geometry, material)
}
// 魔方y轴
export function createCubeYMesh() {
  const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 300, 0)]
  const geometry = createLineGeometry(points)
  const material = creatCubeLineMaterial(0x00ff00)
  return new THREE.Line(geometry, material)
}
// 魔方z轴
export function createCubeZMesh() {
  const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 300)]
  const geometry = createLineGeometry(points)
  const material = creatCubeLineMaterial(0x0000ff)
  return new THREE.Line(geometry, material)
}
