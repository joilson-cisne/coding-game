import { neighborsOf, canMoveTo } from '../utils'
import { RIGHT, LEFT, UP, DOWN } from '../constants'

let lastVerticalMove = UP

const nextStep = (myX, myY, grid) => {
  let result

  const getNeighbor = neighborsOf(myX, myY)

  if (canMoveTo(getNeighbor(RIGHT), grid)) {
    result = RIGHT
  } else if (canMoveTo(getNeighbor(LEFT), grid)) {
    result = LEFT
  } else if (lastVerticalMove === UP) {
    result = canMoveTo(getNeighbor(UP), grid) ? UP : DOWN
  } else {
    result = canMoveTo(getNeighbor(DOWN), grid) ? DOWN : UP
  }

  if (result === UP || result === DOWN) lastVerticalMove = result

  return result
}

export default {
  nextStep,
}
