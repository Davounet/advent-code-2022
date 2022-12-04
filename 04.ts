import { loadInput } from './helpers'

async function main() {
  const input = await loadInput('04')

  const overlap1 = input.filter((row) => {
    const [elf1, elf2] = row.split(',')
    const [elf1Start, elf1End] = elf1.split('-').map((s) => parseInt(s, 10))
    const [elf2Start, elf2End] = elf2.split('-').map((s) => parseInt(s, 10))

    return (elf1Start <= elf2Start && elf1End >= elf2End) || (elf2Start <= elf1Start && elf2End >= elf1End)
  })
  console.log('Total overlaps: ' + overlap1.length)

  const overlap2 = input.filter((row) => {
    const [elf1, elf2] = row.split(',')
    const [elf1Start, elf1End] = elf1.split('-').map((s) => parseInt(s, 10))
    const [elf2Start, elf2End] = elf2.split('-').map((s) => parseInt(s, 10))

    return (elf1Start <= elf2Start && elf1End >= elf2Start) || (elf2Start <= elf1Start && elf2End >= elf1Start)
  })
  console.log('Partial overlaps: ' + overlap2.length)
}
main()
