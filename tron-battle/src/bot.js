import frontierStrategy from './strategies/frontier'

const nextStep = (players, me, grid) =>
  frontierStrategy.nextStep(players, me, grid)

export default {
  nextStep,
}
