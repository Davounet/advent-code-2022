import { loadInput } from './helpers'

interface Directory {
  parent?: Directory
  files: { [name: string]: number }
  directories: { [name: string]: Directory }
}

async function main() {
  const input = await loadInput('07')
  const disk: Directory = { files: {}, directories: {} }
  let current = disk

  for (let i = 0; i < input.length; i++) {
    if (input[i][0] === '$') {
      const [_, command, directory] = input[i].split(' ')
      if (command === 'cd') {
        if (directory === '/') {
          current = disk
        } else if (directory === '..') {
          current = current.parent!
        } else {
          if (!current.directories[directory]) {
            current.directories[directory] = { parent: current, files: {}, directories: {} }
          }
          current = current.directories[directory]
        }
      } else if (command === 'ls') {
        i++
        while (i < input.length && input[i][0] !== '$') {
          const [size, name] = input[i].split(' ')
          if (size !== 'dir') {
            current.files[name] = parseInt(size, 10)
          }
          i++
        }
        i--
      }
    }
  }

  const [totalSize, sizes] = getSize(disk, [])
  const firstAnswer = sizes.filter((v) => v <= 100000).reduce((sum, v) => sum + v, 0)
  console.log('Sum of directories: ' + firstAnswer)

  const needToFree = totalSize - 40000000
  const secondAnswer = sizes.filter((v) => v >= needToFree).sort((a, b) => a - b)[0]
  console.log('Directory to delete: ' + secondAnswer)
}
main()

function getSize(directory: Directory, list: number[]): [number, number[]] {
  const filesSize = Object.values(directory.files).reduce((sum, size) => sum + size, 0)
  const directoriesSize = Object.values(directory.directories).reduce((sum, d) => sum + getSize(d, list)[0], 0)
  const totalSize = filesSize + directoriesSize

  list.push(totalSize)

  return [totalSize, list]
}
