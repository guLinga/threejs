import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
const gui = new GUI()

export function makeAxisGrid(node, label, units) {
  const helper = new AxisGridHelper(node, units)
  gui.add(helper, 'visible').name(label)
}

class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 2 // 在网格渲染之后再渲染
    node.add(axes)

    const grid = new THREE.GridHelper(units, units)
    grid.material.depthTest = false
    grid.renderOrder = 1
    node.add(grid)

    this.grid = grid
    this.axes = axes
    this.visible = false
  }
  get visible() {
    return this._visible
  }
  set visible(v) {
    this._visible = v
    this.grid.visible = v
    this.axes.visible = v
  }
}
