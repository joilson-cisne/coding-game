import bot from './bot'
import { WIDTH_LIMIT, HEIGHT_LIMIT } from './constants.js'

let globalGrid = []
for (let i = 0; i < HEIGHT_LIMIT; i++) {
  globalGrid.push(Array(WIDTH_LIMIT).fill(false))
}

const removeDeadPlayerFromGrid = (player, grid) => {
  for (let y = 0; y < HEIGHT_LIMIT; y++) {
    for (let x = 0; x < WIDTH_LIMIT; x++) {
      if (grid[y][x] === player) {
        grid[y][x] = false
      }
    }
  }

  return grid
}

const deadFactory = currentPosition => (player) =>
  currentPosition[player].x === -1
  && currentPosition[player].y === -1


// game loop
while (true) {
  // eslint-disable-next-line no-undef
  var inputs = readline().split(' ')
  const N = parseInt(inputs[0]) // total number of players (2 to 4).
  const myIndex = parseInt(inputs[1]) // your player number (0 to 3).

  let currentPosition = []
  let isDead

  for (let player = 0; player < N; player++) {
    // eslint-disable-next-line no-undef
    inputs = readline().split(' ')
    const x0 = parseInt(inputs[0]) // starting X coordinate of lightCycle (or -1)
    const y0 = parseInt(inputs[1]) // starting Y coordinate of lightCycle (or -1)
    const x1 = parseInt(inputs[2]) // starting X coordinate of lightCycle (can be the same as X0 if you play before this player)
    const y1 = parseInt(inputs[3]) // starting Y coordinate of lightCycle (can be the same as Y0 if you play before this player)

    currentPosition[player] = { x: x1, y: y1 }

    isDead = deadFactory(currentPosition)

    if (isDead(player)) {
      removeDeadPlayerFromGrid(player, globalGrid)
    } else {
      globalGrid[y0][x0] = player
      globalGrid[y1][x1] = player
    }
  }

  const me = currentPosition[myIndex]
  const liveOpponents = currentPosition
    .filter((value, player) => player !== myIndex && !isDead(player))

  console.log(bot.nextStep(me, liveOpponents, globalGrid))
}
