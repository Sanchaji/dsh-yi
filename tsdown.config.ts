import { fileURLToPath } from 'node:url'
import { isBuiltin } from 'node:module'
import type { UserConfig } from 'tsdown'

const PLUGIN_ID = "dsh-yi"

const CLIENT_EXTERNALS = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client',
  'cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-cordis-client-runner/client',
  '@deepseek-ai/dsh-client-locale/client',
  '@deepseek-ai/dsh-client-ui-conversation/client',
  '@deepseek-ai/dsh-api-remotes/client',
]

// Host half: a self-contained single-file ESM bundle. Every runtime import is
// inlined (schemastery, dsh-llm helpers, the iching data tables) so the plugin
// resolves with zero node_modules presence — profiles install it via file/link
// junctions whose realpath escapes the profile's dependency tree.
const hostBundle: UserConfig = {
  entry: { index: 'src/index.ts' },
  outDir: 'lib',
  format: 'esm',
  platform: 'node',
  dts: false,
  sourcemap: true,
  clean: false,
  codeSplitting: false,
  // Only Node builtins stay external; everything else is inlined.
  deps: {
    alwaysBundle: (id: string) => !isBuiltin(id),
  },
  outputOptions: {
    entryFileNames: 'index.js',
  },
}

const clientBundle: UserConfig = {
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
  },
  deps: {
    neverBundle: [...CLIENT_EXTERNALS],
    alwaysBundle: (id: string) => !CLIENT_EXTERNALS.includes(id),
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: ' + JSON.stringify(PLUGIN_ID) + ', factory: (require) => {',
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
    codeSplitting: false,
  },
}

export default [hostBundle, clientBundle] satisfies UserConfig[]