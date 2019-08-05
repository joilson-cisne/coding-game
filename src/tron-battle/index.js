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
      x = xQueue.shift()
      y = yQueue.shift()

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

const findNextStep = (myX, myY, oppX, oppY, parent) => {
    // console.error('me:', myX, myY) // DEBUG
    // console.error('opp:', oppX, oppY) // DEBUG
    
    let { x, y } = parent[oppY][oppX]
    // console.error([x, y]) // DEBUG
    let nextX
    let nextY
    

    while (x !== myX || y !== myY) {
        nextX = x
        nextY = y
        
        if (parent[nextY][nextX]) {
            x = parent[nextY][nextX].x
            y = parent[nextY][nextX].y
        }

        // console.error([x, y]) // DEBUG
    }
    
    return getNextDirection(myX, myY, nextX, nextY)
}

const getNextDirection = (myX, myY, nextX, nextY) => {
    return myX === nextX
        ? myY < nextY ? 'DOWN' : 'UP'
        : myX < nextX ? 'RIGHT' : 'LEFT'
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

lastHorizontalMove = RIGHT
lastVerticalMove = UP

const nextStep = (...params) => {
    let result

    // is a cutting edge? true

    // for each possible direction, calculate the quantity of reachable empty spaces
    const counter = countReachableSpaces(...params)
    // console.error('counter:', counter) // DEBUG

    if (Object.values(counter).filter(count => count > 0).some((count1, count2) => count1 !== count2)) {
      // then choose the step towards the biggest count
      let maxStep
      let maxCount = -Infinity
      
      Object.entries(counter).map(([step, count]) => {
        if (count > maxCount) {
          maxCount = count
          maxStep = step
        }
      })

      // console.error('max:', [maxStep, maxCount]) // DEBUG
      result = maxStep
    }
    else {
      // else continue with the old strategy

      // old strategy
      if (canMoveRight(...params)) {
          result = RIGHT
      } else if (canMoveLeft(...params)) {
          result = LEFT
      } else if (lastVerticalMove === UP) {
          result = canMoveUp(...params) ? UP : DOWN
      } else {
          result = canMoveDown(...params) ? DOWN : UP
      }

      if (result === UP || result === DOWN)
          lastVerticalMove = result
    }
    
    return result
}

const countReachableSpaces = (currentX, currentY, path) => {
  const counter = { [RIGHT]: 0, [LEFT]: 0, [UP]: 0, [DOWN]: 0 }

  if (canMoveRight(currentX, currentY, path)) {
    counter[RIGHT] = countSpaces(currentX + 1, currentY)
  }

  if (canMoveLeft(currentX, currentY, path)) {
    counter[LEFT] = countSpaces(currentX - 1, currentY)
  }

  if (canMoveUp(currentX, currentY, path)) {
    counter[UP] = countSpaces(currentX, currentY - 1)
  }

  if (canMoveDown(currentX, currentY, path)) {
    counter[DOWN] = countSpaces(currentX, currentY + 1)
  }

  return counter
}

const countSpaces = (x, y) => {
  let finalCount = 0

  findPath(x, y, -1, -1)

  // countVisited nodes
  for (let i = 0; i < HEIGHT_LIMIT; i++) {
    finalCount += globalVisited[i].reduce((count, visited) => visited ? count + 1 : count, 0)
  }
  
  return finalCount
}

const canMoveRight = (currentX, currentY, grid) =>
  currentX !== WIDTH_LIMIT - 1 && grid[currentY][currentX + 1] === false

const canMoveLeft = (currentX, currentY, grid) =>
  currentX !== 0 && grid[currentY][currentX - 1] === false

const canMoveUp = (currentX, currentY, grid) =>
  currentY !== 0 && grid[currentY - 1][currentX] === false

const canMoveDown = (currentX, currentY, grid) =>
  currentY !== HEIGHT_LIMIT - 1 && grid[currentY + 1][currentX] === false

const removeDeadPlayer = (grid, player) => {
  for (let y = 0; y < HEIGHT_LIMIT; y++) {
    for (let x = 0; x < WIDTH_LIMIT; x++) {
      if (grid[y][x] === player) {
        grid[y][x] = false
      }
    }
  }

  return grid
}

// game loop
while (true) {
    var inputs = readline().split(' ');
    const N = parseInt(inputs[0]); // total number of players (2 to 4).
    const me = parseInt(inputs[1]); // your player number (0 to 3).

    for (let player = 0; player < N; player++) {
        var inputs = readline().split(' ');
        const x0 = parseInt(inputs[0]); // starting X coordinate of lightcycle (or -1)
        const y0 = parseInt(inputs[1]); // starting Y coordinate of lightcycle (or -1)
        const x1 = parseInt(inputs[2]); // starting X coordinate of lightcycle (can be the same as X0 if you play before this player)
        const y1 = parseInt(inputs[3]); // starting Y coordinate of lightcycle (can be the same as Y0 if you play before this player)
        
        // skip dead players
        if (x1 === -1 && y1 === -1) {
          globalGrid = removeDeadPlayer(globalGrid, player)
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
    
    const parentMatrix = findPath(myX, myY, oppX, oppY)
    const hasPath = parentMatrix !== -1 && movesCount > 1
    
    if (hasPath) {
        const nextAttackStep = findNextStep(myX, myY, oppX, oppY, parentMatrix)
        // console.error('nextAttackStep', nextAttackStep) // DEBUG
        console.log(nextAttackStep)
    } else {
        const step = nextStep(myX, myY, globalGrid, oppX, oppY)
        console.log(step)
    }
    
    // if (count === 0) { printMatrix(grid); count++ } // DEBUG
}
