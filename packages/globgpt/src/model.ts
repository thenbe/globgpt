import { OpenAI } from 'langchain/llms/openai'
import { getLogLevel } from './logger'

export const DEFAULT_MODEL_NAME = 'gpt-4'

export function getModel({ modelName = DEFAULT_MODEL_NAME } = {}) {
  return new OpenAI({
    verbose: getLogLevel() === 'DEBUG',
    modelName,
    temperature: 0,
  })
}
