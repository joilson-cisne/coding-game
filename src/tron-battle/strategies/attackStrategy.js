const nextStep = (myX, myY, oppX, oppY, parent) => {
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

export default {
  nextStep
}
