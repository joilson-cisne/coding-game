import { neighborsOf, canMoveTo, findFrontier } from '../utils'
import { RIGHT, LEFT, UP, DOWN } from '../constants'

const nextStep = (positions, me, grid) => {
  let maxSizeStep
  let maxSize = -Infinity

  const sizeByStep = territorySizeOnNextStep(positions, me, grid)
  console.error('sizeByStep:', sizeByStep) // DEBUG

  Object.entries(sizeByStep).map(([step, size]) => {
    if (size > maxSize) {
      maxSize = size
      maxSizeStep = step
    }
  })

  return maxSizeStep
}

const territorySizeOnNextStep = (positions, player, grid) => {
  const countByStep = { [RIGHT]: 0, [LEFT]: 0, [UP]: 0, [DOWN]: 0 }

  const getMyNeighbor = neighborsOf(positions[player].x, positions[player].y)
  const steps = [RIGHT, LEFT, UP, DOWN]

  steps.map(step => {
    if (canMoveTo(getMyNeighbor(step), grid)) {
      const positionsOnNextStep = positions.map(position => position.player === player
        ? {
          ...position,
          ...getMyNeighbor(step),
        }
        : position
      )

      const territories = findFrontier(positionsOnNextStep, grid)

      const territoriesSize = getSize(territories)
      console.error('territoriesSize:', territoriesSize) // DEBUG

      countByStep[step] = territoriesSize[player]
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
