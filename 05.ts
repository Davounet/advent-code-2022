import { loadInput } from './helpers'

type Move = { quantity: number; from: number; to: number }

async function main() {
  const input = await loadInput('05', false)

  const blankIndex = input.findIndex((r) => r.length === 0)
  const numbersRow = input[blankIndex - 1]
  const maxStack = parseInt(numbersRow.trim().split(' ').pop() ?? '', 10)

  const stacks1: string[][] = input
    .slice(0, blankIndex - 1)
    .reverse()
    .reduce((output: string[][], row) => {
      output.forEach((col: string[], i) => {
        const index = 1 + 4 * i
        const crate = row[index]
        if (crate !== ' ') {
          col.push(crate)
        }
      })
      return output
    }, Array.from({ length: maxStack }).map(() => []) as string[][])

  const final1: string[][] = input
    .slice(blankIndex + 1)
    .map((row) => {
      const extract: any = row.match(/move (?<quantity>[0-9]+) from (?<from>[0-9]+) to (?<to>[0-9]+)/)
      return extract!.groups
    })
    .reduce((result: string[][], move: Move) => updateStacks9000(result, move), stacks1)

  const output1 = final1.map((stack) => stack[stack.length - 1]).join('')
  console.log('Move 9000: ' + output1)

  const stacks2: string[][] = input
    .slice(0, blankIndex - 1)
    .reverse()
    .reduce((output: string[][], row) => {
      output.forEach((col: string[], i) => {
        const index = 1 + 4 * i
        const crate = row[index]
        if (crate !== ' ') {
          col.push(crate)
        }
      })
      return output
    }, Array.from({ length: maxStack }).map(() => []) as string[][])

  const final2: string[][] = input
    .slice(blankIndex + 1)
    .map((row) => {
      const extract: any = row.match(/move (?<quantity>[0-9]+) from (?<from>[0-9]+) to (?<to>[0-9]+)/)
      return extract!.groups
    })
    .reduce((result: string[][], move: Move) => updateStacks9001(result, move), stacks2)

  const output2 = final2.map((stack) => stack[stack.length - 1]).join('')
  console.log('Move 9001: ' + output2)
}
main()

function updateStacks9000(state: string[][], move: Move): string[][] {
  const actions = Array.from({ length: move.quantity })
  return actions.reduce((result: string[][]) => moveCrate(result, move.from, move.to), state as string[][])
}
function moveCrate(state: string[][], from: number, to: number): string[][] {
  const crate: string = state[from - 1].pop() ?? '?'
  state[to - 1].push(crate)
  return state
}

function updateStacks9001(state: string[][], move: Move): string[][] {
  const fromCol = state[move.from - 1]
  const toCol = state[move.to - 1]
  const crates = fromCol.splice(fromCol.length - move.quantity)
  toCol.push(...crates)
  return state
}
