# Skedaddle PWA — Production Build

This version removes demo mode and replaces the browser-Babel setup with a production Vite/React app.

## What changed

- Removed demo/mock destinations entirely.
- Removed JSX-in-browser execution.
- Added Vite production build pipeline.
- Added PWA manifest.
- Added `worker-example.js` for a safer Cloudflare Worker backend.
- The app now requires either:
  - `VITE_WORKER_URL` configured at build/deploy time, or
  - a user-supplied Anthropic API key entered in Settings.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

Deploy the generated `dist/` folder to Netlify, Vercel, Cloudflare Pages, or your static host.

## Recommended production API setup

Do not expose your Anthropic key in frontend code. Deploy `worker-example.js` as a Cloudflare Worker, add your `ANTHROPIC_API_KEY` as a Worker secret, then set this environment variable in your frontend host:

```bash
VITE_WORKER_URL=https://your-worker.yourname.workers.dev
```

Then rebuild/redeploy the frontend.
