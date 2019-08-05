const nextStep = (counter) => {
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

export default {
  nextStep
}
