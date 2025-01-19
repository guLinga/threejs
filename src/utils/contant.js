import * as THREE from 'three'

const carLength = 8

export const tankContant = {
  carWidth: 4,
  carHeight: 1,
  carLength,
  // 轮子
  wheelRadius: 1,
  wheelThickness: 0.5,
  wheelSegments: 6,
  // 房子
  domeRadius: 2,
  domeWidthSubdivisions: 12,
  domeHeightSubdivisions: 12,
  domePhiStart: 0,
  domePhiEnd: Math.PI * 2,
  domeThetaStart: 0,
  domeThetaEnd: Math.PI * 0.5,
  // 炮塔
  turretWidth: 0.1,
  turretHeight: 0.1,
  turretLength: carLength * 0.75 * 0.2,
}

export const cubeOrigPoint = new THREE.Vector3(0, 0, 0)

export const cubeContant = {
  cubeParams: {
    //魔方参数
    x: 0,
    y: 0,
    z: 0,
    num: 3,
    len: 10,
    colors: [
      'rgba(255,193,37,1)',
      'rgba(0,191,255,1)',
      'rgba(50,205,50,1)',
      'rgba(178,34,34,1)',
      'rgba(255,255,0,1)',
      'rgba(255,255,255,1)',
    ],
  },
}
