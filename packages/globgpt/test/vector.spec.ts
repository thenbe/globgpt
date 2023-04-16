import * as url from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { beforeEach, describe, expect, it } from 'vitest'
import { retrieve } from '../src/retrieve'
import { STORE_DIRECTORY_BASENAME } from '../src/config'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const STORE_DIRECTORY = path.resolve(__dirname, STORE_DIRECTORY_BASENAME)
const SAMPLE_NAME = 'test'
const SAMPLE_VECTOR = path.resolve(STORE_DIRECTORY, SAMPLE_NAME)
const SAMPLE_FILE = path.resolve(__dirname, './sample/foo.txt')

beforeEach(() => {
  if (fs.existsSync(STORE_DIRECTORY)) {
    console.log('Removing store directory', STORE_DIRECTORY)
    fs.rmSync(STORE_DIRECTORY, { recursive: true })
  }
})

describe('retrieval', () => {
  it('creates a vector store', async () => {
    expect(fs.existsSync(SAMPLE_VECTOR)).toBe(false)

    await retrieve({
      paths: [SAMPLE_FILE],
      storeDirectory: STORE_DIRECTORY,
      name: SAMPLE_NAME,
    })

    expect(fs.existsSync(SAMPLE_VECTOR)).toBe(true)
  })

  it.todo('handles multiple files', async () => {})
})
