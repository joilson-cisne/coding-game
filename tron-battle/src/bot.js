import frontierStrategy from './strategies/frontier'

const nextStep = (positions, me, grid) =>
  frontierStrategy.nextStep(positions, me, grid)

export default {
  nextStep,
}
