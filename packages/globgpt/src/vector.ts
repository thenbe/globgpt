import type { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { log } from './logger'

// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/hnswlib

/* Create and store the embeddings in the vectorStore */
export async function save(rawDocs: Document[], storePath: string) {
  /* Split text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    // chunkOverlap: 200,
  })

  const docs = await textSplitter.splitDocuments(rawDocs)

  /* Create and store the embeddings */
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings())

  // Save the vector store to a directory
  await vectorStore.save(storePath)
  log('DEBUG', `Saved vector store to: ${storePath}`)

  return vectorStore
}

export async function load(storePath: string): Promise<HNSWLib> {
  const vector = await HNSWLib.load(storePath, new OpenAIEmbeddings())
  log('DEBUG', `Loaded vector store from: ${storePath}`)

  return vector
}
