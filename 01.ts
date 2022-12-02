import { loadInput } from './helpers'

type Temp = {
  output: number[]
  current: number
}

async function main() {
  const input = await loadInput('01')
  const { output: aggregated } = input.reduce(
    (temp: Temp, row: string) => {
      if (row.length === 0) {
        temp.output.push(temp.current)
        temp.current = 0
      } else {
        temp.current += Number(row)
      }
      return temp
    },
    { output: [], current: 0 } as Temp
  )

  const sorted = aggregated.sort((a, b) => b - a)
  console.log('Top elf: ' + sorted[0])
  console.log('Cumulated top 3: ' + (sorted[0] + sorted[1] + sorted[2]))
}
main()
