// App.tsx — MindRoot v2 (Fase 1: Sementes)
// Minimal shell. Types + config loaded. Zero UI yet.

import { ALL_TYPES } from '@/config/types'
import { RAIZ_DOMAINS } from '@/config/raiz'
import { GENESIS_STAGES } from '@/types/item'
import { getCurrentPeriod } from '@/types/ui'

function App() {
  const period = getCurrentPeriod()

  return (
    <div className="min-h-dvh bg-bg text-text p-md font-sans">
      <h1 className="text-2xl font-medium text-text-heading mb-lg">
        MindRoot v2
      </h1>

      <div className="space-y-md text-sm text-text-muted">
        <p>Fase 1 — Sementes. Config + types loaded.</p>
        <p>Periodo atual: <span className="text-text font-medium">{period.label}</span> — {period.greeting}</p>
        <p>{ALL_TYPES.length} atom types loaded</p>
        <p>{GENESIS_STAGES.length} genesis stages</p>
        <p>{RAIZ_DOMAINS.length} raiz domains</p>
      </div>
    </div>
  )
}

export default App
