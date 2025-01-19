import * as THREE from 'three'

/**
 * 简易魔方
 * x、y、z 魔方中心点坐标
 * num 魔方阶数
 * len 小方块宽高
 * colors 魔方六面体颜色
 */

export function SimpleCube(x, y, z, num, len, colors) {
  // 魔方左上角坐标 魔方中心的坐标是(0,0,0)
  var leftUpX = x - (num / 2) * len
  var leftUpY = y + (num / 2) * len
  var leftUpZ = z + (num / 2) * len

  // 根据颜色生成材质
  var materialArr = []
  for (var i = 0; i < colors.length; i++) {
    // 纹理贴图
    var texture = new THREE.Texture(faces(colors[i]))
    texture.needsUpdate = true
    // 材质
    var material = new THREE.MeshLambertMaterial({ map: texture })
    materialArr.push(material)
  }

  var cubes = []
  // 生成魔方小方块
  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num * num; j++) {
      // 立方缓冲几何体 width height depth
      var cubegeo = new THREE.BoxGeometry(len, len, len)

      // 物体
      var cube = new THREE.Mesh(cubegeo, materialArr)

      //依次计算各个小方块中心点坐标
      cube.position.x = leftUpX + len / 2 + (j % num) * len
      cube.position.y = leftUpY - len / 2 - parseInt(j / num) * len
      cube.position.z = leftUpZ - len / 2 - i * len
      cubes.push(cube)
    }
  }
  return cubes
}

//生成canvas素材
export function faces(rgbaColor) {
  var canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  var context = canvas.getContext('2d')
  if (context) {
    //画一个宽高都是256的黑色正方形
    context.fillStyle = 'rgba(0,0,0,1)'
    context.fillRect(0, 0, 256, 256)
    //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
    context.rect(16, 16, 224, 224)
    context.lineJoin = 'round'
    context.lineWidth = 16
    context.fillStyle = rgbaColor
    context.strokeStyle = rgbaColor
    context.stroke()
    context.fill()
  } else {
    alert('您的浏览器不支持Canvas无法预览.\n')
  }
  return canvas
}
