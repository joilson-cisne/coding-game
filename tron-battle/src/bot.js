import frontierStrategy from './strategies/frontier'

const nextStep = (me, opponents, grid) =>
  frontierStrategy.nextStep([me, ...opponents], grid)

export default {
  nextStep,
}
