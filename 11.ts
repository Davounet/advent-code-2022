import { loadInput } from './helpers'

type Monkey = {
  items: number[]
  operation: (number) => number
  action: (number) => number
  score: number
}

async function main(isPart2 = false) {
  const input = await loadInput('11')

  const monkeys: Monkey[] = []
  let mod = 1

  input
    .filter((row) => row[0] === 'M')
    .forEach((_, i) => {
      const index = 7 * i
      const [, rawItems] = input[index + 1].split(':')
      const items = rawItems.split(',').map((s) => parseInt(s.trim(), 10))

      const [, rawOperation] = input[index + 2].split('=')
      const operation = (old) => parseInt(eval(rawOperation), 10)

      const divisibleBy = parseInt(input[index + 3].match(/(\d+)/)![0], 10)
      const monkeyTrue = parseInt(input[index + 4].match(/(\d+)/)![0], 10)
      const monkeyFalse = parseInt(input[index + 5].match(/(\d+)/)![0], 10)

      const action = (worry) => {
        return worry % divisibleBy ? monkeyFalse : monkeyTrue
      }

      mod = mod * divisibleBy
      monkeys.push({ items, operation, action, score: 0 })
    })

  Array.from({ length: isPart2 ? 10000 : 20 }).forEach((_, j) =>
    monkeys.forEach((monkey) => {
      Array.from({ length: monkey.items.length }).forEach(() => {
        monkey.score++
        let worry = monkey.items.shift()
        worry = monkey.operation(worry)

        if (isPart2) {
          worry = worry % mod
        } else {
          worry = Math.floor(worry / 3)
        }

        const target = monkey.action(worry)
        monkeys[target].items.push(worry)
      })
    })
  )

  const sortedScores = monkeys.map((m) => m.score).sort((a, b) => b - a)
  console.log('Business level: ' + sortedScores[0] * sortedScores[1])
}

main()
main(true)
