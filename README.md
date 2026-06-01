# Skedaddle PWA — Production Build

This build fixes the blank-load issue and removes demo/browser API-key mode.

## What was fixed

- Replaced the broken `ReactDOM.createRoot(...)` call with the imported `createRoot(...)` API.
- Compiled JSX with Vite instead of shipping raw JSX to the browser.
- Changed Vite `base` to `./` so assets load correctly on static hosts and subfolders.
- Removed client-side Anthropic API key entry and direct browser API calls.
- Added runtime `public/config.js` / `dist/config.js` for your secure Worker URL.

## Deploy

Upload the contents of `dist/` to your static host.

Then set your Worker URL in `dist/config.js`:

```js
window.SKEDADDLE_WORKER_URL = "https://your-worker.your-subdomain.workers.dev";
```

Do not put Anthropic/OpenAI API keys in the frontend. Store secrets only in your Worker/backend.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
