import { loadInput } from './helpers'

async function main() {
  const corresp = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
    X: 'rock',
    Y: 'paper',
    Z: 'scissors'
  }

  const input = await loadInput('02')
  const scores = input.map((row) => {
    const [first, second] = row.split(' ')
    const adversary = corresp[first]
    const self = corresp[second]
    return shapeScore(self) + outcomeScore(adversary, self)
  })
  const sum = scores.reduce((total, item) => total + item, 0)
  console.log('Cumulated score: ' + sum)

  const scores2 = input.map((row) => {
    const [first, second] = row.split(' ')
    const adversary = corresp[first]
    const self = findShape(adversary, second)
    return shapeScore(self) + outcomeScore(adversary, self)
  })
  const sum2 = scores2.reduce((total, item) => total + item, 0)
  console.log('Cumulated score: ' + sum2)
}
main()

function findShape(adversary, outcome) {
  if (outcome === 'Y') {
    return adversary
  }
  if (outcome === 'Z') {
    return { rock: 'paper', paper: 'scissors', scissors: 'rock' }[adversary]
  }
  return { rock: 'scissors', paper: 'rock', scissors: 'paper' }[adversary]
}

function shapeScore(shape) {
  const scores = { rock: 1, paper: 2, scissors: 3 }
  return scores[shape]
}
function outcomeScore(adversary, self) {
  if (adversary === self) {
    return 3
  }

  if (
    (self === 'rock' && adversary === 'scissors') ||
    (self === 'paper' && adversary === 'rock') ||
    (self === 'scissors' && adversary === 'paper')
  ) {
    return 6
  }

  return 0
}
