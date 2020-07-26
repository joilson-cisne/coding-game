/**
 * d: distance between the current position and the target letter (moving registers and letters inside a register)
 * dr[i]: distance from the current register to the i-th register
 * dl[i]: distance from the current letter to the target letter in the i-th register
 * 
 * d = min(dr[i] + dl[i]), for all registers i
 */

// const magicPhrase = readline();
const magicPhrase = process.argv[2] || 'MINAS';
console.error(magicPhrase)

const ALPHABET_SIZE = 27
const TOTAL_REGISTERS = 30

let registers = new Array(TOTAL_REGISTERS).fill(' ')
let currentRegister = 0
let result = ''

const getAlphabetIndex = (letter) => {
  if (!letter || letter == ' ') {
    return 0
  }
  
  return letter.charCodeAt() - 64
}

const mod = (a, b) => ((a % b) + b) % b

const incrementRegister = register => mod(register + 1, TOTAL_REGISTERS)

const getOperatorAndCount = (current, target, operators, loopSize) => {
    let operator = ''
    let count = 0

    const diff = target - current

    const mod1 = mod(diff, loopSize)
    const mod2 = mod(-diff, loopSize)

    operator = mod1 <= mod2
        ? operators.increase
        : operators.decrease

    count = Math.min(mod1, mod2)

    return { operator, count }
}

const getMovingCommand = (destinationRegister, targetLetter) => {
    let registerCommand = getMovingRegisterCommand(currentRegister, destinationRegister)
    let letterCommand = getMovingLetterCommand(registers[destinationRegister], targetLetter)

    return registerCommand + letterCommand
}

const getMovingLetterCommand = (origin, target) => {
    let command = ''

    const currentAlphabetIndex = getAlphabetIndex(origin)
    const targetAlphabetIndex = getAlphabetIndex(target)

    const { operator, count } = getOperatorAndCount(currentAlphabetIndex, targetAlphabetIndex, { increase: '+', decrease: '-'}, ALPHABET_SIZE)

    command += operator.repeat(count)

    return command
}

const getMovingRegisterCommand = (origin, destination) => {
    let command = ''

    const { operator, count } = getOperatorAndCount(origin, destination, { increase: '>', decrease: '<'}, TOTAL_REGISTERS)

    command += operator.repeat(count)

    return command
}

const getShortestCommandTo = (targetLetter) => {
    let shortestCommand = ''
    let shortestCommandLength = Infinity
    let selectedRegister = 0

    for (let i = 0; i < TOTAL_REGISTERS; i++) {
        let command = getMovingCommand(i, targetLetter);
        
        if (command.length < shortestCommandLength) {
            shortestCommandLength = command.length
            selectedRegister = i
            shortestCommand = command
        }
    }

    return { shortestCommand, selectedRegister }
}


magicPhrase.split('').map(targetLetter => {
    let { shortestCommand, selectedRegister } = getShortestCommandTo(targetLetter)
    
    registers[selectedRegister] = targetLetter
    currentRegister = selectedRegister
    
    result += shortestCommand + '.'
})

console.log(result);
