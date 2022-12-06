import { loadInput } from './helpers'

async function main() {
  const [input] = await loadInput('06', false)
  const source = Array.from(input)

  const marker = source.findIndex((letter, index) => {
    const current = source.slice(index - 4, index)
    const unique = new Set(current)
    return unique.size === 4
  })
  console.log('Marker at: ' + marker)

  const message = source.findIndex((letter, index) => {
    const current = source.slice(index - 14, index)
    const unique = new Set(current)
    return unique.size === 14
  })
  console.log('Message at: ' + message)
}
main()
