import path from 'path'

const cwd = process.cwd()

export const modules = ['hooks']

export const resolveFile = (filePath) => path.join(cwd, filePath)
