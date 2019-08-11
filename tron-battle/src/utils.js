import { RIGHT, LEFT, UP, DOWN, WIDTH_LIMIT, HEIGHT_LIMIT } from './constants'

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
let playerQueue

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

// UP, DOWN, LEFT, RIGHT direction vectors
const dx = [-1, 1, 0, 0]
const dy = [0, 0, -1, 1]

const exploreNeighborhood = (x, y, destX, destY, grid) => {
  for (let i = 0; i < 4; i++) {
    const neighborX = x + dx[i]
    const neighborY = y + dy[i]

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

export const findFrontier = (sources, grid) => {
  // Initial setup
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
  playerQueue = []

  // Algorithm start
  sources.map(src => {
    // TODO: Convert into a single object
    xQueue.push(src.x)
    yQueue.push(src.y)
    playerQueue.push(src.player)
    
    globalVisited[src.y][src.x] = src.player
  })

  while (xQueue.length > 0) {
    let x = xQueue.shift()
    let y = yQueue.shift()
    let player = playerQueue.shift()
    
    exploreFrontierNeighborhood(x, y, player, grid)
  }

  return  globalVisited
}

const exploreFrontierNeighborhood = (x, y, player, grid) => {
  for (let i = 0; i < 4; i++) {
    const neighborX = x + dx[i]
    const neighborY = y + dy[i]

    // Skip out of bounds locations
    if (neighborX < 0 || neighborY < 0) continue
    if (neighborX >= WIDTH_LIMIT || neighborY >= HEIGHT_LIMIT) continue

    // Skip visited locations and blocked cells
    if (globalVisited[neighborY][neighborX] !== false) continue
    if (grid[neighborY][neighborX] !== false)
      continue

    xQueue.push(neighborX)
    yQueue.push(neighborY)
    playerQueue.push(player)
    globalVisited[neighborY][neighborX] = player
    globalParent[neighborY][neighborX] = { x, y }
    nodesInNextLater++
  }
}
