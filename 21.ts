import { loadInput } from './helpers'

async function main() {
  const input = await loadInput('21')

  const monkeys = Object.fromEntries(
    input.map((row) => {
      const [name, purpose] = row.split(': ')
      if (isNaN(Number(purpose))) {
        return [name, purpose.split(' ')]
      } else {
        return [name, Number(purpose)]
      }
    })
  )
  const part1 = getMonkey('root', monkeys)
  console.log(`Number shouted by root : ${part1}`)

  const part2 = inverseMonkey('root', 0, monkeys)
  console.log(`Human should shout ${part2}`)
}

function getMonkey(name, list) {
  const value = list[name]
  if (Number.isInteger(value)) return value

  const [m1, operator, m2] = value
  if (operator === '*') return getMonkey(m1, list) * getMonkey(m2, list)
  if (operator === '/') return getMonkey(m1, list) / getMonkey(m2, list)
  if (operator === '-') return getMonkey(m1, list) - getMonkey(m2, list)
  if (operator === '+') return getMonkey(m1, list) + getMonkey(m2, list)
}

function getMonkeyOrHuman(name, list) {
  if (name === 'humn') return false

  const value = list[name]
  if (Number.isInteger(value)) return value

  const [m1, operator, m2] = value
  const m1Value = getMonkeyOrHuman(m1, list)
  const m2Value = getMonkeyOrHuman(m2, list)
  if (m1Value === false || m2Value === false) return false

  if (operator === '*') return m1Value * m2Value
  if (operator === '/') return m1Value / m2Value
  if (operator === '-') return m1Value - m2Value
  if (operator === '+') return m1Value + m2Value
}

function inverseMonkey(name, target, list) {
  if (name === 'humn') return target

  const value = list[name]
  if (Number.isInteger(value)) return value

  let [m1, operator, m2] = value
  if (name === 'root') operator = '='
  const m1Value = getMonkeyOrHuman(m1, list)
  const m2Value = getMonkeyOrHuman(m2, list)

  if (m1Value === false) {
    // console.log(`${m1} monkey is unknown, ${m2} monkey is ${m2Value}`)
    if (operator === '=') return inverseMonkey(m1, m2Value, list)
    if (operator === '*') return inverseMonkey(m1, target / m2Value, list)
    if (operator === '/') return inverseMonkey(m1, target * m2Value, list)
    if (operator === '-') return inverseMonkey(m1, target + m2Value, list)
    if (operator === '+') return inverseMonkey(m1, target - m2Value, list)
  } else if (m2Value === false) {
    // console.log(`${m2} monkey is unknown, ${m1} monkey is ${m1Value}`)
    if (operator === '=') return inverseMonkey(m2, m1Value, list)
    if (operator === '*') return inverseMonkey(m2, target / m1Value, list)
    if (operator === '/') return inverseMonkey(m2, m1Value / target, list)
    if (operator === '-') return inverseMonkey(m2, m1Value - target, list)
    if (operator === '+') return inverseMonkey(m2, target - m1Value, list)
  }
}

main()
