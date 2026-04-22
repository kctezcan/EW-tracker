# Eisbach Wave Tracker

This is a lightweight, data-driven website that tracks the current state of the Eisbach wave in Munich.

## Files

- `index.html`: page shell
- `styles.css`: visual design
- `app.js`: renderer and feed filters
- `data/latest.json`: canonical structured update file
- `data/latest.js`: generated browser-ready data bundle
- `scripts/build.mjs`: rebuilds `data/latest.js` from `data/latest.json`

## Updating the site manually

1. Edit `data/latest.json`
2. Run `node scripts/build.mjs`
3. Open `index.html`

Because the browser reads `data/latest.js` directly, the page can be opened locally without a server.

## Free hosting

This project is prepared for GitHub Pages.

- The workflow file is at `.github/workflows/pages.yml`
- `.nojekyll` is included so Pages serves the site as plain static files
- On GitHub, create a public repository and push this project to the `main` branch
- In the repository settings, enable GitHub Pages / GitHub Actions if prompted

GitHub's official docs say GitHub Pages is available on public repositories with GitHub Free, and that Pages can publish either from a branch or from a GitHub Actions workflow.

## Publishing updates

Once the repository has GitHub Pages enabled and local GitHub credentials are working, you can publish fresh tracker data with:

```bash
./scripts/publish.sh
```

That script rebuilds `data/latest.js`, commits changes to `data/latest.json` and `data/latest.js`, and pushes them to `main`.

## Source policy

The tracker is designed to prefer:

- official Munich city sources
- engineering or university reporting
- public surf-community signals
- reputable news reports
- publicly indexed social references when available

It does not rely on private, login-walled, or authenticated scraping from Instagram or TikTok.
