import * as url from 'node:url'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { HNSWLib } from 'langchain/vectorstores'
import { retrieve } from '../src/retrieve'
import { STORE_DIRECTORY_BASENAME } from '../src/config'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const STORE_DIRECTORY = path.resolve(__dirname, STORE_DIRECTORY_BASENAME)
const SAMPLE_NAME = 'test'
const SAMPLE_VECTOR = path.resolve(STORE_DIRECTORY, SAMPLE_NAME)
const SAMPLE_FILE = path.resolve(__dirname, './sample/foo.txt')

// Mock to avoid OPENAI_API_KEY error
vi.mock('langchain/embeddings/openai', () => {
  const OpenAIEmbeddings = vi.fn()
  return { OpenAIEmbeddings }
})

describe('retrieval', () => {
  it('creates a vector store', async () => {
    // @ts-expect-error test
    const spy = vi.spyOn(HNSWLib, 'fromDocuments').mockResolvedValue({ save: vi.fn() })

    await retrieve({
      paths: [SAMPLE_FILE],
      storeDirectory: STORE_DIRECTORY,
      name: SAMPLE_NAME,
    })

    // TEST: path
    expect(spy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          pageContent: 'bar',
        }),
      ]),
      expect.anything())
  })

  it('saves the vector store in the correct path', async () => {
    const spy = vi.fn()
    // @ts-expect-error test
    vi.spyOn(HNSWLib, 'fromDocuments').mockResolvedValueOnce({ save: spy })

    await retrieve({
      paths: [SAMPLE_FILE],
      storeDirectory: STORE_DIRECTORY,
      name: SAMPLE_NAME,
    })

    expect(spy).toHaveBeenCalledWith(SAMPLE_VECTOR)
  })

  it.todo('handles multiple files', async () => {})
})
