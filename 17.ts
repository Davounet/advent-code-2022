import { loadInput } from './helpers'

const rocks = [
  { template: [0b1111], width: 4 },
  { template: [0b10, 0b111, 0b10], width: 3 },
  { template: [0b1, 0b1, 0b111], width: 3 },
  { template: [0b1, 0b1, 0b1, 0b1], width: 1 },
  { template: [0b11, 0b11], width: 2 }
]

const heights: number[] = []
const store: Record<string, any> = {}
const cycle = { modulo: 0, gain: 0 }

async function main() {
  const input = await loadInput('17')
  const jets = input[0]
  const jetsLength = jets.length

  const simulation: number[] = []
  let rockIndex = 0
  let jetIndex = 0

  while (true) {
    heights.push(simulation.length)
    let rockId = rockIndex % 5
    let jetId = jetIndex % jetsLength
    const key = `${rockId}|${jetId}`
    const value = { index: rockIndex, height: simulation.length }

    // Found a repeating pattern
    if (store[key] && rockIndex > 3000) {
      const previous = store[key]
      cycle.modulo = value.index - previous.index
      cycle.gain = value.height - previous.height
      break
    } else {
      store[key] = value
    }

    const rock = rocks[rockIndex % 5]
    let isStopped = false
    let offset = 2
    let fall = 0

    // Add necessary space to the simultation
    Array.from({ length: 3 + rock.template.length }).forEach(() => simulation.unshift(0b0))

    // Make the rock fall as long as possible
    while (!isStopped) {
      const jet = jets[jetIndex % jetsLength] === '>' ? 1 : -1
      const move = canMove(rock, simulation, offset, fall, jet)
      if (move) {
        offset += move
        jetIndex++
      } else {
        jetIndex++
      }

      if (canFall(rock, simulation, offset, fall)) {
        fall++
      } else {
        isStopped = true
      }
    }

    // Print the rock in the simulation
    const rockMask = getRockMask(rock, offset)
    rockMask.forEach((mask, i) => (simulation[fall + i] = simulation[fall + i] | mask))

    // Remove empty lines at the top
    while (!simulation[0]) simulation.shift()
    rockIndex++
  }

  console.log(`Height after the 2022th block: ${heights[2022]}`)
  const target = 1000000000000
  const base = heights[target % cycle.modulo]
  const gain = Math.floor(target / cycle.modulo) * cycle.gain
  console.log(`Height after the 1000000000000th block: ${base + gain}`)
}

function getRockMask(rock, offset): number[] {
  return rock.template.map((row) => row << (7 - offset - rock.width))
}

function canMove(rock, simulation, offset, fall, jet): number {
  const move = offset + jet > 7 - rock.width || offset + jet < 0 ? 0 : jet
  const rockMask = getRockMask(rock, offset + move)
  if (rockMask.every((mask, i) => !(simulation[fall + i] & mask))) {
    return move
  } else {
    return 0
  }
}

function canFall(rock, simulation, offset, fall): boolean {
  // Check if we are at the bottom
  if (rock.template.length + fall >= simulation.length) return false

  const rockMask = getRockMask(rock, offset)
  return rockMask.every((mask, i) => !(simulation[fall + i + 1] & mask))
}
function displayMask(mask: number): void {
  const line = Array.from({ length: 7 })
    .map((_, i) => (mask & (0b1 << i) ? '#' : ' '))
    .reverse()
    .join('')
  console.log(`|${line}|`)
}
function displaySimulation(simulation): void {
  console.log('       ')
  let i
  for (i = 0; i < simulation.length; i++) {
    displayMask(simulation[i] || 0b0)
  }
  console.log('+-------+')
}

main()
