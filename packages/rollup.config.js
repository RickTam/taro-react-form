import RollupTypescript from 'rollup-plugin-typescript2'
import RollupCopy from 'rollup-plugin-copy'
import { resolveFile, modules } from './build/scripts.js'

const externalPackages = [
  'classnames',
  'react',
  'react-dom',
  '@tarojs/components',
  '@tarojs/runtime',
  '@tarojs/taro',
  '@tarojs/react',
  'rc-field-form',
]

const genConfig = (module) => {
  return {
    input: resolveFile(`src/${module}/index.ts`),
    output: [
      {
        file: resolveFile(`${module}/index.js`),
        format: 'esm',
      },
    ],
    plugins: [
      RollupTypescript({
        tsconfig: resolveFile(`src/${module}/tsconfig.json`),
      }),
    ],
  }
}

export default [
  ...modules.map((m) => genConfig(m)),
  {
    input: resolveFile('src/index.ts'),
    output: [
      {
        file: resolveFile('dist/index.js'),
        format: 'esm',
        sourcemap: false,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    ],
    external: externalPackages,
    extensions: ['json', 'js', 'ts'],
    plugins: [
      RollupTypescript({
        clean: true,
        tsconfig: resolveFile('tsconfig.json'),
      }),
      RollupCopy({
        verbose: true,
        targets: [
          {
            src: resolveFile('src/styles'),
            dest: resolveFile('dist'),
          },
        ],
      }),
    ],
  },
]
