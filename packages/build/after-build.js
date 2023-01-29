import fs from 'fs-extra'
import { resolveFile, modules } from './scripts.js'

const refs = modules.map((dir) => `/// <reference path="../${dir}/index.d.ts" />`)
const dtsPath = resolveFile('dist/index.d.ts')
const dts = await fs.readFileSync(dtsPath, 'utf-8').split(/\r\n|\n|\r/gm)
const newDts = refs.concat(dts).join('\r\n')

fs.writeFileSync(dtsPath, newDts)

console.info('success!')
