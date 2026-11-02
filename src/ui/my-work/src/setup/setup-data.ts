// Compatibility types and local search/note operations. Hosted setup actions are inert.
import type { AgentTool } from '@/data'
import type { SetupUsage } from './setup-usage'
import { noteFor, searchUrl, toMemoryResults, type MemoryResult, type WorkerSearchResult } from './setup-search'

/** Mirrors the worker's SetupScanState (src/services/prompt-import/setup-scan.ts), trimmed to what the screen shows. */
export interface SetupScanAgent {
  id: string; label: string; detected: boolean; prompts: number
  /** Whether the agent can run setup's extraction here (the worker's agent detection); `null` when unknown or not a runner. */
  canRunSetup: boolean | null
  /** Why it cannot, e.g. "Gemini is installed, but this Google account can't use it: ...". */
  cannotRunReason: string | null
}

export type SetupScanPhase = 'idle' | 'reading' | 'checking' | 'saving' | 'uploading' | 'done' | 'failed'
export interface SetupScanView { agents: SetupScanAgent[]; percent: number; phase: SetupScanPhase; done: boolean; error: string | null; improveProduct: boolean }
/** The owner's newest typed prompts, quoted as typed (SetupScanState.recentPrompts). */
export interface SetupRecentPrompt { agent: string; at: string; text: string }
/** The worker's subsidized hosted setup extraction. */
/** On The Go checkout, mirrored from the installer that runs it (`null` until the page asks). */
export interface SetupCheckoutView { state: 'requested' | 'waiting' | 'paid' | 'failed'; error: string | null }
/** What the installer in the terminal did with the choice. A `failed` installer has exited: setup restarts from the terminal. */
export interface SetupInstallerView { stage: InstallerStage; error: string | null }
export interface SetupExtraction { state: 'idle' | 'running' | 'ok' | 'failed' | 'waiting-for-agent'; step: 'goals' | 'work' | 'rules' | null }

export type { RevealGoal, RevealRule, RevealSets, RevealWork } from './setup-reveal'
import type { RevealSets } from './setup-reveal'
import type { InstallerStage } from './setup-flow'

export type { Persona, SetupScanUsage, SetupUsage, UsageCoverage } from './setup-usage'

export interface SetupHistory { projects: number; sessions: number; observations: number }
/** The worker's history upload. `imported` counts observations cmem.ai wrote; `error` is why a run stopped. */
export interface HistoryImportProgress { percent: number; done: boolean; imported: number; error: string | null }

export type { MemoryResult } from './setup-search'

export interface SetupData {
  scan: SetupScanView
  reveal: RevealSets
  /** `null` until the worker reports a run. Older workers may still report waiting-for-agent. */
  extraction: SetupExtraction | null
  recentPrompts: SetupRecentPrompt[]
  checkout: SetupCheckoutView | null
  /** `null` until an installer reports. */
  installer: SetupInstallerView | null
  usage: SetupUsage | null
  alreadyPro: boolean
  /** Finish Setup tool ids found on this machine; they come pre-ticked. */
  detectedTools: string[]
  /** claude-mem observation history that could be imported. `null` for new installs. */
  history: SetupHistory | null
  historyImport: HistoryImportProgress | null
  /** "What's next?" chips, from the person's own goals and open asks. */
  suggestions: string[]
}

/** What the page posts when it leaves Token Savings: where memory lives, and who generates it. */
export interface SetupChoice { branch: 'home' | 'go'; memoryBilling: 'hosted' | 'existing' }

export interface SetupSource {
  readonly kind: 'local' | 'sample'
  subscribe(onData: (data: SetupData) => void): () => void
  /** Starts another scan only after the user chooses to retry a failure. */
  retryScan(): Promise<void>
  /** Changes the hosted setup results preference without pausing the scan or upload. */
  setImproveProduct(improveProduct: boolean): Promise<void>
  /** Hands the storage choice to the installer waiting in the terminal (POST /api/setup/choice). */
  choose(choice: SetupChoice): Promise<void>
  /** Asks the installer holding the On The Go sign-in to open checkout (POST /api/setup/checkout). */
  checkout(): Promise<void>
  /** Finishes setup for this machine with the tools picked on Finish Setup; the terminal exits (POST /api/setup/complete). */
  complete(tools: string[]): Promise<void>
  /** Uploads this machine's observations to the CMEM account (POST /api/setup/import). */
  startHistoryImport(): Promise<void>
  search(query: string): Promise<MemoryResult[]>
  /** Keep as note: saves `text` as a new memory (POST /api/memory/save) and answers its observation id. */
  keepNote(record: MemoryResult, text: string): Promise<number>
  /** Removes a note this page saved, once its edited copy is saved (DELETE /api/observation/:id). */
  forgetNote(id: number): Promise<void>
}

export const EMPTY_SETUP_DATA: SetupData = {
  scan: { agents: [], percent: 0, phase: 'idle', done: false, error: null, improveProduct: true },
  reveal: { goals: null, work: null, rules: null },
  extraction: null,
  recentPrompts: [],
  checkout: null,
  installer: null,
  usage: null,
  alreadyPro: false,
  detectedTools: [],
  history: null,
  historyImport: null,
  suggestions: [],
}

