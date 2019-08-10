import cuttingEdgeStrategy from './strategies/cuttingEdge'
import frontierStrategy from './strategies/frontier'

import { countVisitableNodes } from './utils'

const isCuttingEdge = (myX, myY, globalGrid) => {
  const counter = countVisitableNodes(myX, myY, globalGrid)

  return Object.values(counter)
    .filter(count => count > 0)
    .some((val, i, arr) => val !== arr[0])
}

const nextStep = (me, opponents, grid) => {
  const myX = me.x
  const myY = me.y

  return isCuttingEdge(myX, myY, grid)
    ? cuttingEdgeStrategy.nextStep(myX, myY, grid)
    : frontierStrategy.nextStep([me, ...opponents], grid)
}

export default {
  nextStep,
}
