import { neighborsOf, canMoveTo, findFrontier } from '../utils'
import { RIGHT, LEFT, UP, DOWN } from '../constants'

const nextStep = (players, grid) => {
  let maxSizeStep
  let maxSize = -Infinity

  const sizeByStep = territorySizeOnNextStep(players, grid)

  Object.entries(sizeByStep).map(([step, size]) => {
    if (size > maxSize) {
      maxSize = size
      maxSizeStep = step
    }
  })

  return maxSizeStep
}

const territorySizeOnNextStep = ([me, ...opponents], grid) => {
  const countByStep = { [RIGHT]: 0, [LEFT]: 0, [UP]: 0, [DOWN]: 0 }

  const myPlayerId = 0
  const getNeighbor = neighborsOf(me.x, me.y)
  const steps = [RIGHT, LEFT, UP, DOWN]

  steps.map(step => {
    if (canMoveTo(getNeighbor(step), grid)) {
      const territories = findFrontier([getNeighbor(step), ...opponents], grid)

      const territoriesSize = getSize(territories)

      countByStep[step] = territoriesSize[myPlayerId]
    }
  })

  return countByStep
}

const getSize = (territories) => {
  const sizes = { 0: 0, 1: 0, 2: 0, 3: 0 }

  territories.map(row => {
    row.map(cell => {
      if (cell !== false) { sizes[cell]++ }
    })
  })

  return sizes
}


export default {
  nextStep,
}
