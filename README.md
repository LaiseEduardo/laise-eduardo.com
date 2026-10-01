# laise-eduardo.com

Portfolio of Laise Eduardo. Static site in `site/`, infra in `terraform/`.

- `npm install && npx playwright install chromium`
- `npm run serve` → http://localhost:4173
- `npm test` — Playwright smoke tests
- `npm run test:unit` — Node unit tests
- `npm run lint:html`

Deploy: push to `main` runs `.github/workflows/deploy.yml`. Infra: see `terraform/README.md`.
