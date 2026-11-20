# MataLens Demo Contingency & Offline-Safe Fallback Protocol

> **Event:** AIESEC × HISA Civic Innovation Hackathon  
> **Audience:** Presenters, Demo Operators & Technical Staff  
> **Mission:** Guarantee a flawless, zero-crash live demonstration under any venue network failure  
> **Date:** 20 November 2026  
> **Status:** Approved Stage-Emergency Contingency Protocol  

---

## 1. Golden Rules of Live Demos

1. **Assume the Venue Wi-Fi Will Die:** Hackathon venue Wi-Fi networks routinely collapse under the weight of hundreds of connected devices. Never rely on an active external internet connection for the core pitch.
2. **Never Show an Empty Error Screen:** Every screen must have a pre-bundled, offline-accessible fallback state that renders smoothly without breaking.
3. **Know the Escape Hatches:** If an interactive feature fails, pivot smoothly using the rehearsed talk track rather than refreshing the page frantically.

---

## 2. Emergency Failure Scenarios & Immediate Pivot Protocols

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               EMERGENCY PIVOT MATRIX                                            │
├─────────────────────┬───────────────────────────┬───────────────────────────────────────────────┤
│ FAILURE SCENARIO    │ IMMEDIATE SYMPTOM         │ REHEARSED PIVOT & TALK TRACK                  │
├─────────────────────┼───────────────────────────┼───────────────────────────────────────────────┤
│ 1. Wi-Fi Dies       │ Browser shows "No Internet│ DO NOT PANIC.                                 │
│    Completely       │ or red offline banner     │ Action: The app switches to offline PWA mode. │
│                     │                           │ Talk Track: "Notice how MataLens instantly    │
│                     │                           │ detects the network drop. Our offline service │
│                     │                           │ worker serves our cached briefing and voter   │
│                     │                           │ guides—built for real Nigerian connectivity." │
├─────────────────────┼───────────────────────────┼───────────────────────────────────────────────┤
│ 2. Backend Server   │ Story feed shows "Updates │ Action: Toggle fallback fixtures.             │
│    Returns 503/Crash│ temporarily unavailable"  │ Talk Track: "Our frontend includes an in-     │
│                     │                           │ memory offline seed edition that guarantees   │
│                     │                           │ continuous civic access even during outages." │
├─────────────────────┼───────────────────────────┼───────────────────────────────────────────────┤
│ 3. External Source  │ Outbound link to INEC     │ Action: Do not click outward; expand the      │
│    Link Times Out   │ portal spins indefinitely │ inline Truth Anchor drawer instead.           │
│                     │                           │ Talk Track: "Instead of forcing you to open a │
│                     │                           │ slow government PDF, MataLens extracts the    │
│                     │                           │ verified clause directly into this drawer."   │
├─────────────────────┼───────────────────────────┼───────────────────────────────────────────────┤
│ 4. Camera Upload    │ Civic Camera intake shows │ Action: Switch to "My Actions / Receipts".    │
│    Is Disabled      │ "Intake temporarily paused│ Talk Track: "During off-cycle moderation, our │
│                     │ for security"             │ intake pauses to prevent spam. Let me show you│
│                     │                           │ how a voter inspects their existing receipt." │
└─────────────────────┴───────────────────────────┴───────────────────────────────────────────────┘
```

---

## 3. Pre-Flight Demo Checklist (30 Minutes Before Stage Call)

Execute these steps in order on the primary presentation laptop:

### Step 1: Pre-Build the Production Assets
Do not run in development mode on stage (Vite HMR overlays can pop up on warnings). Run a clean production build:
```sh
npm run data:import
npm run build
```

### Step 2: Start the Standalone Production Server
Launch the unified production server on `localhost:3000`:
```sh
npm start
```
Verify the server starts with message:
```text
[MataLens] Server running on http://127.0.0.1:3000
[MataLens] Loaded reviewed edition: 5 stories verified
```

### Step 3: Warm Up Browser Caches & Local Storage
Open Google Chrome in a dedicated clean presentation profile:
1. Navigate to `http://127.0.0.1:3000`.
2. Click **Follow** on *Ireti Kingibe* and *Bola Ahmed Tinubu*.
3. Click the first story: *INEC extends the election staff application deadline*.
4. Click through the **Civic Rehearsal** card once to ensure the 3D flip animation has GPU cached.
5. Navigate to `/camera` and confirm the intake badge shows `Ready`.
6. Navigate to `/actions` to verify local receipt retrieval.

### Step 4: Prepare the "Airplane Mode" Verification
Disconnect Wi-Fi on the laptop for 30 seconds. Reload `http://127.0.0.1:3000`.
- Verify the page renders from the local Service Worker.
- Confirm the **[Offline Mode ✓]** indicator appears politely in the header.
- Reconnect Wi-Fi.

---

## 4. Hardware & Screen Presentation Configuration

1. **Resolution:** Force external display output to **$1920 \times 1080$** (16:9 widescreen).
2. **Browser Zoom:** Set Chrome zoom level to **110%** (`Ctrl + Plus`). This ensures jury members in the back row can clearly read the `Newsreader` headlines and 15-second Key Facts bullets.
3. **Disable Notifications:** Turn on **Focus Assist / Do Not Disturb** on Windows/macOS. Prevent Slack, WhatsApp, or email banners from interrupting the live demo.
4. **Backup Video Recording:** Keep a 1080p MP4 screen recording (60fps) of the 3-minute walkthrough on the desktop (`matalens-backup-demo.mp4`). If the projector HDMI drops or hardware freezes, play the video immediately while delivering the script live.
