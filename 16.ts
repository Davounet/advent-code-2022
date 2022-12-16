import { loadInput } from './helpers'

const regexp = /Valve (?<valve>[A-Z]+) has flow rate=(?<rate>[0-9]+); tunnels? leads? to valves? (?<links>.+)/
const store = {}
const store2 = {}

async function main() {
  const input = await loadInput('16')

  const layout = input.map((row) => {
    const extract = row.match(regexp)
    return {
      id: extract!.groups!.valve,
      rate: parseInt(extract!.groups!.rate, 10),
      links: extract!.groups!.links.split(', ')
    }
  })
  const rates: Record<string, number> = layout.reduce((result, valve) => {
    result[valve.id] = valve.rate
    return result
  }, {})
  // The non zero valves are the only ones worthy of being opened
  const nonZero = Object.entries(rates)
    .filter(([id, rate]) => rate > 0)
    .map(([id, rate]) => id)
    .sort()
  const list = nonZero.reduce((result, valve) => {
    result[valve] = false
    return result
  }, {})

  // Compute a store of distances between each valves
  const distances = buildDistances(layout)

  const output1 = maxFlow('AA', [], 30)
  console.log(`Pressure relieved in 30min: ${output1}`)

  /* const output2 = maxDoubleFlow('AA', [], 30)
  console.log(`Pressure relieved in 26min with an elephant: ${output2.pressure}`) */

  function maxFlow(current, opened, timeLeft): number {
    // Cache the ouput in a store to avoid useless computation
    const key = `${current}|${opened.join(',')}|${timeLeft}`
    if (store[key]) return store[key]

    const rest = nonZero.filter((v) => !opened.includes(v))
    // If there are not valves left to open, wait for the time left to elapse
    if (!rest.length) {
      return opened.map((v) => rates[v]).reduce((total, rate) => total + rate * timeLeft, 0)
    }

    const possibilities = rest.map((valve) => {
      // Duration is the time to go to and open the considered valve
      const duration = distances[current][valve] + 1

      // If the duration is longer than the time left, juste wait for the time left to elapse
      if (duration >= timeLeft) {
        return opened.map((v) => rates[v]).reduce((total, rate) => total + rate * timeLeft, 0)
      } else {
        // Else open the valve and add its future flow to the output from this valve
        const flow = opened.map((v) => rates[v]).reduce((total, rate) => total + rate * duration, 0)
        return flow + maxFlow(valve, [...opened, valve].sort(), timeLeft - duration)
      }
    })

    // Return the best output from the considered possibilities
    const result = Math.max(...possibilities)
    store[key] = result
    return result
  }
}

main()

// Uses the Floy-Warshall algorithm to compute a map of distances between each valve
function buildDistances(layout) {
  const length = layout.length
  const distances = layout.reduce((result, v1) => {
    result[v1.id] = layout.reduce((row, v2) => {
      row[v2.id] = v1.id === v2.id ? 0 : Infinity
      return row
    }, {})
    return result
  }, {})
  layout.forEach((valve) => {
    const v1 = valve.id
    valve.links.forEach((v2) => {
      distances[v1][v2] = 1
      distances[v2][v1] = 1
    })
  })
  for (let k = 0; k < length; k++) {
    const vk = layout[k].id
    for (let i = 0; i < length; i++) {
      const vi = layout[i].id
      for (let j = 0; j < length; j++) {
        const vj = layout[j].id
        if (distances[vi][vj] > distances[vi][vk] + distances[vk][vj]) {
          distances[vi][vj] = distances[vi][vk] + distances[vk][vj]
        }
      }
    }
  }
  return distances
}
