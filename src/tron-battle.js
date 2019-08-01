// Challenge: https://www.codingame.com/multiplayer/bot-programming/tron-battle

const WIDTH_LIMIT = 30
const HEIGHT_LIMIT = 20

let movesCount
let nodesLeftInLayer
let nodesInNextLater

let xQueue
let yQueue

let visited
let parent
let grid = []

for (let i = 0; i < HEIGHT_LIMIT; i++) {
  grid.push(Array(WIDTH_LIMIT).fill(false))
}

// North, South, West, East direction vectors
const dx = [-1, 1, 0, 0]
const dy = [0, 0, -1, 1]

const exploreNeighborhood = (x, y, oppX, oppY) => {
  for (let i = 0; i < 4; i++) {
    const xx = x + dx[i]
    const yy = y + dy[i]
    
    // Skip out of bounds locations
    if (xx < 0 || yy < 0) continue
    if (xx >= WIDTH_LIMIT || yy >= HEIGHT_LIMIT) continue

    // Skip visited locations and blocked cells
    if (visited[yy][xx]) continue
    if (grid[yy][xx] && (xx !== oppX || yy !== oppY)) continue

    xQueue.push(xx)
    yQueue.push(yy)
    visited[yy][xx] = true
    parent[yy][xx] = [x, y]
    nodesInNextLater++
  }
}

// BFS in a grid
const findPath = (myX, myY, oppX, oppY) => {
    // Initial setup
    movesCount = 0
    nodesLeftInLayer = 1
    nodesInNextLater = 0

    visited = []
    for (let i = 0; i < HEIGHT_LIMIT; i++) {
      visited.push(Array(WIDTH_LIMIT).fill(false))
    }

    parent = []
    for (let i = 0; i < HEIGHT_LIMIT; i++) {
      parent.push(Array(WIDTH_LIMIT).fill(false))
    }

    xQueue = []
    yQueue = []

    let endReached = false

    // Algorithm start
    xQueue.push(myX)
    yQueue.push(myY)

    visited[myY][myX] = true

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
      ? parent
      : -1
}

const findNextStep = (myX, myY, oppX, oppY, parent) => {    
    let [x, y] = parent[oppY][oppX]
    let nextX
    let nextY
    

    while (x !== myX || y !== myY) {
        nextX = x
        nextY = y
        
        if (parent[nextY][nextX]) {
            x = parent[nextY][nextX][0]
            y = parent[nextY][nextX][1]
        }
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
      if (matrix[i][j]) row += '*'
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

const path = []

let lastHorizontalMove = RIGHT
let lastVerticalMove = UP

const nextStep = (...params) => {
    let result

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
    
    return result
}

const canMoveRight = (x1, y1, path) => x1 !== 29 && !path.some(([x, y]) => x === x1 + 1 && y === y1)
const canMoveLeft = (x1, y1, path) => x1 !== 0 && !path.some(([x, y]) => x === x1 - 1 && y === y1)
const canMoveUp = (x1, y1, path) => y1 !== 0 && !path.some(([x, y]) => x === x1 && y === y1 - 1)
const canMoveDown = (x1, y1, path) => y1 !== 19 && !path.some(([x, y]) => x === x1 && y === y1 + 1)


// game loop
while (true) {
    var inputs = readline().split(' ');
    const N = parseInt(inputs[0]); // total number of players (2 to 4).
    const P = parseInt(inputs[1]); // your player number (0 to 3).

    for (let i = 0; i < N; i++) {
        var inputs = readline().split(' ');
        const x0 = parseInt(inputs[0]); // starting X coordinate of lightcycle (or -1)
        const y0 = parseInt(inputs[1]); // starting Y coordinate of lightcycle (or -1)
        const x1 = parseInt(inputs[2]); // starting X coordinate of lightcycle (can be the same as X0 if you play before this player)
        const y1 = parseInt(inputs[3]); // starting Y coordinate of lightcycle (can be the same as Y0 if you play before this player)
        
        path.push([x0, y0])
        path.push([x1, y1])
        grid[y0][x0] = true
        grid[y1][x1] = true
        
        if (i === P) {
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
        console.log(nextAttackStep)
    } else {
        const step = nextStep(myX, myY, path, oppX, oppY)
        console.log(step)
    }
}

