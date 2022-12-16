import { loadInput } from './helpers'

type Coords = [number, number]
type Pairs = { sensor: Coords; beacon: Coords; distance: number }[]
const regex = /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/

let minX = Infinity,
  maxX = -Infinity

async function main() {
  const input = await loadInput('15')
  const part1Row = 2000000
  const part2Max = 4000000

  const pairs: Pairs = input.map((row) => {
    const extract: any = row.match(regex)
    const { sx, sy, bx, by } = extract.groups

    const sensor: Coords = [parseInt(sx, 10), parseInt(sy, 10)]
    const beacon: Coords = [parseInt(bx, 10), parseInt(by, 10)]
    const distance = getDistance(sensor, beacon)

    if (sensor[0] - distance < minX) minX = sensor[0] - distance
    if (beacon[0] - distance < minX) minX = beacon[0] - distance
    if (sensor[0] + distance > maxX) maxX = sensor[0] + distance
    if (beacon[0] + distance > maxX) maxX = beacon[0] + distance

    return { sensor, beacon, distance }
  })

  const iterator = Array.from({ length: maxX - minX + 1 }).map((_, i) => i + minX)
  const sum: number = iterator.reduce((total, x) => {
    const current: Coords = [x, part1Row]
    const blocked = !canHaveBeacon(current, pairs) && isEmpty(current, pairs)
    return blocked ? total + 1 : total
  }, 0)
  console.log(`Part1: A total of ${sum} points cannot contain a beacon`)

  const spot = findBeacon(pairs, part2Max)
  console.log(`The spot [${spot[0]},${spot[1]}] is available`)
  console.log(`Tuning frequency: ${spot[0] * 4000000 + spot[1]}`)
}

function isEqual(p1: Coords, p2: Coords) {
  return p1[0] === p2[0] && p1[1] === p2[1]
}
function isEmpty(point: Coords, pairs: Pairs): boolean {
  const blocking = pairs.find(({ sensor, beacon }) => isEqual(sensor, point) || isEqual(beacon, point))
  return !blocking
}
function canHaveBeacon(point: Coords, pairs: Pairs): boolean {
  const blocking = pairs.find(({ sensor, distance }) => getDistance(point, sensor) <= distance)
  return !blocking
}
function getDistance(p1: Coords, p2: Coords): number {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
}
function isBound(point: Coords, max: number): boolean {
  return point[0] >= 0 && point[1] >= 0 && point[0] <= max && point[1] <= max
}
function findBeacon(pairs: Pairs, max: number): Coords {
  for (let p = 0; p < pairs.length; p++) {
    const { sensor, distance } = pairs[p]
    for (let offset = 0; offset < distance; offset++) {
      const points: Coords[] = [
        [sensor[0] + offset, sensor[1] - distance - 1 + offset],
        [sensor[0] + distance + 1 - offset, sensor[1] + offset],
        [sensor[0] - offset, sensor[1] + distance + 1 - offset],
        [sensor[0] - distance - 1 + offset, sensor[1] - offset]
      ]
      for (let i = 0; i < 4; i++) {
        const current: Coords = points[i]
        if (isBound(current, max) && canHaveBeacon(current, pairs) && isEmpty(current, pairs)) {
          return current
        }
      }
    }
  }
  return [0, 0]
}
main()
