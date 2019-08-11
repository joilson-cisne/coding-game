import { neighborsOf, canMoveTo, isOutOfGrid, isCollision, isVisited } from '../utils'
import {
  RIGHT, LEFT, UP, DOWN,
  HEIGHT_LIMIT, WIDTH_LIMIT,
  DX, DY,
} from '../constants'

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

// TODO: Split into smaller functions
const territorySizeOnNextStep = (positions, player, grid) => {
  const countByStep = { [RIGHT]: 0, [LEFT]: 0, [UP]: 0, [DOWN]: 0 }

  const playerPosition = positions.find(p => p.player === player)
  const getNeighbor = neighborsOf(playerPosition.x, playerPosition.y)
  const steps = [RIGHT, LEFT, UP, DOWN]

  steps.map(step => {
    if (canMoveTo(getNeighbor(step), grid)) {
      const positionsOnNextStep = positions.map(position => position.player === player
        ? {
          ...position,
          ...getNeighbor(step),
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

const findFrontier = (sources, grid) => {
  // Initial setup
  const visited = []
  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    visited.push(Array(WIDTH_LIMIT).fill(false))
  }

  const positionsQueue = []

  // Algorithm start
  sources.map(src => {
    positionsQueue.push(src)
    visited[src.y][src.x] = src.player
  })

  while (positionsQueue.length > 0) {
    let position = positionsQueue.shift()
    
    exploreFrontierNeighborhood(position, { grid, positionsQueue, visited })
  }

  return  visited
}

const exploreFrontierNeighborhood = ({ x, y, player }, config) => {
  const { positionsQueue, visited } = config

  for (let i = 0; i < 4; i++) {
    const neighborX = x + DX[i]
    const neighborY = y + DY[i]

    const newPosition = { x: neighborX, y: neighborY, player }

    if (isValid(newPosition, config)) {
      positionsQueue.push({ x: neighborX, y: neighborY, player})
      visited[neighborY][neighborX] = player
    }
  }
}

const isValid = ({ x, y }, { grid, visited }) =>
  !isOutOfGrid(x, y)
  && !isVisited(x, y, visited)
  && !isCollision(x, y, grid)

export default {
  nextStep,
}
