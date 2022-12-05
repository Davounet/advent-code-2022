import fs from 'fs/promises'

export async function loadInput(index: string, trim: boolean = true) {
  const raw = await fs.readFile(`./inputs/${index}.txt`, 'utf-8')
  return raw.split('\n').map((row) => (trim ? row.trim() : row))
}
