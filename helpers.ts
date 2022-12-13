import fs from 'fs/promises'

export async function loadInput(index: string, trim: boolean = true) {
  const raw = await fs.readFile(`./inputs/${index}.txt`, 'utf-8')
  return raw.split('\n').map((row) => (trim ? row.trim() : row))
}

export function chunk(list: any[], size: number) {
  return list.reduce((result, item, i) => {
    if (i % size) {
      result[result.length - 1].push(item)
    } else {
      result.push([item])
    }
    return result
  }, [])
}
