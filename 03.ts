import { loadInput } from './helpers'

async function main() {
  const input = await loadInput('03')

  const items: string[] = input.map((row) => {
    const first = row.substring(0, row.length / 2)
    const second = row.substring(row.length / 2)
    const item = [...first].find((c) => second.includes(c))
    return item!
  })
  const total = items.reduce((sum, item) => sum + getPriority(item), 0)
  console.log('Total priorities: ' + total)

  const groups: string[][] = input.reduce((result: string[][], row: string) => {
    const current: string[] = result[result.length - 1]
    if (!current || current.length === 3) {
      result.push([row])
    } else {
      current.push(row)
    }
    return result
  }, [])

  const badges: string[] = groups.map(([r1, r2, r3]) => {
    const item = [...r1].find((c) => r2.includes(c) && r3.includes(c))
    return item!
  })
  const total2 = badges.reduce((sum, badge) => sum + getPriority(badge), 0)
  console.log('Total badges: ' + total2)
}
main()

function getPriority(char: string) {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const list = [...letters].concat([...letters].map((c) => c.toUpperCase()))
  return list.findIndex((c) => c === char) + 1
}
