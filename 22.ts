import { loadInput } from './helpers'

type Position = {
  x: number
  y: number
  o: 'r' | 'd' | 'l' | 'u'
}

async function main() {
  const input = await loadInput('22t', false)

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
  console.log(current)
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
  console.log('moving')
  let target: [number, number] = [0, 0]
  if (current.o === 'r') target = [current.x + 1, current.y]
  if (current.o === 'd') target = [current.x, current.y + 1]
  if (current.o === 'l') target = [current.x - 1, current.y]
  if (current.o === 'u') target = [current.x, current.y - 1]

  // This is not working
  while ((map?.[target[1]]?.[target[0]] ?? '_') === '_') {
    if (current.o === 'r') target[0] = (target[0] + 1 + max.x) % max.x
    if (current.o === 'd') target[1] = (target[1] + 1 + max.y) % max.y
    if (current.o === 'l') target[0] = (target[0] - 1 + max.x) % max.x
    if (current.o === 'u') target[1] = (target[1] - 1 + max.y) % max.y
  }
  if (map[target[1]][target[0]] === '.') return { x: target[1], y: target[0], o: current.o }
  return { ...current }
}
function rotate(order, current: Position): Position {
  console.log('rotating')
  const orientations: ('r' | 'd' | 'l' | 'u')[] = ['r', 'd', 'l', 'u']
  const index = (orientations.indexOf(current.o) + 4 + (order === 'L' ? -1 : 1)) % 4
  return { ...current, o: orientations[index] }
}

main()
