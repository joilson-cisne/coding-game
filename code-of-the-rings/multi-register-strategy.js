/**
 * d: distance between the current position and the target letter (moving registers and letters inside a register)
 * dr[i]: distance from the current register to the i-th register
 * dl[i]: distance from the current letter to the target letter in the i-th register
 * 
 * d = min(dr[i] + dl[i]), for all registers i
 */

// const magicPhrase = readline();
const magicPhrase = process.argv[2] || 'MINAS';

// Start your code here

const ALPHABET_SIZE = 27
const TOTAL_REGISTERS = 30
const registers = new Array(TOTAL_REGISTERS).fill(' ')

console.error(magicPhrase)

let result = ''
let currentRegister = 0

const getAlphabetIndex = (letter) => {
  if (!letter || letter == ' ') {
    return 0
  }
  
  return letter.charCodeAt() - 64
}

const mod = (a, b) => ((a % b) + b) % b

const incrementRegister = register => mod(register + 1, TOTAL_REGISTERS)

const getOperatorAndCount = (currentIndex, targetIndex, operators, loopSize) => {
    let operator = ''
    let count = 0

    const diff = targetIndex - currentIndex

    const mod1 = mod(diff, loopSize)
    const mod2 = mod(-diff, loopSize)

    operator = mod1 <= mod2
        ? operators.increase
        : operators.decrease

    count = Math.min(mod1, mod2)

    return { operator, count }
}

const getMovingCommand = (destinationRegister, targetLetter) => {
    let tempRegisterCommand = getMovingRegisterCommand(currentRegister, destinationRegister)
    let tempLetterCommand = getMovingLetterCommand(registers[destinationRegister], targetLetter)

    return tempRegisterCommand + tempLetterCommand
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

magicPhrase.split('').map(targetLetter => {
    let shortestCommandLength = Infinity
    let selectedRegister = 0
    let shortestCommand = ''

    for (let i = 0; i < TOTAL_REGISTERS; i++) {
        let tempCommand = getMovingCommand(i, targetLetter);
        
        if (tempCommand.length < shortestCommandLength) {
            shortestCommandLength = tempCommand.length
            selectedRegister = i
            shortestCommand = tempCommand
        }
    }

    registers[selectedRegister] = targetLetter
    currentRegister = selectedRegister
    
    result += shortestCommand + '.'
})

console.log(result);
