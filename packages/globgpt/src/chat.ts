import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ConversationalRetrievalQAChain, VectorDBQAChain } from 'langchain/chains'
import type { ChainValues } from 'langchain/dist/schema'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { ChainTool, SerpAPI } from 'langchain/tools'
import { Calculator } from 'langchain/tools/calculator'
import { WebBrowser } from 'langchain/tools/webbrowser'
import { getModel } from './model'
import { type RetrieveByNameArgs, retrieveByName } from './retrieve'

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

  // Provide the vector store as a tool. https://js.langchain.com/docs/modules/agents/tools/agents_with_vectorstores
  const vectorStore = await retrieveByName(args)
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    // returnSourceDocuments: true,
    // key: 'question',
    // inputKey: 'question',
  })
  const qaTool = new ChainTool({
    name: 'my dotfiles',
    description: 'Dotfiles QA - Use my dotfiles to tailor your examples and suggestions to my active configuration.',
    chain,
    // returnDirect: true, // TODO: explore
  })

  const embeddings = new OpenAIEmbeddings() // TODO: explore
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: 'Austin,Texas,United States',
      hl: 'en',
      gl: 'us',
    }),
    new Calculator(),
    new WebBrowser({ model, embeddings }),
    qaTool,
  ]

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'chat-zero-shot-react-description', // TODO: explore different agent types. https://js.langchain.com/docs/modules/agents/agents/#which-agent-to-choose
    returnIntermediateSteps: true,
    // agentArgs: {
    //   systemMessage: 'You are a helpful assistant', // WARN: not ideal
    // },
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
