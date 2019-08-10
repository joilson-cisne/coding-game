import { countVisitableNodes } from '../utils'

const nextStep = (myX, myY, globalGrid) => {
  let maxCountStep
  let maxCount = -Infinity

  const counter = countVisitableNodes(myX, myY, globalGrid)
  
  Object.entries(counter).map(([step, count]) => {
    if (count > maxCount) {
      maxCount = count
      maxCountStep = step
    }
  })

  return maxCountStep
}

export default {
  nextStep,
}
