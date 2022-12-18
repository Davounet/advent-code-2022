import { loadInput } from './helpers'

type Coords = [number, number, number]
const moves = [
  [0, 0, 1],
  [0, 0, -1],
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0]
]

async function main() {
  const input = await loadInput('18')

  const droplets: Coords[] = input.map(stringToCoords)
  const surface = droplets.reduce((sum, d1) => {
    const connected = droplets.filter((d2) => isConnected(d1, d2))
    return sum + 6 - connected.length
  }, 0)
  console.log(`Total surface of ${surface}`)

  const min = droplets.reduce((max, d) => Math.min(max, d[0], d[1], d[2]), Infinity) - 1
  const max = droplets.reduce((max, d) => Math.max(max, d[0], d[1], d[2]), -Infinity) + 1
  console.log(`Flooding from ${min} to ${max} for a total of ${Math.pow(max - min + 1, 3)} possible cubes`)
  const outside = flood(min, max, droplets)

  const inside: Coords[] = []
  for (let x = min; x < max; x++) {
    for (let y = min; y < max; y++) {
      for (let z = min; z < max; z++) {
        if (!outside.has(coordsToString([x, y, z]))) {
          inside.push([x, y, z])
        }
      }
    }
  }

  const insideSurface = inside.reduce((sum, d1) => {
    const connected = inside.filter((d2) => isConnected(d1, d2))
    return sum + 6 - connected.length
  }, 0)
  console.log(`There are ${droplets.length} droplets but a ${inside.length} closed volume`)
  console.log(`Total outside surface of ${insideSurface}`)
}

function isConnected(d1: Coords, d2: Coords) {
  for (let index = 0; index < 3; index++) {
    const i = index % 3,
      j = (index + 1) % 3,
      k = (index + 2) % 3
    if (d1[i] === d2[i] && d1[j] === d2[j] && Math.abs(d1[k] - d2[k]) === 1) {
      return true
    }
  }
  return false
}
function flood(min, max, droplets): Set<string> {
  const queue: string[] = [coordsToString([min, min, min])]
  const blocked = new Set()
  droplets.map(coordsToString).forEach((c) => blocked.add(c))
  const visited: Set<string> = new Set()
  const result: Set<string> = new Set()

  while (queue.length) {
    const current = queue.shift()!
    const coords = stringToCoords(current)
    result.add(current)

    const neighbours = moves
      .map((move) => listToCoords(move.map((d, i) => coords[i] + d))) // Retrieve all neighbours
      .filter((point) => point.every((v) => v >= min) && point.every((v) => v <= max)) // Filter the points outside the box
      .map(coordsToString) // Convert to string, better for Set handling

    const toVisit = neighbours
      .filter((key) => !visited.has(key))
      .filter((key) => visited.add(key))
      .filter((key) => !blocked.has(key))

    toVisit.forEach((key) => queue.push(key))
  }
  return result
}

function coordsToString(point: Coords): string {
  return point.join(',')
}
function stringToCoords(string: string): Coords {
  const [x, y, z] = string.split(',').map(Number)
  return [x, y, z]
}
function listToCoords(list: number[]): Coords {
  const [x, y, z] = list
  return [x, y, z]
}

main()
