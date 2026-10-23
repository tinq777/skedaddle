# Privacy Policy

**Last updated: May 2026**

## What Skedaddle collects

Skedaddle stores the following data **on your device only** using `localStorage`:

| Data | Purpose | Where stored |
|------|---------|--------------|
| Anthropic API key | Authenticate AI requests | Your browser (localStorage) |
| Saved destinations | Your bolthole list | Your browser (localStorage) |
| Been there list | Skip visited places | Your browser (localStorage) |
| Search history | Quick rerun of past searches | Your browser (localStorage) |

## What leaves your device

When you tap **Skedaddle!**, the following is sent **directly from your browser to Anthropic**:

- Your filter selections (vibe, distance, group, dates, pet preference)
- Your "been there" list (so Claude can skip those places)
- Your API key (in the request header, to authenticate with Anthropic)

No data passes through any Skedaddle server — there isn't one.

## Third parties

- **Anthropic** — receives your prompt and returns destination suggestions. Governed by [Anthropic's Privacy Policy](https://www.anthropic.com/privacy).
- **Airbnb / Stayz** — you are redirected to their sites when tapping booking links. Their own privacy policies apply.
- **Google Maps** — opened in a new tab when tapping map links. Google's privacy policy applies.
- **Google Fonts** — loaded from Google's CDN on page load. Google's privacy policy applies.

## Deleting your data

Tap **Saved → 🔑 Reset API key** to clear your API key. To clear all data, open your browser's DevTools → Application → Local Storage → clear entries beginning with `skedaddle_`.

## Contact

This is a personal open-source project. Raise an issue on GitHub for any privacy concerns.