async function workerJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...init })
  let answer: unknown = null
  try { answer = await response.json() } catch { /* A body that isn't JSON leaves only the status to report. */ }
  if (!response.ok) {
    const reason = (answer as { error?: unknown } | null)?.error
    throw new Error(typeof reason === 'string' ? reason : `The worker answered ${response.status} for ${url}.`)
  }
  return answer as T
}
const postJson = <T>(url: string, body: unknown) => workerJson<T>(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

/** A saved setup marker never makes registration mandatory. No request is needed. */
export async function setupPending(): Promise<boolean> { return false }

const disabled = async (): Promise<never> => { throw new Error('Hosted setup is disabled in this local fork.') }

/** Keep local search/note operations, but retire every installer operation before dispatch. */
export const localSetupSource: SetupSource = {
  kind: 'local',
  subscribe(onData) {
    onData({ ...EMPTY_SETUP_DATA, scan: { ...EMPTY_SETUP_DATA.scan, phase: 'failed', done: true,
      error: 'Hosted setup is disabled in this local fork.' } })
    return () => {}
  },
  retryScan: disabled,
  setImproveProduct: disabled,
  choose: disabled,
  checkout: disabled,
  complete: disabled,
  startHistoryImport: disabled,
  async search(query) { return toMemoryResults(await workerJson<WorkerSearchResult>(searchUrl(query))) },
  async keepNote(record, text) {
    const saved = await postJson<{ success?: boolean; id?: unknown; reason?: unknown }>('/api/memory/save', noteFor(record, text))
    if (saved.success !== true || typeof saved.id !== 'number') throw new Error(`The note was not saved${typeof saved.reason === 'string' ? `: ${saved.reason}` : '.'}`)
    return saved.id
  },
  async forgetNote(id) { await workerJson(`/api/observation/${id}`, { method: 'DELETE' }) },
}

/** D6 plan prices, in cents. Plan prices only, never per-run spend. */
export const PLAN = { name: 'CMEM Pro', monthlyCents: 3000, cloudSyncCents: 1200 } as const

export const CMEM_MCP_URL = 'https://cmem.ai/api/mcp'

/** Finish Setup tools. Names, descriptions and steps come from the PROTO workspace tool list and CONNECTOR-EVIDENCE.md. */
export interface SetupTool {
  id: string
  name: string
  /** Local tools capture work on this machine; cloud readers only exist with On The Go. */
  kind: 'local' | 'cloud'
  mark: 'terminal' | 'codex' | 'chatgpt' | 'claude' | 'gemini'
  steps?: string[]
  commands?: string[]
  guide: { href: string; label: string }
}
export const SETUP_TOOLS: SetupTool[] = [
  { id: 'claude-code', name: 'Claude Code', kind: 'local', mark: 'terminal', commands: ['claude mcp add --transport http --scope user cmem https://cmem.ai/api/mcp', 'claude mcp login cmem', 'claude mcp list'], guide: { href: 'https://code.claude.com/docs/en/mcp', label: 'Claude Code connection guide' } },
  { id: 'claude-ai', name: 'Claude.ai', kind: 'cloud', mark: 'claude', steps: ['Open Customize, then Connectors, and choose + Add.', 'Choose Add custom connector, name it CMEM, paste the URL, and continue.', 'Complete the OAuth sign-in and add the connector. Enable it in a chat from +, then Connectors.'], guide: { href: 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp', label: 'Claude connection guide' } },
  { id: 'codex', name: 'Codex CLI', kind: 'local', mark: 'codex', commands: ['codex mcp add cmem --url https://cmem.ai/api/mcp', 'codex mcp login cmem', 'codex mcp list'], guide: { href: 'https://learn.chatgpt.com/docs/extend/mcp', label: 'Codex connection guide' } },
  { id: 'gemini-cli', name: 'Gemini CLI', kind: 'cloud', mark: 'gemini', steps: ['Add CMEM as a remote HTTP MCP server.', 'Authenticate CMEM inside Gemini CLI, then check the available tools.'], commands: ['gemini mcp add --transport http --scope user cmem https://cmem.ai/api/mcp', '/mcp auth cmem', '/mcp list'], guide: { href: 'https://geminicli.com/docs/tools/mcp-server/', label: 'Gemini CLI connection guide' } },
  { id: 'chatgpt', name: 'ChatGPT', kind: 'cloud', mark: 'chatgpt', steps: ['Open ChatGPT Plugins and choose +, then Add custom MCP server.', 'Paste the CMEM URL, choose OAuth, and create the plugin.', 'Review the available tools, install the plugin, then @mention it in a chat.'], guide: { href: 'https://developers.openai.com/plugins/deploy/connect-chatgpt', label: 'ChatGPT connection guide' } },
]

/** The scan's agent ids drawn with the brand marks brand.tsx has; any other agent gets the neutral mark. */
export const agentToolFor = (agentId: string): AgentTool =>
  agentId === 'claude-code' ? 'claude' : agentId === 'codex' ? 'codex' : agentId === 'gemini-cli' ? 'gemini' : 'other'
