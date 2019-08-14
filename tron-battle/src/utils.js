import { RIGHT, LEFT, UP, DOWN, WIDTH_LIMIT, HEIGHT_LIMIT, DX, DY } from './constants'


export const removeDeadPlayerFromGrid = (player, grid) => grid.map(row => row.map(p => p === player && false))

export const isDead = position => position.x === -1 && position.y === -1

export const countVisitableNodes = (currentX, currentY, grid) => {
  const counter = { [RIGHT]: 0, [LEFT]: 0, [UP]: 0, [DOWN]: 0 }

  const getNeighbor = neighborsOf(currentX, currentY)
  const steps = [RIGHT, LEFT, UP, DOWN]

  steps.map(step => {
    if (canMoveTo(getNeighbor(step), grid)) {
      counter[step] = countVisitableNodesFrom(getNeighbor(step), grid)
    }
  })

  return counter
}

export const canMoveTo = ({ x, y }, grid) => !isOutOfGrid(x, y) && !isCollision(x, y, grid)

export const isOutOfGrid = (x, y) => x < 0 || y < 0 || x >= WIDTH_LIMIT || y >= HEIGHT_LIMIT

export const isCollision = (x, y, grid) => grid[y][x] !== false

export const isVisited = (x, y, visited) => visited[y][x] !== false

export const countVisitableNodesFrom = ({ x, y }, grid) => {
  let finalCount = 0

  findPath(x, y, -1, -1, grid)

  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    finalCount += globalVisited[i].reduce((count, visited) => (visited ? count + 1 : count), 0)
  }

  return finalCount
}

export const neighborsOf = (x, y) => step => {
  switch (step) {
  case RIGHT:
    return { x: x + 1, y }
  case LEFT:
    return { x: x - 1, y }
  case UP:
    return { x, y: y - 1 }
  case DOWN:
    return { x, y: y + 1 }
  default:
    throw new Error(`Invalid step: "${step}"`)
  }
}

let movesCount
let nodesLeftInLayer
let nodesInNextLater

let xQueue
let yQueue

let globalVisited
let globalParent

// BFS in a grid
export const findPath = (myX, myY, oppX, oppY, grid) => {
  // Initial setup
  movesCount = 0
  nodesLeftInLayer = 1
  nodesInNextLater = 0

  globalVisited = []
  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    globalVisited.push(Array(WIDTH_LIMIT).fill(false))
  }

  globalParent = []
  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    globalParent.push(Array(WIDTH_LIMIT).fill(false))
  }

  xQueue = []
  yQueue = []

  let endReached = false

  // Algorithm start
  xQueue.push(myX)
  yQueue.push(myY)

  globalVisited[myY][myX] = true

  while (xQueue.length > 0) {
    let x = xQueue.shift()
    let y = yQueue.shift()

    if (x === oppX && y === oppY) {
      endReached = true
      break
    }

    exploreNeighborhood(x, y, oppX, oppY, grid)

    nodesLeftInLayer--
    if (nodesLeftInLayer === 0) {
      nodesLeftInLayer = nodesInNextLater
      nodesInNextLater = 0
      movesCount++
    }
  }

  return { parentsMatrix: globalParent, movesCount, hasPath: endReached }
}

const exploreNeighborhood = (x, y, destX, destY, grid) => {
  for (let i = 0; i < 4; i++) {
    const neighborX = x + DX[i]
    const neighborY = y + DY[i]

    // Skip out of bounds locations
    if (neighborX < 0 || neighborY < 0) continue
    if (neighborX >= WIDTH_LIMIT || neighborY >= HEIGHT_LIMIT) continue

    // Skip visited locations and blocked cells
    if (globalVisited[neighborY][neighborX]) continue
    if (grid[neighborY][neighborX] !== false && (neighborX !== destX || neighborY !== destY))
      continue

    xQueue.push(neighborX)
    yQueue.push(neighborY)
    globalVisited[neighborY][neighborX] = true
    globalParent[neighborY][neighborX] = { x, y }
    nodesInNextLater++
  }
}

// eslint-disable-next-line no-unused-vars
export const printMatrix = matrix => {
  let finalPrint = ''
  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    let row = ''
    for (let j = 0; j < WIDTH_LIMIT; j++) {
      if (matrix[i][j] !== false) row += matrix[i][j]
      // '*'
      else row += '.'
    }
    row += '\n'
    finalPrint += row
  }
  console.error(finalPrint)
}
