#!/usr/bin/env node

import path from 'node:path'
import { cac } from 'cac'
import { CLI_NAME, STORE_DIRECTORY_DEFAULT } from './config'
import { chat } from './chat'
import { retrieve } from './retrieve'
import { DEFAULT_MODEL_NAME } from './model'

const RETRIEVE_EXAMPLE_1 = 'globgpt retrieve --name my-first-llm hello.txt'
const RETRIEVE_EXAMPLE_2 = 'fd . | xargs globgpt retrieve --name my-first-llm'
const RETRIEVE_EXAMPLE_3 = 'fd --full-path --glob "**/tests/**/*.ts" | xargs globgpt retrieve --name my-test-llm'
const CHAT_EXAMPLE_1 = 'globgpt chat --name my-test-llm "Suggest 10 more tests to add"'

const cli = cac(CLI_NAME)

cli
  .command('retrieve [...files]', 'Load <files> into a vector store.', {
    allowUnknownOptions: false,
  })
  .option('--name <name>', 'A human-readable name for the vector store.')
  .option('--force', 'Overwrite the vector store if it already exists.')
  .action(async (files, options) => {
    const filesAbsolute = files.map((file: string) => {
      return path.resolve(process.cwd(), file)
    })

    await retrieve({
      paths: filesAbsolute,
      storeDirectory: options.storeDirectory,
      name: options.name,
      force: options.force,
    })
  })
  .example(RETRIEVE_EXAMPLE_1)
  .example(RETRIEVE_EXAMPLE_2)
  .example(RETRIEVE_EXAMPLE_3)

cli
  .command('chat <text>', 'Send <text> to the AI model and receive a response.', {
    allowUnknownOptions: false,
  })
  .option('--name <name>', 'The name of the vector store to use.')
  .option('--model <model>', 'The model to use.', {
    default: DEFAULT_MODEL_NAME,
  })
  .action(async (text, options) => {
    const res = await chat({
      text,
      name: options.name,
      modelName: options.model,
    })

    console.log(res.text)
  })
  .example(CHAT_EXAMPLE_1)
  .example('globgpt chat --name my-test-llm --model gpt-4 "Suggest 10 more tests to add"')

cli.example(RETRIEVE_EXAMPLE_3)
cli.example(CHAT_EXAMPLE_1)

// custom store directory
cli.option('--store-directory <storeDirectory>', 'The directory to save the vector store in.', {
  default: STORE_DIRECTORY_DEFAULT,
})

cli.help()

cli.parse()
