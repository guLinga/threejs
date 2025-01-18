import { createRenderer } from './renderer'
import { createScene } from './scene'
import { makeAxisGrid } from './AxisGrid'
import {
  createCubeMesh,
  createSunMesh,
  createEarthMesh,
  createBlankMesh,
  createMoonMesh,
} from './mesh'
import { createCamera, createSunCamera } from './camera'
import { renderTestAnimation, renderSunAnimation } from './control'
import { createLight, createSunLight } from './light'

export function renderProcess(canvas) {
  if (!canvas) {
    return null
  }
  // 创建渲染
  const renderer = createRenderer(canvas)
  // 创建相机
  const camera = createCamera()
  // 创建场景
  const scene = createScene()
  // 创建立方体
  const cubeMesh = createCubeMesh()
  // 添加立方体到场景
  scene.add(cubeMesh)
  // 将场景和摄像机传递给渲染器来渲染出整个场景
  renderer.render(scene, camera)
  // 循环动画
  renderTestAnimation(renderer, cubeMesh, scene, camera)
  // 创建光线
  const light = createLight()
  scene.add(light)
}

export function renderSunProcess(canvas) {
  if (!canvas) {
    return null
  }
  // 创建渲染
  const renderer = createRenderer(canvas)
  // 创建相机
  const camera = createSunCamera()
  // 创建场景
  const scene = createScene()
  // 创建光线
  const light = createSunLight()
  scene.add(light)
  const objects = []
  // 创建太阳系
  const solarSystem = createBlankMesh()
  // 创建太阳
  const sunMesh = createSunMesh()
  // 创建地球系
  const earthSystemMesh = createBlankMesh()
  earthSystemMesh.position.x = 10
  // 创建地球
  const earthMesh = createEarthMesh()
  // 创建月球系
  const moonSystemMesh = createBlankMesh()
  moonSystemMesh.position.x = 2
  // 创建月球
  const moonMesh = createMoonMesh()

  // 将太阳系添加到场景
  scene.add(solarSystem)
  objects.push(solarSystem)
  // 添加太阳到太阳系
  solarSystem.add(sunMesh)
  objects.push(sunMesh)
  // 将地球系添加到太阳系
  solarSystem.add(earthSystemMesh)
  objects.push(earthSystemMesh)
  // 添加地球到地球系
  earthSystemMesh.add(earthMesh)
  objects.push(earthMesh)
  // 将月球系添加到地球系
  earthSystemMesh.add(moonSystemMesh)
  objects.push(moonSystemMesh)
  // 将月球添加到月球系
  moonSystemMesh.add(moonMesh)
  objects.push(moonMesh)

  // 设置网格
  makeAxisGrid(solarSystem, '太阳系', 25)
  makeAxisGrid(sunMesh, '太阳')
  makeAxisGrid(earthSystemMesh, '地球系')
  makeAxisGrid(earthMesh, '地球')
  makeAxisGrid(moonSystemMesh, '月亮系')
  makeAxisGrid(moonMesh, '月亮')
  // 循环动画
  renderSunAnimation(renderer, scene, camera, objects)
  // 将场景和摄像机传递给渲染器来渲染出整个场景
  renderer.render(scene, camera)
}
