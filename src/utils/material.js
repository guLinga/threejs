import * as THREE from 'three'
// import planeBackground from '../static/image/planeBackground2.jpg'
import planeBackground from '../static/image/planeBackground.jpg'

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

// 地的材质
export function createGroundMaterial() {
  return new THREE.MeshPhongMaterial({ color: 0xcc8866 })
}

// 坦克身体的材质
export function createTankBodyMaterial() {
  return new THREE.MeshPhongMaterial({ color: 0x6688aa })
}

// 坦克轮子、坦克上面小房子和炮塔 的材质
export function createTankWheelMaterial() {
  return new THREE.MeshPhongMaterial({ color: 0x888888 })
}

// 炮塔指向的目标值 材质
export function createTargetMaterial() {
  return new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true })
}

// 路线的材质
export function createSineLineMaterial() {
  return new THREE.LineBasicMaterial({ color: 0xff0000 })
}

// 魔方平面的材质
export function createPlaneMaterial() {
  const loader = new THREE.TextureLoader()
  // 加载纹路图片
  const texture = loader.load(planeBackground)
  texture.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshBasicMaterial({
    map: texture,
  })
}

// 魔方坐标轴的材质
export function creatCubeLineMaterial(color = 0x0000ff) {
  return new THREE.LineBasicMaterial({
    color,
  })
}
