import { loadInput } from './helpers'

type Position = {
  x: number
  y: number
  o: 'r' | 'd' | 'l' | 'u'
}
const orientations: ('r' | 'd' | 'l' | 'u')[] = ['r', 'd', 'l', 'u']

async function main() {
  const input = await loadInput('22', false)

  const rawMap = input.slice(0, input.length - 2)
  const max = {
    x: Math.max(...rawMap.map((row) => row.length)),
    y: input.length - 2
  }
  const directions: string[] = input[input.length - 1].match(/\d+|(L|R)/g)!

  const map: string[][] = rawMap.map((row) =>
    Array.from({ length: max.x }).map((_, i) => (!row[i] || row[i] === ' ' ? '_' : row[i]))
  )
  let current: Position = {
    x: map[0].findIndex((c) => c === '.'),
    y: 0,
    o: 'r'
  }

  directions.forEach((order) => (current = handleOrder(order, current, map, max)))
  const part1 = currentToPassword(current)
  console.log(`Password for part1: ${part1}`)
}

function handleOrder(order, current: Position, map: string[][], max): Position {
  if (isNaN(Number(order))) {
    return rotate(order, current)
  } else {
    const iterations = Number(order)
    let temp = { ...current }
    Array.from({ length: iterations }).map(() => (temp = move(temp, map, max)))
    return temp
  }
}
function move(current: Position, map: string[][], max): Position {
  let target: { x: number; y: number } = { x: 0, y: 0 }
  if (current.o === 'r') target = { x: current.x + 1, y: current.y }
  if (current.o === 'd') target = { x: current.x, y: current.y + 1 }
  if (current.o === 'l') target = { x: current.x - 1, y: current.y }
  if (current.o === 'u') target = { x: current.x, y: current.y - 1 }

  while ((map?.[target.y]?.[target.x] ?? '_') === '_') {
    if (current.o === 'r') target.x = (target.x + 1 + max.x) % max.x
    if (current.o === 'd') target.y = (target.y + 1 + max.y) % max.y
    if (current.o === 'l') target.x = (target.x - 1 + max.x) % max.x
    if (current.o === 'u') target.y = (target.y - 1 + max.y) % max.y
  }
  if (map[target.y][target.x] === '.') return { x: target.x, y: target.y, o: current.o }
  return { ...current }
}
function rotate(order, current: Position): Position {
  const index = (orientations.indexOf(current.o) + 4 + (order === 'L' ? -1 : 1)) % 4
  return { ...current, o: orientations[index] }
}

function currentToPassword(current: Position): number {
  return 1000 * (current.y + 1) + 4 * (current.x + 1) + orientations.indexOf(current.o)
}

main()
