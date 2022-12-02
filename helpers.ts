import fs from 'fs/promises'

export async function loadInput(index) {
  const raw = await fs.readFile(`./inputs/${index}.txt`, 'utf-8')
  return raw.split('\n').map((row) => row.trim())
}
