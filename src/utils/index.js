import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createRenderer } from './renderer'
import { createScene } from './scene'
import { makeAxisGrid } from './AxisGrid'
import { tankContant, cubeContant, cubeOrigPoint } from './contant'
import { SimpleCube } from '../tool/cube'
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
  createPlaneMesh,
  createCubeXMesh,
  createCubeYMesh,
  createCubeZMesh,
} from './mesh'
import {
  createCamera,
  createSunCamera,
  makeCamera,
  createCubeCamera,
} from './camera'
import {
  renderTestAnimation,
  renderSunAnimation,
  renderTankAnimation,
  resizeRendererToDisplaySize,
  renderCubeAnimation,
} from './control'
import {
  createLight,
  createSunLight,
  createTankLight1,
  createTankLight2,
  createCubeLight,
} from './light'

// 魔方
export function renderCubeProcess(canvas) {
  if (!canvas) {
    return null
  }
  // 创建渲染
  const renderer = createRenderer(canvas)
  // 创建相机
  const camera = createCubeCamera()
  // 创建场景
  const scene = createScene()
  // 创建光线
  const light = createCubeLight()
  scene.add(light)

  /* 平面 */
  // 创建平面
  const planeMesh = createPlaneMesh()
  // 将平面添加到场景
  scene.add(planeMesh)

  /* x轴 */
  // 创建x轴
  const xMesh = createCubeXMesh()
  // 将x轴添加到场景
  scene.add(xMesh)

  /* y轴 */
  // 创建y轴
  const yMesh = createCubeYMesh()
  // 将y轴添加到场景
  scene.add(yMesh)

  /* z轴 */
  // 创建z轴
  const zMesh = createCubeZMesh()
  // 将z轴添加到场景
  scene.add(zMesh)

  /* 魔方小正方体 */
  const { cubeParams } = cubeContant
  const { x, y, z, num, len, colors } = cubeParams
  // 生成魔方小正方体的物体
  const cubes = SimpleCube(x, y, z, num, len, colors)
  //魔方初始状态
  let initStatus = []
  // 将每个正方体插入到场景中
  cubes.forEach((cube) => {
    initStatus.push({
      x: cube.position.x,
      y: cube.position.y,
      z: cube.position.z,
      cubeIndex: cube.id,
    })
    cube.cubeIndex = cube.id
    scene.add(cube)
  })

  // 透明正方体
  const cubegeo = new THREE.BoxGeometry(150, 150, 150)
  const hex = 0x000000
  const cubemat = new THREE.MeshBasicMaterial({
    color: hex,
    opacity: 0,
    transparent: true,
  })
  const transparentCube = new THREE.Mesh(cubegeo, cubemat)
  transparentCube.cubeType = 'coverCube'
  scene.add(transparentCube)

  // makeAxisGrid(planeMesh, '平面')

  renderCubeAnimation(renderer, scene, camera)
  // 将场景和摄像机传递给渲染器来渲染出整个场景
  renderer.render(scene, camera)

  // 创建控制器 视角控制
  const controller = new OrbitControls(camera, renderer.domElement)
  controller.target = cubeOrigPoint //设置控制点

  let raycaster = new THREE.Raycaster() //光线碰撞检测器
  let mouse = new THREE.Vector2() //存储鼠标坐标或者触摸坐标
  let isRotating = false //魔方是否正在转动
  let intersect //碰撞光线穿过的元素
  let normalize //触发平面法向量
  let startPoint //触发点
  let movePoint
  //魔方转动的六个方向
  let xLine = new THREE.Vector3(1, 0, 0) //X轴正方向
  let xLineAd = new THREE.Vector3(-1, 0, 0) //X轴负方向
  let yLine = new THREE.Vector3(0, 1, 0) //Y轴正方向
  let yLineAd = new THREE.Vector3(0, -1, 0) //Y轴负方向
  let zLine = new THREE.Vector3(0, 0, 1) //Z轴正方向
  let zLineAd = new THREE.Vector3(0, 0, -1) //Z轴负方向
  const width = window.innerWidth
  const height = window.innerHeight

  window.requestAnimFrame = (function () {
    //如果有变化则可能还需要requestAnimationFrame刷新
    return (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.webkitRequestAnimationFrame
    )
  })()

  //监听鼠标事件
  renderer.domElement.addEventListener('mousedown', startCube, false)
  renderer.domElement.addEventListener('mousemove', moveCube, false)
  renderer.domElement.addEventListener('mouseup', stopCube, false)
  //监听触摸事件
  renderer.domElement.addEventListener('touchstart', startCube, false)
  renderer.domElement.addEventListener('touchmove', moveCube, false)
  renderer.domElement.addEventListener('touchend', stopCube, false)

  //魔方操作结束
  function stopCube() {
    intersect = null
    startPoint = null
  }

  //绕着世界坐标系的某个轴旋转
  function rotateAroundWorldY(obj, rad) {
    const x0 = obj.position.x
    const z0 = obj.position.z
    /**
     * 因为物体本身的坐标系是随着物体的变化而变化的，
     * 所以如果使用rotateZ、rotateY、rotateX等方法，
     * 多次调用后就会出问题，先改为Quaternion实现。
     */
    const q = new THREE.Quaternion()
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad)
    obj.quaternion.premultiply(q)
    //obj.rotateY(rad);
    obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0
    obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0
  }
  function rotateAroundWorldZ(obj, rad) {
    const x0 = obj.position.x
    const y0 = obj.position.y
    const q = new THREE.Quaternion()
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad)
    obj.quaternion.premultiply(q)
    //obj.rotateZ(rad);
    obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0
    obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0
  }
  function rotateAroundWorldX(obj, rad) {
    const y0 = obj.position.y
    const z0 = obj.position.z
    const q = new THREE.Quaternion()
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad)
    obj.quaternion.premultiply(q)
    //obj.rotateX(rad);
    obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0
    obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0
  }

  //滑动操作魔方
  function moveCube(event) {
    getIntersects(event)
    if (intersect) {
      if (!isRotating && startPoint) {
        //魔方没有进行转动且满足进行转动的条件
        movePoint = intersect.point
        if (!movePoint.equals(startPoint)) {
          //和起始点不一样则意味着可以得到转动向量了
          isRotating = true //转动标识置为true
          const sub = movePoint.sub(startPoint) //计算转动向量
          const direction = getDirection(sub) //获得方向
          const elements = getBoxs(intersect, direction)
          const startTime = new Date().getTime()
          window.requestAnimFrame(function (timestamp) {
            rotateAnimation(elements, direction, timestamp, 0)
          })
        }
      }
    }
    event.preventDefault()
  }

  /**
   * 旋转动画
   */
  function rotateAnimation(
    elements,
    direction,
    currentstamp,
    startstamp,
    laststamp
  ) {
    const totalTime = 500 //转动的总运动时间
    if (startstamp === 0) {
      startstamp = currentstamp
      laststamp = currentstamp
    }
    if (currentstamp - startstamp >= totalTime) {
      currentstamp = startstamp + totalTime
      isRotating = false
      startPoint = null
      updateCubeIndex(elements)
    }
    switch (direction) {
      //绕z轴顺时针
      case 0.1:
      case 1.2:
      case 2.4:
      case 3.3:
        for (let i = 0; i < elements.length; i++) {
          rotateAroundWorldZ(
            elements[i],
            (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕z轴逆时针
      case 0.2:
      case 1.1:
      case 2.3:
      case 3.4:
        for (let i = 0; i < elements.length; i++) {
          rotateAroundWorldZ(
            elements[i],
            (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕y轴顺时针
      case 0.4:
      case 1.3:
      case 4.3:
      case 5.4:
        for (let i = 0; i < elements.length; i++) {
          rotateAroundWorldY(
            elements[i],
            (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕y轴逆时针
      case 1.4:
      case 0.3:
      case 4.4:
      case 5.3:
        for (let i = 0; i < elements.length; i++) {
          rotateAroundWorldY(
            elements[i],
            (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕x轴顺时针
      case 2.2:
      case 3.1:
      case 4.1:
      case 5.2:
        for (let i = 0; i < elements.length; i++) {
          rotateAroundWorldX(
            elements[i],
            (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕x轴逆时针
      case 2.1:
      case 3.2:
      case 4.2:
      case 5.1:
        for (let i = 0; i < elements.length; i++) {
          rotateAroundWorldX(
            elements[i],
            (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      default:
        break
    }
    if (currentstamp - startstamp < totalTime) {
      window.requestAnimFrame(function (timestamp) {
        rotateAnimation(
          elements,
          direction,
          timestamp,
          startstamp,
          currentstamp
        )
      })
    }
  }

  //更新位置索引
  function updateCubeIndex(elements) {
    for (let i = 0; i < elements.length; i++) {
      const temp1 = elements[i]
      for (let j = 0; j < initStatus.length; j++) {
        const temp2 = initStatus[j]
        if (
          Math.abs(temp1.position.x - temp2.x) <= cubeParams.len / 2 &&
          Math.abs(temp1.position.y - temp2.y) <= cubeParams.len / 2 &&
          Math.abs(temp1.position.z - temp2.z) <= cubeParams.len / 2
        ) {
          temp1.cubeIndex = temp2.cubeIndex
          break
        }
      }
    }
  }

  //根据方向获得运动元素
  function getBoxs(target, direction) {
    let targetId = target.object.cubeIndex
    const ids = []
    for (let i = 0; i < cubes.length; i++) {
      ids.push(cubes[i].cubeIndex)
    }
    const minId = min(ids)
    targetId = targetId - minId
    const numI = parseInt(targetId / 9)
    const numJ = targetId % 9
    const boxs = []
    //根据绘制时的规律判断 no = i*9+j
    switch (direction) {
      //绕z轴
      case 0.1:
      case 0.2:
      case 1.1:
      case 1.2:
      case 2.3:
      case 2.4:
      case 3.3:
      case 3.4:
        for (let i = 0; i < cubes.length; i++) {
          const tempId = cubes[i].cubeIndex - minId
          if (numI === parseInt(tempId / 9)) {
            boxs.push(cubes[i])
          }
        }
        break
      //绕y轴
      case 0.3:
      case 0.4:
      case 1.3:
      case 1.4:
      case 4.3:
      case 4.4:
      case 5.3:
      case 5.4:
        for (let i = 0; i < cubes.length; i++) {
          const tempId = cubes[i].cubeIndex - minId
          if (parseInt(numJ / 3) === parseInt((tempId % 9) / 3)) {
            boxs.push(cubes[i])
          }
        }
        break
      //绕x轴
      case 2.1:
      case 2.2:
      case 3.1:
      case 3.2:
      case 4.1:
      case 4.2:
      case 5.1:
      case 5.2:
        for (let i = 0; i < cubes.length; i++) {
          const tempId = cubes[i].cubeIndex - minId
          if ((tempId % 9) % 3 === numJ % 3) {
            boxs.push(cubes[i])
          }
        }
        break
      default:
        break
    }
    return boxs
  }

  //获得旋转方向
  function getDirection(vector3) {
    let direction
    //判断差向量和x、y、z轴的夹角
    const xAngle = vector3.angleTo(xLine)
    const xAngleAd = vector3.angleTo(xLineAd)
    const yAngle = vector3.angleTo(yLine)
    const yAngleAd = vector3.angleTo(yLineAd)
    const zAngle = vector3.angleTo(zLine)
    const zAngleAd = vector3.angleTo(zLineAd)
    const minAngle = min([xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd]) //最小夹角

    switch (minAngle) {
      case xAngle:
        direction = 0 //向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕z轴顺时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕z轴逆时针
        } else if (normalize.equals(zLine)) {
          direction = direction + 0.3 //绕y轴逆时针
        } else {
          direction = direction + 0.4 //绕y轴顺时针
        }
        break
      case xAngleAd:
        direction = 1 //向x轴反方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕z轴逆时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕z轴顺时针
        } else if (normalize.equals(zLine)) {
          direction = direction + 0.3 //绕y轴顺时针
        } else {
          direction = direction + 0.4 //绕y轴逆时针
        }
        break
      case yAngle:
        direction = 2 //向y轴正方向旋转90度
        if (normalize.equals(zLine)) {
          direction = direction + 0.1 //绕x轴逆时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 0.2 //绕x轴顺时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕z轴逆时针
        } else {
          direction = direction + 0.4 //绕z轴顺时针
        }
        break
      case yAngleAd:
        direction = 3 //向y轴反方向旋转90度
        if (normalize.equals(zLine)) {
          direction = direction + 0.1 //绕x轴顺时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 0.2 //绕x轴逆时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕z轴顺时针
        } else {
          direction = direction + 0.4 //绕z轴逆时针
        }
        break
      case zAngle:
        direction = 4 //向z轴正方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕x轴顺时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕x轴逆时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕y轴顺时针
        } else {
          direction = direction + 0.4 //绕y轴逆时针
        }
        break
      case zAngleAd:
        direction = 5 //向z轴反方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕x轴逆时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕x轴顺时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕y轴逆时针
        } else {
          direction = direction + 0.4 //绕y轴顺时针
        }
        break
      default:
        break
    }
    return direction
  }

  //获取数组中的最小值
  function min(arr) {
    let min = arr[0]
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < min) {
        min = arr[i]
      }
    }
    return min
  }

  //开始操作魔方
  function startCube(event) {
    getIntersects(event)
    //魔方没有处于转动过程中且存在碰撞物体
    if (!isRotating && intersect) {
      startPoint = intersect.point //开始转动，设置起始点
      controller.enabled = false //当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
    } else {
      controller.enabled = true //当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
    }
  }

  //获取操作焦点以及该焦点所在平面的法向量
  function getIntersects(event) {
    //触摸事件和鼠标事件获得坐标的方式有点区别
    if (event.touches) {
      const touch = event.touches[0]
      mouse.x = (touch.clientX / width) * 2 - 1
      mouse.y = -(touch.clientY / height) * 2 + 1
    } else {
      mouse.x = (event.clientX / width) * 2 - 1
      mouse.y = -(event.clientY / height) * 2 + 1
    }
    raycaster.setFromCamera(mouse, camera)
    //Raycaster方式定位选取元素，可能会选取多个，以第一个为准
    let intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length) {
      try {
        if (intersects[0].object.cubeType === 'coverCube') {
          intersect = intersects[1]
          normalize = intersects[0].face.normal
        } else {
          intersect = intersects[0]
          normalize = intersects[1].face.normal
        }
      } catch (err) {
        //nothing
      }
      // console.log('intersect2', intersect)
    }
  }
}

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
