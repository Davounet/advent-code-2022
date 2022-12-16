import { loadInput } from './helpers'

type Coords = [number, number]

async function main() {
  const input = await loadInput('14')

  const bounds1 = {
    minX: 500,
    maxX: 500,
    minY: 0,
    maxY: 0
  }
  const rocks: Coords[] = input.reduce((result: Coords[], row) => {
    const points: Coords[] = row.split(' -> ').map((point) => {
      const [x, y] = point.split(',').map((c) => parseInt(c, 10))
      return [x, y]
    })

    points.forEach((p2, i) => {
      if (p2[0] < bounds1.minX) bounds1.minX = p2[0]
      if (p2[0] > bounds1.maxX) bounds1.maxX = p2[0]
      if (p2[1] < bounds1.minY) bounds1.minY = p2[1]
      if (p2[1] > bounds1.maxY) bounds1.maxY = p2[1]

      if (i === 0) return

      const p1 = points[i - 1]
      if (p1[0] === p2[0]) {
        const incr = Math.sign(p2[1] - p1[1])
        const iterations = Math.abs(p2[1] - p1[1])
        Array.from({ length: iterations }).forEach((_, j) => result.push([p1[0], p1[1] + j * incr]))
      } else {
        const incr = Math.sign(p2[0] - p1[0])
        const iterations = Math.abs(p2[0] - p1[0])
        Array.from({ length: iterations }).forEach((_, j) => result.push([p1[0] + j * incr, p1[1]]))
      }

      if (i === points.length - 1) {
        result.push(points[i])
      }
    })

    return result
  }, [])
  const map1: string[][] = []
  Array.from({ length: bounds1.maxX - bounds1.minX + 1 }).forEach((_, i) => {
    const x = i + bounds1.minX
    map1[x] = []
    Array.from({ length: bounds1.maxY - bounds1.minY + 1 }).forEach((_, j) => {
      const y = j + bounds1.minY
      map1[x][y] = x === 500 && y === 0 ? '+' : ' '
    })
  })
  rocks.forEach(([x, y]) => (map1[x][y] = '#'))

  let units = 0
  while (addSand(map1)) {
    units++
  }
  console.log(`A total of ${units} units of sand were added`)

  const bounds2 = {
    minX: 500 - bounds1.maxY - 5,
    maxX: 500 + bounds1.maxY + 5,
    minY: bounds1.minY,
    maxY: bounds1.maxY + 2
  }
  const map2: string[][] = []
  Array.from({ length: bounds2.maxX - bounds2.minX + 1 }).forEach((_, i) => {
    const x = i + bounds2.minX
    map2[x] = []
    Array.from({ length: bounds2.maxY - bounds2.minY + 1 }).forEach((_, j) => {
      const y = j + bounds2.minY
      map2[x][y] = x === 500 && y === 0 ? '+' : y === bounds2.maxY ? '#' : ' '
    })
  })
  rocks.forEach(([x, y]) => (map2[x][y] = '#'))

  let units2 = 1
  while (addSand(map2)) {
    units2++
  }
  console.log(`A total of ${units2} units of sand were added`)
}

function printMap(map, bounds) {
  Array.from({ length: bounds.maxY - bounds.minY + 1 }).forEach((_, j) => {
    const y = j + bounds.minY
    const row = Array.from({ length: bounds.maxX - bounds.minX + 1 }).map((_, i) => {
      const x = i + bounds.minX
      return map[x][y]
    })
    console.log(row.join(''))
  })
}

function addSand(map): boolean {
  let x = 500,
    y = 0
  try {
    let rest = false
    while (!rest) {
      if (map[x][y + 1] === ' ') {
        y++
      } else if (map[x - 1][y + 1] === ' ') {
        x--
        y++
      } else if (map[x + 1][y + 1] === ' ') {
        x++
        y++
      } else {
        map[x][y] = 'o'
        rest = true

        if (x === 500 && y === 0) {
          return false
        }
      }
    }
    return true
  } catch (e) {
    return false
  }
}

main()
