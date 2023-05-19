import type { OpenAI } from 'langchain'
import { VectorDBQAChain } from 'langchain/chains'
import { ChainTool } from 'langchain/tools'
import type { ChatArgs } from '../chat'
import { retrieveByName } from '../retrieve'

export async function getQaTool({ args, model }: { args: ChatArgs; model: OpenAI }) {
  // Provide the vector store as a tool. https://js.langchain.com/docs/modules/agents/tools/agents_with_vectorstores
  const vectorStore = await retrieveByName(args)
  const chain = VectorDBQAChain.fromLLM(model, vectorStore,
    {
      returnSourceDocuments: true,
      k: 1,
      // key: 'question',
      // inputKey: 'question',
    },
  )
  const qaTool = new ChainTool({
    name: 'my-dotfiles',
    description: 'Dotfiles QA - Use my dotfiles to tailor your examples and suggestions to my active configuration.',
    chain,
    // returnDirect: true, // TODO: explore
  })

  return qaTool
}
