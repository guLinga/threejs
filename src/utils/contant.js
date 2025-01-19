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
