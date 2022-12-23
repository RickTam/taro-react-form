import fs from 'fs-extra'
import { resolveFile } from './scripts.js'

const Package = await fs.readJSON('package.json')
const files = Package.files

// 删除文件夹
files.forEach((f) => {
  const folderPath = resolveFile(f)
  fs.removeSync(folderPath)
})
