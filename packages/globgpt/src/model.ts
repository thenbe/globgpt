import { OpenAI } from 'langchain/llms/openai'

export const DEFAULT_MODEL_NAME = 'gpt-4'

export function getModel({ modelName = DEFAULT_MODEL_NAME } = {}) {
  return new OpenAI({
    verbose: true,
    modelName,
    temperature: 0,
  })
}
