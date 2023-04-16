import { defineWorkspace } from 'vitest/config'

// Docs: https://vitest.dev/guide/workspace.html

export default defineWorkspace([
  {
    test: {
      name: 'globgpt',
      root: './packages/globgpt',
      environment: 'node',
      // setupFiles: ['./setup.node.ts'],
    },
  },
])
