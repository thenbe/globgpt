import os from 'node:os'
import path from 'node:path'

export const CLI_NAME = 'globgpt'
const DATA_DIRECTORY = path.join(os.homedir(), '.cache', CLI_NAME)
export const STORE_DIRECTORY_BASENAME = 'vector-store'
export const STORE_DIRECTORY_DEFAULT = path.resolve(DATA_DIRECTORY, STORE_DIRECTORY_BASENAME)
