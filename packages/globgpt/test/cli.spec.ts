import { execSync } from 'node:child_process'
import * as url from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { STORE_DIRECTORY_BASENAME } from '../src'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const STORE_DIRECTORY = path.resolve(__dirname, STORE_DIRECTORY_BASENAME)
const SAMPLE_NAME = 'test'

const cwd = path.resolve(__dirname, '../')
// To debug: console.log(execSync('echo $PWD', { cwd }).toString())

function getCli(arg: string): string {
  // return `pnpm jiti src/index.ts ${arg}`
  return `node ./dist/cli.cjs ${arg}`
}

function runCli(arg: string) {
  return execSync(getCli(arg), {
    cwd,
    // stdio: 'inherit',
  })
}

beforeEach(() => {
  if (fs.existsSync(STORE_DIRECTORY)) {
    console.log('Removing store directory', STORE_DIRECTORY)
    fs.rmSync(STORE_DIRECTORY, { recursive: true })
  }
})

describe('cli', () => {
  it('has a --help command', async () => {
    const result = runCli('--help').toString()
    expect(result).toContain('-h, --help')
  })

  it('creates a vector store', async () => {
    const SAMPLE_VECTOR = path.resolve(STORE_DIRECTORY, SAMPLE_NAME)
    expect(fs.existsSync(SAMPLE_VECTOR)).toBe(false)

    const SAMPLE_FILE = path.resolve(__dirname, './sample/foo.txt')
    expect(() => runCli(`retrieve --store-directory ${STORE_DIRECTORY} --name ${SAMPLE_NAME} ${SAMPLE_FILE}`)).not.toThrow()

    expect(fs.existsSync(SAMPLE_VECTOR)).toBe(true)
  })
})
