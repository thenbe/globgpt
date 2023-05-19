import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { Calculator } from 'langchain/tools/calculator'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { SerpAPI } from 'langchain/tools'
import type { ChainValues } from 'langchain/dist/schema'
import { type RetrieveByNameArgs, retrieveByName } from './retrieve'
import { prompt } from './prompts'
import { getModel } from './model'

// https://js.langchain.com/docs/modules/chains/index_related_chains/conversational_retrieval

// export async function chat( { name, modelName = 'gpt-3.5-turbo', text, }: ChatArgs,
export async function chat(args: ChatArgs): Promise<ChainValues> {
  // return await chatWithLLM(args)
  return await chatWithAgent(args)
}

async function chatWithLLM(args: ChatArgs): Promise<ChainValues> {
  const { modelName, text } = args

  // Retrieve the vector store
  const vector = await retrieveByName(args)

  // Initialize the LLM to use to answer the question
  const model = getModel({ modelName })

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

async function chatWithAgent(args: ChatArgs): Promise<ChainValues> {
  process.env.LANGCHAIN_HANDLER = 'langchain'
  const { modelName, text } = args

  const model = getModel({ modelName })

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: 'Austin,Texas,United States',
      hl: 'en',
      gl: 'us',
    }),
    new Calculator(),
  ]

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    verbose: true,
    agentType: 'chat-conversational-react-description', // TODO: different agent types
    agentArgs: {
      systemMessage: prompt, // WARN: not ideal
    },
  })

  const input0 = text

  const result0 = await executor.call({ input: input0 })

  console.log(`Got output ${result0.output}`)

  return result0

  // TODO: pass second input from user

  // const input1 = 'whats my name?'
  // const result1 = await executor.call({ input: input1 })
  // console.log(`Got output ${result1.output}`)
  // const input2 = 'whats the weather in pomfret?'
  // const result2 = await executor.call({ input: input2 })
  // console.log(`Got output ${result2.output}`)
  // return result2
}

export interface ChatArgs extends RetrieveByNameArgs {
  text: string
  modelName?: string
}
