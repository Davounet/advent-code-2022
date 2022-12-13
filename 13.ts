import { chunk, loadInput } from './helpers'

async function main() {
  const input = await loadInput('13')
  const pairs = chunk(input, 3)
    .map((group) => group.slice(0, 2))
    .map((pair) => pair.map((packet) => eval(packet)))

  const sum = pairs.reduce((total, [left, right], index) => {
    const comparison = compare(left, right)
    return comparison ? total + index + 1 : total
  }, 0)
  console.log(`Sum of good pairs : ${sum}`)

  const full = input.filter((row) => row.length > 0).map((packet) => eval(packet))
  const divider1 = [[2]]
  const divider2 = [[6]]
  full.push(divider1, divider2)
  const sorted = full.sort((a, b) => (compare(a, b) ? -1 : 1))
  const index1 = sorted.indexOf(divider1) + 1
  const index2 = sorted.indexOf(divider2) + 1
  console.log(`Decoder key: ${index1 * index2}`)
}

const compare = (a, b) => {
  if (Number.isInteger(a) && Number.isInteger(b)) {
    if (a === b) return undefined
    return a < b
  }

  const left = Array.isArray(a) ? a : [a]
  const right = Array.isArray(b) ? b : [b]

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const comparison = compare(left[i], right[i])
    if (comparison !== undefined) return comparison
  }
  return compare(left.length, right.length)
}
main()
