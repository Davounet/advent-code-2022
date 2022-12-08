import { loadInput } from './helpers'

async function main() {
  const input = await loadInput('08')
  const maxIndex = input.length - 1
  const grid = input.map((row) => row.split('').map((s) => parseInt(s, 10)))

  const visible = grid.map((row, i) => {
    return row.map((tree, j) => {
      if (i === 0 || j === 0 || i === maxIndex || j === maxIndex) {
        return true
      }

      const left = Array.from({ length: j })
        .map((_, index) => grid[i][index])
        .every((v) => v < tree)
      if (left) {
        return true
      }

      const right = Array.from({ length: maxIndex - j })
        .map((_, index) => grid[i][maxIndex - index])
        .every((v) => v < tree)
      if (right) {
        return true
      }

      const top = Array.from({ length: i })
        .map((_, index) => grid[index][j])
        .every((v) => v < tree)
      if (top) {
        return true
      }

      const bottom = Array.from({ length: maxIndex - i })
        .map((_, index) => grid[maxIndex - index][j])
        .every((v) => v < tree)
      if (bottom) {
        return true
      }

      return false
    })
  })

  const totalVisible = visible.reduce(
    (si, row) => si + row.reduce((sj: number, isVisible) => sj + (isVisible ? 1 : 0), 0),
    0
  )
  console.log('total visible: ' + totalVisible)

  const scores = grid.map((row, i) => {
    return row.map((tree, j) => {
      if (i === 0 || j === 0 || i === maxIndex || j === maxIndex) {
        return 0
      }

      const leftList = Array.from({ length: j })
        .map((_, index) => grid[i][index])
        .reverse()
      const leftIndex = leftList.findIndex((v) => v >= tree)
      const left = leftIndex === -1 ? leftList.length : leftIndex + 1

      const rightList = Array.from({ length: maxIndex - j })
        .map((_, index) => grid[i][maxIndex - index])
        .reverse()
      const rightIndex = rightList.findIndex((v) => v >= tree)
      const right = rightIndex === -1 ? rightList.length : rightIndex + 1

      const topList = Array.from({ length: i })
        .map((_, index) => grid[index][j])
        .reverse()
      const topIndex = topList.findIndex((v) => v >= tree)
      const top = topIndex === -1 ? topList.length : topIndex + 1

      const bottomList = Array.from({ length: maxIndex - i })
        .map((_, index) => grid[maxIndex - index][j])
        .reverse()
      const bottomIndex = bottomList.findIndex((v) => v >= tree)
      const bottom = bottomIndex === -1 ? bottomList.length : bottomIndex + 1

      return top * right * bottom * left
    })
  })

  const maxScore = Math.max(...scores.map((row) => Math.max(...row)))
  console.log('Max score: ' + maxScore)
}
main()
