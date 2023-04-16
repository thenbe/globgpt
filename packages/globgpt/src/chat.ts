import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import type { ChainValues } from 'langchain/dist/schema'
import { type RetrieveByNameArgs, retrieveByName } from './retrieve'

// https://js.langchain.com/docs/modules/chains/index_related_chains/conversational_retrieval

// export async function chat( { name, modelName = 'gpt-3.5-turbo', text, }: ChatArgs,
export async function chat(args: ChatArgs): Promise<ChainValues> {
  const { modelName = 'gpt-3.5-turbo', text } = args

  // Retrieve the vector store
  const vector = await retrieveByName(args)

  // Initialize the LLM to use to answer the question
  const model = new OpenAI({
    modelName,
  })

  // Create the chain
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vector.asRetriever(),
  )

  const chatHistory = [] as const

  // Ask it a question
  const res = await chain.call({ question: text, chat_history: chatHistory })

  return res
}

export interface ChatArgs extends RetrieveByNameArgs {
  text: string
  modelName?: string
}
