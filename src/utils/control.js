import * as THREE from 'three'

// 设置renderer的大小 和canvas的大小一致 避免像素化
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement
  // 获取设备像素比
  const pixelRatio = window.devicePixelRatio
  const width = Math.floor(canvas.clientWidth * pixelRatio)
  const height = Math.floor(canvas.clientHeight * pixelRatio)
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

// 正方体的动画
export function renderTestAnimation(renderer, mesh, scene, camera) {
  function render(time) {
    // 设置绘图缓冲区
    if (resizeRendererToDisplaySize(renderer)) {
      // 设置canvas宽高比 避免拉伸变形
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    time *= 0.001 // 将时间单位变为秒
    mesh.rotation.x = time
    mesh.rotation.y = time
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

// 太阳系的动画
export function renderSunAnimation(renderer, scene, camera, objects) {
  function render(time) {
    // 设置绘图缓冲区
    if (resizeRendererToDisplaySize(renderer)) {
      // 设置canvas宽高比 避免拉伸变形
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    time *= 0.001 // 将时间单位变为秒
    objects.forEach((obj) => {
      obj.rotation.y = time
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

// 坦克的动画
export function renderTankAnimation(
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
) {
  const targetPosition = new THREE.Vector3()
  const tankPosition = new THREE.Vector2()
  const tankTarget = new THREE.Vector2()
  const infoElem = document.querySelector('#info')
  function render(time) {
    time *= 0.001
    // 设置绘图缓冲区
    if (resizeRendererToDisplaySize(renderer)) {
      // 设置canvas宽高比 避免拉伸变形
      const canvas = renderer.domElement
      cameras.forEach((cameraInfo) => {
        const camera = cameraInfo.cam
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      })
    }

    // 移动目标值
    targetOrbit.rotation.y = time * 0.27
    targetBob.position.y = Math.sin(time * 2) * 4
    targetMesh.rotation.x = time * 7
    targetMesh.rotation.y = time * 13
    targetMaterial.emissive.setHSL((time * 10) % 1, 1, 0.25)
    targetMaterial.color.setHSL((time * 10) % 1, 1, 0.25)

    // 移动坦克
    const tankTime = time * 0.05
    curve.getPointAt(tankTime % 1, tankPosition)
    curve.getPointAt((tankTime + 0.01) % 1, tankTarget)
    tank.position.set(tankPosition.x, 0, tankPosition.y)
    tank.lookAt(tankTarget.x, 0, tankTarget.y)

    // 目标处的端面炮塔
    targetMesh.getWorldPosition(targetPosition)
    turretPivot.lookAt(targetPosition)

    // 使 TurretCamera 看向目标
    turretCamera.lookAt(targetPosition)

    // 使 targetCameraPivot 查看坦克
    tank.getWorldPosition(targetPosition)
    targetCameraPivot.lookAt(targetPosition)

    // 轮子滚动
    wheelMeshes.forEach((obj) => {
      obj.rotation.x = time * 3
    })

    const camera = cameras[(time * 0.25) % cameras.length | 0]
    if (infoElem) infoElem.textContent = camera.desc

    renderer.render(scene, camera.cam)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
