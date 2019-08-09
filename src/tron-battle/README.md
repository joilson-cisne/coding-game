# [Tron Battle](https://www.codingame.com/multiplayer/bot-programming/tron-battle)

## TODO

- [x] Consider space opened by dead players
- [x] Unify `globalGrid` and `globalPath` variables
- [x] Eliminate magical numbers
- [x] If there is a bigger reachable space go for it, even with path to the opponent
- [x] Stop pushing `[x0, y0]` on `globalPath` and `globalGrid` every time
- [x] split code into multiple files and create a script for creating a bundle
- [ ] Use the concept of reachable frontier to decide the next step
- [ ] Avoid being naively trapped when attack opponent
- [ ] Improve the filling strategy
- [ ] Adapt the usage of `findPath` to 3 players
- [ ] // TODO: remove duplication
- [ ] Remove unnecessary comments
- [ ] Purify functions and eliminate global variables
- [ ] generalize `printMatrix` to stop using global variables
- [ ] Add tests
