# GAZE Tactical HUD

A military-style drone operator heads-up display built with React, Vite, and Tailwind CSS. Inspired by real MIL-STD-1787 flight symbology, F-35 HMDS, and MQ-9 Reaper ground control stations.

**[Live Demo](https://augustave.github.io/GAZE-HUD/)**

![GAZE HUD Screenshot](https://img.shields.io/badge/status-operational-38bdf8?style=flat-square&labelColor=050914)

## Features

### Core HUD Systems
- **MIL-STD Symbology** — Scrolling heading tape with cardinal markers, vertical altitude and airspeed tapes, pitch ladder with dashed negative-pitch hooks, waterline symbol, and flight path marker
- **Weapon Lock System** — Click the threat panel to engage. Red brackets tighten on the reticle as the firing solution calculates, with a progress bar and state transitions (idle > locking > locked)
- **Animated Radar Sweep** — Rotating sweep line with fading trail, 5 target blips that pulse when the beam passes, concentric range rings, and live coordinate readout
- **Dual Camera Modes** — Optical (desert terrain) and FLIR/thermal (white-hot heat signatures) with picture-in-picture sensor inset showing the alternate view

### Interactive Features
- **Cinematic Boot Sequence** — Full terminal-style startup with character-by-character typing, subsystem checks, and progress bar. Press Space to skip
- **Night Vision Mode** — SVG color matrix filter transforms the entire HUD to green phosphor with CRT scan lines and heavy vignette
- **Synthesized Audio** — Web Audio API cockpit ambient hum, accelerating lock tone, and lock-acquired chime. No audio files — pure oscillator synthesis
- **Custom Cursor Reticle** — SVG targeting crosshair replaces the native cursor. Brackets tighten on hover over interactive elements, spin during lock, pulse red when locked
- **Glitch Effects** — Screen tear on camera swap, chromatic aberration on lock acquired, static distortion on NVG toggle
- **Mouse Parallax** — Background layer shifts subtly with cursor movement, lerped at 5%/frame for smooth depth

### Live Telemetry
- Smooth sine-composite noise engine drives all values — heading, altitude, pitch, roll, AOA, airspeed, coordinates, core temperature, link QoS
- Scrolling terminal log with timestamped system messages
- Hex data streams updating at 10fps

## Keyboard Controls

| Key | Action |
|-----|--------|
| `V` | Swap optical / thermal camera |
| `N` | Toggle night vision mode |
| `M` | Toggle audio (muted by default) |
| `Esc` | Reset weapon lock |
| `Space` | Skip boot sequence |

## Tech Stack

- **React 19** — Component architecture with context-based state management
- **Vite 8** — Build tooling and HMR
- **Tailwind CSS v4** — Utility-first styling via `@tailwindcss/vite`
- **Lucide React** — Icon library
- **Web Audio API** — Synthesized cockpit audio (no external audio files)
- **SVG Filters** — NVG color matrix, chromatic aberration, used for real-time visual effects

## Project Structure

```
src/
  App.jsx                          # Orchestrator — layout, effects, boot gate
  contexts/HudContext.jsx          # All shared state
  hooks/
    useTelemetry.js                # Smooth sine-composite telemetry simulation
    useAudioEngine.js              # Web Audio API synthesizer
    useKeyboard.js                 # Unified keyboard handler
    useParallax.js                 # Mouse/gyro parallax offsets
    useBootSequence.js             # Phased startup state machine
  components/
    BootSequence.jsx               # Full-screen cinematic startup overlay
    CursorReticle.jsx              # Custom cursor with lock-on animation
    HudPanel.jsx                   # Reusable panel with precision brackets
    TelemetryRow.jsx               # Label/value telemetry display row
    hud/
      HeadingTape.jsx              # Scrolling MIL-STD heading tape
      AltitudeTape.jsx             # Vertical altitude tape (right edge)
      AirspeedTape.jsx             # Vertical airspeed tape (left edge)
      FlightReticle.jsx            # Center FPM, waterline, pitch ladder, lock brackets
      RadarSweep.jsx               # Animated rotating sweep with blips
      ThreatPanel.jsx              # Weapon lock UI
      SensorInset.jsx              # FLIR/optical camera inset
      TelemetryPanel.jsx           # System telemetry + terminal log
      NavPanel.jsx                 # Heading/nav data panel
      TopBar.jsx                   # Mode labels and keybind hints
      KeypressDisplay.jsx          # Floating key indicator on press
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and wait for the boot sequence.

## License

MIT
