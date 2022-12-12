import { loadInput } from './helpers'

type Point = {
  elevation: number
  distance: number
}
const chars = 'abcdefghijklmnopqrstuvwxyz'

async function main1() {
  const input = await loadInput('12')

  let target: [number, number] = [NaN, NaN]
  const toVisit: string[] = []
  const map: Point[][] = input.map((row, i) =>
    row.split('').map((c, j) => {
      let elevation = Array.from(chars).findIndex((k) => k === c)
      let distance = Infinity

      if (c === 'S') {
        elevation = 0
        distance = 0
      } else if (c === 'E') {
        target = [i, j]
        elevation = 25
      }

      toVisit.push(coordsToKey(i, j))
      return { elevation, distance }
    })
  )
  const maxX = map.length - 1
  const maxY = map[0].length - 1

  while (toVisit.length > 0) {
    // console.log(`There are ${toVisit.length} points left to visit`)
    // Get the next point to observe
    const minimum = toVisit.reduce((min, key, i) => {
      const [a, b] = keyToCoords(key)
      return Math.min(min, map[a][b].distance)
    }, Infinity)
    const index = toVisit.findIndex((key) => {
      const [a, b] = keyToCoords(key)
      return map[a][b].distance === minimum
    })
    const key = toVisit.splice(index, 1)[0]
    const [x, y] = keyToCoords(key)
    const current = map[x][y]

    // Find its neighbors
    const neighbors: [number, number][] = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ]
    const reals = neighbors.filter(([cx, cy]) => cx >= 0 && cy >= 0 && cx <= maxX && cy <= maxY)
    const accessible = reals.filter(([cx, cy]) => map[cx][cy].elevation <= current.elevation + 1)
    accessible.forEach(([i, j]) => {
      map[i][j].distance = Math.min(map[i][j].distance, current.distance + 1)
    })
  }

  console.log('Distance from start: ' + map[target[0]][target[1]].distance)
}

async function main2() {
  const input = await loadInput('12')

  let start: [number, number] = [NaN, NaN]
  const toVisit: string[] = []
  const map: Point[][] = input.map((row, i) =>
    row.split('').map((c, j) => {
      let elevation = Array.from(chars).findIndex((k) => k === c)
      let distance = Infinity

      if (c === 'S') {
        elevation = 0
      } else if (c === 'E') {
        elevation = 25
        distance = 0
      }

      toVisit.push(coordsToKey(i, j))
      return { elevation, distance }
    })
  )
  const maxX = map.length - 1
  const maxY = map[0].length - 1

  while (toVisit.length > 0) {
    // console.log(`There are ${toVisit.length} points left to visit`)
    // Get the next point to observe
    const minimum = toVisit.reduce((min, key, i) => {
      const [a, b] = keyToCoords(key)
      return Math.min(min, map[a][b].distance)
    }, Infinity)
    const index = toVisit.findIndex((key) => {
      const [a, b] = keyToCoords(key)
      return map[a][b].distance === minimum
    })
    const key = toVisit.splice(index, 1)[0]
    const [x, y] = keyToCoords(key)
    const current = map[x][y]

    // Find its neighbors
    const neighbors: [number, number][] = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ]
    const reals = neighbors.filter(([cx, cy]) => cx >= 0 && cy >= 0 && cx <= maxX && cy <= maxY)
    const accessible = reals.filter(([cx, cy]) => map[cx][cy].elevation >= current.elevation - 1)
    accessible.forEach(([i, j]) => {
      map[i][j].distance = Math.min(map[i][j].distance, current.distance + 1)
    })
  }

  const possibles: number[] = map.reduce((list: number[], row) => {
    row.forEach((point) => {
      if (point.elevation === 0) {
        list.push(point.distance)
      }
    })
    return list
  }, [])
  const minimum = Math.min(...possibles)
  console.log(`Closest distance: ${minimum}`)
}

main1()
main2()

function coordsToKey(x: number, y: number): string {
  return `${x},${y}`
}
function keyToCoords(key: string): [number, number] {
  const list = key.split(',').map((i) => parseInt(i, 10))
  return [list[0], list[1]]
}
