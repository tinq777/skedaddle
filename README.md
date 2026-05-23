# 🏃 Skedaddle

**Weekend escape inspiration from Sydney — powered by AI.**

Skedaddle helps you find the perfect weekend getaway from Sydney in seconds. Tell it your vibe, how far you'll drive, and who's coming — it searches the web and returns 6 curated destination ideas with insider tips and direct links to book on Airbnb or Stayz.

## Features

- 🌲 **8 vibes** — Cabin, Beach, Eco, Wine, Family, Adventure, Wellness, Hidden Gems
- 🗓️ **Pick your dates** — any weekend, auto-defaults to next Friday–Sunday
- 📍 **Distance filter** — 2, 3, or 4 hours from Sydney
- 🐾 **Pet friendly toggle** — filters destinations and Airbnb results
- ⭐ **Save favourites** — persisted to localStorage
- ✓ **Been there flag** — skip places you've already visited
- 🕓 **Search history** — rerun your last 3 searches in one tap
- ↗ **Native share** — share destinations via iOS/Android share sheet
- 🗺️ **Google Maps link** — open any destination in Maps
- 🔒 **Your API key, your device** — stored locally, never leaves your browser

## Setup

1. Open `index.html` in any modern browser — no build step, no npm, no server needed
2. On first launch, enter your [Anthropic API key](https://console.anthropic.com/keys)
3. Your key is saved to localStorage on your device only

## Deploying to GitHub Pages

1. Create a new GitHub repo
2. Upload `index.html` and `favicon.svg` to the repo root
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Your app will be live at `https://yourusername.github.io/reponame`

## Tech stack

- React 18 via CDN (unpkg)
- Babel Standalone for JSX transpilation
- Anthropic Claude API with web search tool
- No build step · No dependencies · No server

## Privacy

See [PRIVACY.md](PRIVACY.md) for details on data handling.

## License

MIT — see [LICENSE](LICENSE)
