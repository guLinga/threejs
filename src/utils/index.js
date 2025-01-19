import { createRenderer } from './renderer'
import { createScene } from './scene'
import { makeAxisGrid } from './AxisGrid'
import { tankContant } from './contant'
import { createTargetMaterial } from './material'
import {
  createCubeMesh,
  createSunMesh,
  createEarthMesh,
  createBlankMesh,
  createMoonMesh,
  createGroundMesh,
  createTankBodyMesh,
  createTankWheelMesh,
  createTankDomeMesh,
  createTankTurretMesh,
  createTargetMesh,
  createSineLineMesh,
} from './mesh'
import { createCamera, createSunCamera, makeCamera } from './camera'
import {
  renderTestAnimation,
  renderSunAnimation,
  renderTankAnimation,
} from './control'
import {
  createLight,
  createSunLight,
  createTankLight1,
  createTankLight2,
} from './light'

// 正方体的生成流程
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

// 太阳系的生成流程
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

// 坦克的生成流程
export function tankProcess(canvas) {
  if (!canvas) {
    return null
  }
  // 创建渲染
  const renderer = createRenderer(canvas)
  // 设置颜色及其透明度
  renderer.setClearColor(0xaaaaaa)
  // 使用阴影贴图
  renderer.shadowMap.enabled = true
  // 创建相机
  const camera = makeCamera()
  // 设置相机的位置 todo
  camera.position.set(8, 4, 10).multiplyScalar(3)
  camera.lookAt(0, 0, 0)
  // 创建相机2 坦克相机
  const tankCameraFov = 75
  const tankCamera = makeCamera(tankCameraFov)
  tankCamera.position.y = 3
  tankCamera.position.z = -6
  tankCamera.rotation.y = Math.PI
  // 创建相机3 炮塔相机
  const turretCamera = makeCamera()
  turretCamera.position.y = 0.75 * 0.2
  // 创建相机4 目标值相机
  const targetCamera = makeCamera()
  targetCamera.position.y = 1
  targetCamera.position.z = -2
  targetCamera.rotation.y = Math.PI

  // 创建场景
  const scene = createScene()
  // 创建光线1
  const light1 = createTankLight1()
  scene.add(light1)
  light1.castShadow = true
  light1.shadow.mapSize.width = 2048
  light1.shadow.mapSize.height = 2048

  const d = 50
  light1.shadow.camera.left = -d
  light1.shadow.camera.right = d
  light1.shadow.camera.top = d
  light1.shadow.camera.bottom = -d
  light1.shadow.camera.near = 1
  light1.shadow.camera.far = 50
  light1.shadow.bias = 0.001
  // 创建灯光2
  const light2 = createTankLight2()
  scene.add(light2)

  // 创建地
  const ground = createGroundMesh()
  // 创建坦克的3d
  const tank = createBlankMesh()
  // 创建坦克的身体
  const bodyMesh = createTankBodyMesh()
  // 创建坦克的轮子
  const wheelMeshes = createTankWheelMesh()
  // 创建坦克上面的小房子
  const domeMesh = createTankDomeMesh()
  // 创建坦克炮塔3d
  const turretPivot = createBlankMesh()
  turretPivot.scale.set(5, 5, 5)
  turretPivot.position.y = 0.5
  // 创建炮塔
  const turretMesh = createTankTurretMesh()
  turretMesh.castShadow = true
  const { turretLength, carLength } = tankContant
  turretMesh.position.z = turretLength * 0.5
  // 创建目标值 todo
  const targetOrbit = createBlankMesh()
  const targetElevation = createBlankMesh()
  targetElevation.position.z = carLength * 2
  targetElevation.position.y = 8
  const targetBob = createBlankMesh()
  // 创建目标值
  const tempTargetMesh = createTargetMesh()
  const targetMesh = tempTargetMesh.mesh
  const { material: targetMaterial } = tempTargetMesh
  // 创建目标值相机3d
  const targetCameraPivot = createBlankMesh()
  // 创建路线
  const [splineObject, curve] = createSineLineMesh()

  // 设置相机2 坦克相机
  bodyMesh.add(tankCamera)
  // 设置相机3 炮塔相机
  turretMesh.add(turretCamera)

  // 将地添加到场景
  scene.add(ground)
  // 将坦克添加到场景中
  scene.add(tank)
  // 将坦克的身体添加到坦克3d中
  tank.add(bodyMesh)
  // 将坦克的轮子添加到坦克的身体中
  wheelMeshes.forEach((wheel) => {
    bodyMesh.add(wheel)
  })
  // 将坦克上面的小房子添加到坦克的身体上
  bodyMesh.add(domeMesh)
  domeMesh.position.y = 0.5
  // 将坦克炮塔3d添加到坦克的身体上
  bodyMesh.add(turretPivot)
  // 将炮塔添加到炮塔3d上
  turretPivot.add(turretMesh)
  // 将 targetOrbit 添加到场景中
  scene.add(targetOrbit)
  // 将 targetElevation 添加到 targetOrbit中
  targetOrbit.add(targetElevation)
  // 将 targetBob 添加到 targetElevation
  targetElevation.add(targetBob)
  // 将 目标值 添加到 targetBob
  targetBob.add(targetMesh)
  // 将目标值相机4 3d添加到 targetBob
  targetBob.add(targetCameraPivot)
  // 将目标值相机4添加到目标值相机4 3d
  targetCameraPivot.add(targetCamera)
  // 将路线添加到场景
  scene.add(splineObject)

  // 设置网格
  makeAxisGrid(ground, '地')
  makeAxisGrid(tank, '坦克3d')
  makeAxisGrid(bodyMesh, '坦克身体')
  wheelMeshes.forEach((wheel, idx) => {
    makeAxisGrid(wheel, `坦克轮子${idx}`)
  })
  makeAxisGrid(domeMesh, '坦克上面的小房子')
  makeAxisGrid(turretPivot, '坦克炮塔3d')
  makeAxisGrid(turretMesh, '坦克炮塔')
  makeAxisGrid(targetOrbit, 'targetOrbit')
  makeAxisGrid(targetElevation, 'targetElevation')
  makeAxisGrid(targetBob, 'targetBob')
  makeAxisGrid(targetMesh, 'targetMesh')
  makeAxisGrid(targetCameraPivot, '相机4 3d')
  makeAxisGrid(targetCamera, '相机4')
  makeAxisGrid(splineObject, '路线')

  // 动画和尺寸
  const cameras = [
    { cam: camera, desc: 'detached camera' },
    { cam: turretCamera, desc: 'on turret looking at target' },
    { cam: targetCamera, desc: 'near target looking at tank' },
    { cam: tankCamera, desc: 'above back of tank' },
  ]
  renderTankAnimation(
    renderer,
    cameras,
    targetOrbit,
    tank,
    targetBob,
    targetMesh,
    targetMaterial,
    turretPivot,
    turretCamera,
    targetCameraPivot,
    wheelMeshes,
    scene,
    curve
  )
  // 将场景和摄像机传递给渲染器来渲染出整个场景
  renderer.render(scene, camera)
}
