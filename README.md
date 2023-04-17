A simple way to chat with an LLM over some files. Built on langchain.

```bash
npm install -g globgpt
```

# Usage

1. [Index](https://docs.langchain.com/docs/use-cases/qa-docs#ingestion) some files

```bash
# single file
globgpt retrieve --name my-first-llm my-file.txt

# all files in the current directory
fd . | xargs globgpt retrieve --name my-first-llm

# specific files
fd --full-path --glob "**/tests/**/*.ts" | xargs globgpt retrieve --name my-test-llm
```

2. Chat

```bash
globgpt chat --name my-test-llm "Suggest 10 more tests to add"

# use gpt-4 (slower, but better)
globgpt chat --name my-test-llm --model gpt-4 "Suggest 10 more tests to add"

# pretty print
globgpt chat --name my-test-llm "Suggest 10 more tests to add. Format your response in markdown" | glow
globgpt chat --name my-test-llm "Suggest 10 more tests to add. Format your response in markdown" | bat -l md
```

