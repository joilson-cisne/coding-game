/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

// const magicPhrase = readline();
const magicPhrase = process.argv[2] || 'AZ';

// Start your code here

const ALPHABET_SIZE = 27
const REGISTERS_SIZE = 30
const registers = new Array(REGISTERS_SIZE).fill(' ')

// ' ' 32 --> 0
// A   65 --> 1  (CODE - 64)
// M   77 --> 13 (CODE - 64)
// Z   90 --> 26 (CODE - 64)

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

const incrementRegister = register => mod(register + 1, REGISTERS_SIZE)

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

const getCommand = (registers, currentRegister, target) => {
    console.error('Current register:', currentRegister)
    console.error('Filled registers:', registers.filter(r => r != ' ').length)
    let command = ''

    const currentAlphabetIndex = getAlphabetIndex(registers[currentRegister])
    // console.error('currentAlphabetIndex', currentAlphabetIndex)
    const targetAlphabetIndex = getAlphabetIndex(target)
    // console.error('targetAlphabetIndex', targetAlphabetIndex)

    const { operator, count } = getAlphabetOperatorAndCount(currentAlphabetIndex, targetAlphabetIndex)

    // console.error({ operator, count })
    command += operator.repeat(count)
    command += '.'

    registers[currentRegister] = target

    return command
}

magicPhrase.split('').map(target => {
    command = getCommand(registers, 0, target)
    result += command
})

console.log(result);
