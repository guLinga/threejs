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
