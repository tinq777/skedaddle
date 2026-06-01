GitHub Pages deployment

Upload/deploy the CONTENTS of this folder as your GitHub Pages site root.
Do not deploy the old project root index.html, because that references /src/App.jsx and will not load on GitHub Pages.

Recommended GitHub Pages settings:
1. Repo > Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /root if you copy these files to the repo root, OR /docs if you place these files inside a docs folder.

This package is built with relative asset paths, so it works at:
- https://username.github.io/repo-name/
- https://custom-domain.com/

To connect the production backend Worker, edit config.js and set:
window.SKEDADDLE_WORKER_URL = "https://your-worker-url.workers.dev";
