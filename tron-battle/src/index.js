import bot from './bot'
import { WIDTH_LIMIT, HEIGHT_LIMIT } from './constants.js'
import { isDead, removeDeadPlayerFromGrid } from './utils'

let globalGrid = []
for (let i = 0; i < HEIGHT_LIMIT; i++) {
  globalGrid.push(Array(WIDTH_LIMIT).fill(false))
}

// game loop
while (true) {
  // eslint-disable-next-line no-undef
  var inputs = readline().split(' ')
  const N = parseInt(inputs[0]) // total number of players (2 to 4).
  const myPlayerIndex = parseInt(inputs[1]) // your player number (0 to 3).

  let livePlayersPositions = []
 
  for (let player = 0; player < N; player++) {
    // eslint-disable-next-line no-undef
    inputs = readline().split(' ')
    const x0 = parseInt(inputs[0]) // starting X coordinate of lightCycle (or -1)
    const y0 = parseInt(inputs[1]) // starting Y coordinate of lightCycle (or -1)
    const x1 = parseInt(inputs[2]) // starting X coordinate of lightCycle (can be the same as X0 if you play before this player)
    const y1 = parseInt(inputs[3]) // starting Y coordinate of lightCycle (can be the same as Y0 if you play before this player)

    const playerPosition = { x: x1, y: y1, player }

    if (isDead(playerPosition)) {
      globalGrid = removeDeadPlayerFromGrid(player, globalGrid)
    } else {
      livePlayersPositions.push(playerPosition)
      globalGrid[y0][x0] = player
      globalGrid[y1][x1] = player
    }
  }

  console.log(bot.nextStep(livePlayersPositions, myPlayerIndex, globalGrid))
}
