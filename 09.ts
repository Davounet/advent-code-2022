import { loadInput } from './helpers'

type Coords = [number, number][]

async function main() {
  const input = await loadInput('09')
  const length = 10

  let coords: Coords = Array.from({ length }).map(() => [0, 0])
  const uniques1 = new Set()
  const uniques9 = new Set()

  input.forEach((row) => {
    const [direction, times] = row.split(' ')
    Array.from({ length: parseInt(times, 10) }).forEach(() => {
      Array.from({ length }).forEach((_, i) => {
        if (i === 0) {
          coords = moveHead(coords, direction)
        } else {
          coords = moveKnot(coords, i)
        }
        uniques1.add(`${coords[1][0]},${coords[1][1]}`)
        uniques9.add(`${coords[9][0]},${coords[9][1]}`)
      })
    })
    // print(coords)
  })

  // printSet(uniques1)
  console.log(`Unique positions (T): ${uniques1.size}`)

  // printSet(uniques9)
  console.log(`Unique positions (9): ${uniques9.size}`)
}

const directions = {
  L: [0, -1],
  U: [1, 1],
  R: [0, 1],
  D: [1, -1]
}
function moveHead(coords: Coords, target: string): Coords {
  const direction = directions[target]
  coords[0][direction[0]] += direction[1]
  return coords
}
function moveKnot(coords: Coords, index: number): Coords {
  const [offX, offY] = [coords[index - 1][0] - coords[index][0], coords[index - 1][1] - coords[index][1]]

  if (Math.abs(offX) > 1 && Math.abs(offY) > 1) {
    coords[index][0] += Math.sign(offX)
    coords[index][1] += Math.sign(offY)
  } else if (Math.abs(offX) > 1) {
    coords[index][0] += Math.sign(offX)
    coords[index][1] = coords[index - 1][1]
  } else if (Math.abs(offY) > 1) {
    coords[index][0] = coords[index - 1][0]
    coords[index][1] += Math.sign(offY)
  }

  return coords
}

function print(coords) {
  const max = 20
  for (let y = max; y >= -max; y--) {
    let row: string[] = []
    for (let x = -max; x <= max; x++) {
      const index = coords.findIndex((k) => k[0] === x && k[1] === y)
      if (index === -1) {
        row.push(x === 0 && y === 0 ? 's' : '.')
      } else {
        row.push(index === 0 ? 'H' : index)
      }
    }
    console.log(row.join(' '))
  }
  console.log('')
}
function printSet(set) {
  const max = 20
  for (let y = max; y >= -max; y--) {
    let row: string[] = []
    for (let x = -max; x <= max; x++) {
      row.push(x === 0 && y === 0 ? 's' : set.has(`${x},${y}`) ? '#' : '.')
    }
    console.log(row.join(' '))
  }
  console.log('')
}

main()
