/**
 * d: distance between the current position and the target letter (moving registers and letters inside a register)
 * dr[i]: distance from the current register to the i-th register
 * dl[i]: distance from the current letter to the target letter in the i-th register
 * 
 * d = min(dr[i] + dl[i]), for all registers i
 */

// const magicPhrase = readline();
const magicPhrase = process.argv[2] || 'AZ';

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

const getAlphabetOperatorAndCount = (currentIndex, targetIndex) => {
    let operator = ''

    const diff = targetIndex - currentIndex

    const mod1 = mod(diff, ALPHABET_SIZE)
    const mod2 = mod(-diff, ALPHABET_SIZE)

    if (mod1 < mod2) {
        operator = '+'
    } else if (mod2 < mod1) {
        operator = '-'
    }

    count = Math.min(mod1, mod2)

    return { operator, count }
}

const getRegisterOperatorAndCount = (origin, destination) => {
    let operator = ''

    const diff = destination - origin

    const mod1 = mod(diff, TOTAL_REGISTERS)
    const mod2 = mod(-diff, TOTAL_REGISTERS)
    
    if (mod1 < mod2) {
        operator = '>'
    } else if (mod2 < mod1) {
        operator = '<'
    }

    count = Math.min(mod1, mod2)

    return { operator, count }
}


const getMovingLetterCommand = (origin, target) => {
    let command = ''

    const currentAlphabetIndex = getAlphabetIndex(origin)
    const targetAlphabetIndex = getAlphabetIndex(target)

    const { operator, count } = getAlphabetOperatorAndCount(currentAlphabetIndex, targetAlphabetIndex)

    // console.error({ operator, count })
    command += operator.repeat(count)
    command += '.' // TODO: remove this responsibility from here

    return command
}

const getMovingRegisterCommand = (origin, destination) => {
    let command = ''

    const { operator, count } = getRegisterOperatorAndCount(origin, destination)

    // console.error({ operator, count })
    command += operator.repeat(count)

    return command
}

magicPhrase.split('').map(target => {
    let minCommandSize = Infinity
    let selectedRegister = 0
    let minCommand = ''

    for (let i = 0; i < TOTAL_REGISTERS; i++) {
        let tempCommand = getMovingLetterCommand(registers[i], target)
        let tempCommandLength = tempCommand.length

        if (tempCommandLength < minCommandSize) {
            minCommandSize = tempCommandLength
            selectedRegister = i
            minCommand = tempCommand
        }
    }

    registers[selectedRegister] = target
    result += getMovingRegisterCommand(currentRegister, selectedRegister)
    result += minCommand
})

console.log(result);
