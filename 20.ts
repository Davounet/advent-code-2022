import { loadInput } from './helpers'

type Link = {
  id: number
  value: number
  left: number
  right: number
}

async function main() {
  const input = (await loadInput('20')).map(Number)

  const numbers: Link[] = []
  const length = input.length
  input.map((v, i) =>
    numbers.push({
      id: i,
      value: v,
      left: (i - 1 + length) % length,
      right: (i + 1) % length
    })
  )

  mix(numbers)
  const zeroId = numbers.find((link) => link.value === 0)!
  const coordinates = [1000, 2000, 3000].map((steps) => {
    let current = zeroId.id
    Array.from({ length: steps }).forEach(() => (current = numbers[current].right))
    return numbers[current].value
  })
  console.log(`Coordinates sum : ${coordinates.reduce((s, v) => s + v, 0)}`)

  const numbers2: Link[] = []
  const key = 811589153
  input.map((v, i) =>
    numbers2.push({
      id: i,
      value: v * key,
      left: (i - 1 + length) % length,
      right: (i + 1) % length
    })
  )
  Array.from({ length: 10 }).forEach(() => mix(numbers2))
  const zeroId2 = numbers2.find((link) => link.value === 0)!
  const coordinates2 = [1000, 2000, 3000].map((steps) => {
    let current = zeroId2.id
    Array.from({ length: steps }).forEach(() => (current = numbers2[current].right))
    return numbers2[current].value
  })
  console.log(`Coordinates sum : ${coordinates2.reduce((s, v) => s + v, 0)}`)
}

function mix(list: Link[]) {
  list.forEach((link) => {
    const steps = Math.abs(link.value) % (list.length - 1) // The current number is not relevant when we go round the list
    if (steps === 0) return

    const initLeft = link.left
    const initRight = link.right

    let current = link.id
    if (link.value < 0) {
      Array.from({ length: steps }).forEach(() => (current = list[current].left))
      link.left = list[current].left
      link.right = current
    } else {
      Array.from({ length: steps }).forEach(() => (current = list[current].right))
      link.left = current
      link.right = list[current].right
    }

    // Update the old neighbours
    list[initLeft].right = initRight
    list[initRight].left = initLeft

    // Update the new neighbours
    list[link.left].right = link.id
    list[link.right].left = link.id
  })
}

main()
