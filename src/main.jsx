import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// CLASSIFIED // GAZE TACTICAL SYSTEMS
// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
console.log(
  '%c ██ GAZE TACTICAL HUD v3.2.1 ██ %c\n%c CLASSIFICATION: TOP SECRET // SI // NOFORN %c\n%c Unauthorized access prosecutable under 10 U.S.C. § 793 ',
  'background: #0c4a6e; color: #38bdf8; font-size: 14px; font-weight: bold; padding: 6px 16px; border: 1px solid #0ea5e9;',
  '',
  'background: #7f1d1d; color: #fca5a5; font-size: 11px; padding: 4px 16px;',
  '',
  'background: #1e293b; color: #64748b; font-size: 10px; padding: 3px 16px;'
);

console.log(
  '%c┌─────────────────────────────────────────┐\n│  OPERATOR CLEARANCE: LEVEL 5 — GRANTED  │\n│  SESSION:  0x%s            │\n│  UPLINK:   SATCOM-IV // ENCRYPTED       │\n│  PLATFORM: GHOST-X C-SERIES UAS         │\n└─────────────────────────────────────────┘',
  'color: #38bdf8; font-family: monospace; font-size: 11px;',
  Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')
);

console.log(
  '%c⚠ NOTICE: All terminal activity is logged and monitored.\n  Keyboard shortcuts: [V] Camera  [N] NVG  [M] Audio  [T] Threat  [R] Radar',
  'color: #94a3b8; font-family: monospace; font-size: 10px;'
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
