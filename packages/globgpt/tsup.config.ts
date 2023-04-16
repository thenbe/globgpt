import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['src/index.ts', 'src/cli.ts'],
  shims: true, // fixes import.meta.url in output
  // minify: true,
  // splitting: true,
  dts: true,
}
