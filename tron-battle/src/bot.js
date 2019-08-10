import cuttingEdgeStrategy from './strategies/cuttingEdge'
import attackingStrategy from './strategies/attack'
import fillingStrategy from './strategies/fill'
import { countVisitableNodes, findPath } from './utils'

const isCuttingEdge = (myX, myY, globalGrid) => {
  const counter = countVisitableNodes(myX, myY, globalGrid)

  return Object.values(counter)
    .filter(count => count > 0)
    .some((val, i, arr) => val !== arr[0])
}

const nextStep = (myX, myY, grid, oppX, oppY) => {
  const { hasPath, parentsMatrix, movesCount } = findPath(myX, myY, oppX, oppY, grid)
  const shouldAttack = hasPath && movesCount > 1

  return isCuttingEdge(myX, myY, grid)
    ? cuttingEdgeStrategy.nextStep(myX, myY, grid)
    : shouldAttack
      ? attackingStrategy.nextStep(myX, myY, oppX, oppY, parentsMatrix)
      : fillingStrategy.nextStep(myX, myY, grid)
}

export default {
  nextStep,
}