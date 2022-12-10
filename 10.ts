import { loadInput } from './helpers'

type State = {
  cycle: number
  X: number
  strengths: [number, number][]
  nextStrength: number
  CRT: string[][]
}

async function main() {
  const input = await loadInput('10t')

  const state: State = {
    cycle: 1,
    X: 1,

    strengths: [],
    nextStrength: 20,

    CRT: [[], [], [], [], [], [], []]
  }

  input.forEach((row) => {
    const [instr, param] = row.split(' ')

    if (instr === 'noop') {
      handleCycle(state)
    } else if (instr === 'addx') {
      handleCycle(state)
      handleCycle(state)
      state.X += parseInt(param, 10)
    }
  })

  const signalSum = state.strengths.reduce((sum, [cycle, X]) => sum + cycle * X, 0)
  console.log('Signal strength sum : ' + signalSum)

  state.CRT.forEach((row) => console.log(row.join('')))
}

function handleCycle(state: State) {
  if (state.cycle === state.nextStrength) {
    state.strengths.push([state.nextStrength, state.X])
    state.nextStrength += 40
  }

  const x = (state.cycle - 1) % 40
  const y = Math.floor((state.cycle - 1) / 40)
  state.CRT[y][x] = Math.abs(state.X - x) < 2 ? '#' : ' '

  state.cycle++
}

main()
