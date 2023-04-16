import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { HNSWLib } from 'langchain/vectorstores'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import type { Document } from 'langchain/document'
import { load, save } from './vector'
import { log } from './logger'
import { STORE_DIRECTORY_DEFAULT } from './config'

/** Return a short hash of the paths. */
function getPathsHash(paths: string[]) {
  const hash = crypto.createHash('sha256')
  hash.update(paths.join(''))
  const pathsHash = hash.digest('hex').slice(0, 8)
  log('DEBUG', pathsHash)
  return pathsHash
}

export async function loadPaths(paths: string[]) {
  const documents: Document[] = []
  for (const path of paths) {
    // skip directories. Instead of `fd --type f .`, we can use `fd .`
    if (!fs.lstatSync(path).isFile())
      continue
    const loader = new TextLoader(path)
    documents.push(...(await loader.load()))
  }
  return documents
}

/** If vector store exists locally, get it. Otherwise, create a new vector store. */
export async function retrieve(
  { paths, storeDirectory = STORE_DIRECTORY_DEFAULT, name, force }: RetrieveArgs,
): Promise<HNSWLib> {
  const storePath = path.resolve(storeDirectory, name ?? getPathsHash(paths))
  const exists = fs.existsSync(storePath)

  if (exists && !force) {
    log('INFO', `Vector store already exists at ${storePath}`)

    return load(storePath)
  }
  else {
    log('INFO', `Creating vector store at ${storePath}`)

    const rawDocs = await loadPaths(paths)

    log('DEBUG', rawDocs)

    if (rawDocs.length === 0)
      throw new Error('Documents array is empty')

    const vector = await save(rawDocs, storePath)

    return vector
  }
}

export async function retrieveByName(
  { storeDirectory = STORE_DIRECTORY_DEFAULT, name }: RetrieveByNameArgs,
): Promise<HNSWLib> {
  const storePath = path.resolve(storeDirectory, name)
  const exists = fs.existsSync(storePath)

  if (exists)
    return load(storePath)

  else
    throw new Error(`No vector found for name: ${name}`)
}

export interface RetrieveArgs {
  paths: string[]
  storeDirectory?: string
  name?: string
  force?: boolean
}

export interface RetrieveByNameArgs {
  storeDirectory?: string
  name: string
}
