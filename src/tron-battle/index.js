import attackStrategy from './strategies/attackStrategy'

const WIDTH_LIMIT = 30
const HEIGHT_LIMIT = 20

let movesCount
let nodesLeftInLayer
let nodesInNextLater

let xQueue
let yQueue

let globalVisited
let globalParent
let globalGrid = []

for (let i = 0; i < HEIGHT_LIMIT; i++) {
  globalGrid.push(Array(WIDTH_LIMIT).fill(false))
}

// UP, DOWN, LEFT, RIGHT direction vectors
const dx = [-1, 1, 0, 0]
const dy = [0, 0, -1, 1]

const exploreNeighborhood = (x, y, destX, destY) => {
  for (let i = 0; i < 4; i++) {
    const neighborX = x + dx[i]
    const neighborY = y + dy[i]
    
    // Skip out of bounds locations
    if (neighborX < 0 || neighborY < 0) continue
    if (neighborX >= WIDTH_LIMIT || neighborY >= HEIGHT_LIMIT) continue

    // Skip visited locations and blocked cells
    if (globalVisited[neighborY][neighborX]) continue
    if (globalGrid[neighborY][neighborX] !== false && (neighborX !== destX || neighborY !== destY)) continue

    xQueue.push(neighborX)
    yQueue.push(neighborY)
    globalVisited[neighborY][neighborX] = true
    globalParent[neighborY][neighborX] = { x, y }
    nodesInNextLater++
  }
}

// BFS in a grid
const findPath = (myX, myY, oppX, oppY) => {
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

      exploreNeighborhood(x, y, oppX, oppY)

      nodesLeftInLayer--
      if (nodesLeftInLayer === 0) {
        nodesLeftInLayer = nodesInNextLater
        nodesInNextLater = 0
        movesCount++
      }
    }

    return endReached
      ? globalParent
      : -1
}

const printMatrix = (matrix) => {
  finalPrint = ''
  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    row = ''
    for(let j = 0; j < WIDTH_LIMIT; j++) {
      if (matrix[i][j] !== false) row += matrix[i][j]// '*'
      else row += '.'
    }
    row += '\n'
    finalPrint += row
  }
  console.error(finalPrint)
}

///////////////////////////////////////////////////

const UP = 'UP'
const DOWN = 'DOWN'
const RIGHT = 'RIGHT'
const LEFT = 'LEFT'

let lastHorizontalMove = RIGHT
let lastVerticalMove = UP

const nextStep = (myX, myY, grid, oppX, oppY) => {
  let result

  // TODO: DEDUP
  const counter = countVisitableNodes(myX, myY, grid)
  // console.error('counter:', counter) // DEBUG

  const isCuttingEdge = Object.values(counter)
    .filter(count => count > 0)
    .some((val, i, arr) => val !== arr[0])

  if (isCuttingEdge) {
    result = cuttingEdgeStrategy.nextStep(counter)
  }
  else {
    const getNeighbor = neighborsOf(myX, myY)

    // old strategy
    if (canMoveTo(getNeighbor(RIGHT), grid)) {
        result = RIGHT
    } else if (canMoveTo(getNeighbor(LEFT), grid)) {
        result = LEFT
    } else if (lastVerticalMove === UP) {
        result = canMoveTo(getNeighbor(UP), grid) ? UP : DOWN
    } else {
        result = canMoveTo(getNeighbor(DOWN), grid) ? DOWN : UP
    }

    if (result === UP || result === DOWN)
        lastVerticalMove = result
  }
  
  return result
}

const cuttingEdgeStrategy = {
  nextStep: (counter) => {
    let maxCountStep
    let maxCount = -Infinity
    
    Object.entries(counter).map(([step, count]) => {
      if (count > maxCount) {
        maxCount = count
        maxCountStep = step
      }
    })
  
    return maxCountStep
  }
}


const neighborsOf = (x, y) => (step) => {
  switch (step) {
    case RIGHT: return { x: x + 1, y }
    case LEFT: return { x: x - 1, y }
    case UP: return { x, y: y - 1 }
    case DOWN: return { x, y: y + 1 }
    default:
      throw new Error(`Invalid step: "${step}"`)
  }
}

const countVisitableNodes = (currentX, currentY, grid) => {
  const counter = { [RIGHT]: 0, [LEFT]: 0, [UP]: 0, [DOWN]: 0 }

  const getNeighbor = neighborsOf(currentX, currentY)
  const steps = [RIGHT, LEFT, UP, DOWN]

  steps.map(step => {
    if (canMoveTo(getNeighbor(step), grid)) {
      counter[step] = countVisitableNodesFrom(getNeighbor(step))
    }
  })

  return counter
}

const countVisitableNodesFrom = ({ x, y }) => {
  let finalCount = 0

  findPath(x, y, -1, -1)

  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    finalCount += globalVisited[i].reduce((count, visited) => visited ? count + 1 : count, 0)
  }
  
  return finalCount
}

const canMoveTo = ({ x, y }, grid) => !isOutOfGrid(x, y) && !isCollision(x, y, grid)

const isOutOfGrid = (x, y) =>
  x < 0 || y < 0 || x >= WIDTH_LIMIT || y >= HEIGHT_LIMIT

const isCollision = (x, y, grid) => grid[y][x] !== false

const removeDeadPlayerFromGrid = (player) => {
  for (let y = 0; y < HEIGHT_LIMIT; y++) {
    for (let x = 0; x < WIDTH_LIMIT; x++) {
      if (globalGrid[y][x] === player) {
        globalGrid[y][x] = false
      }
    }
  }
}

// game loop
while (true) {
  var inputs = readline().split(' ');
  const N = parseInt(inputs[0]); // total number of players (2 to 4).
  const me = parseInt(inputs[1]); // your player number (0 to 3).

  let myX
  let myY
  let oppX
  let oppY

  for (let player = 0; player < N; player++) {
      var inputs = readline().split(' ');
      const x0 = parseInt(inputs[0]); // starting X coordinate of lightcycle (or -1)
      const y0 = parseInt(inputs[1]); // starting Y coordinate of lightcycle (or -1)
      const x1 = parseInt(inputs[2]); // starting X coordinate of lightcycle (can be the same as X0 if you play before this player)
      const y1 = parseInt(inputs[3]); // starting Y coordinate of lightcycle (can be the same as Y0 if you play before this player)
      
      // skip dead players
      if (x1 === -1 && y1 === -1) {
        removeDeadPlayerFromGrid(player)
        continue
      }

      globalGrid[y0][x0] = player
      globalGrid[y1][x1] = player

      // printMatrix(globalGrid) // DEBUG

      if (player === me) {
          myX = x1
          myY = y1
      } else {
          oppX = x1
          oppY = y1
      }
  }
  
  // TODO: DEDUP
  const counter = countVisitableNodes(myX, myY, globalGrid)

  const isCuttingEdge = Object.values(counter)
    .filter(count => count > 0)
    .some((val, i, arr) => val !== arr[0])

  const parentMatrix = findPath(myX, myY, oppX, oppY)

  const hasPath = parentMatrix !== -1 && movesCount > 1
    
  if (isCuttingEdge) {
    console.log(cuttingEdgeStrategy.nextStep(counter))
  } else if (hasPath) {
    const nextAttackStep = attackStrategy.nextStep(myX, myY, oppX, oppY, parentMatrix)
    console.log(nextAttackStep)
  } else {
    const step = nextStep(myX, myY, globalGrid, oppX, oppY)
    console.log(step)
  }
}
