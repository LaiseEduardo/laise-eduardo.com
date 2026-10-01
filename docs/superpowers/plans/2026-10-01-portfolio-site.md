# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship laise-eduardo.com: a one-page static portfolio for Laise Eduardo on S3 + CloudFront, DNS on Cloudflare, deployed by GitHub Actions.

**Architecture:** `site/` is plain HTML/CSS/JS with content in `site/content.js` rendered by `site/main.js`. `terraform/` creates bucket, OAC, ACM cert (validated via Cloudflare DNS records), CloudFront, DNS CNAMEs and the OIDC deploy role. `.github/workflows/deploy.yml` syncs `site/` to S3 and invalidates CloudFront on push to `main`.

**Tech Stack:** HTML/CSS/ES modules, Playwright (smoke tests), html-validate, Terraform ≥ 1.9 with `hashicorp/aws ~> 5` and `cloudflare/cloudflare ~> 4`, GitHub Actions, AWS CLI.

**Spec:** `docs/superpowers/specs/2026-10-01-portfolio-site-design.md`

## Global Constraints

- Site language: English only.
- No framework, no build step: `site/` is deployed as-is.
- Responsive from 360px; 16px side gutters on phones; no horizontal scroll.
- Light and dark via `prefers-color-scheme`; colors as custom properties on `:root`.
- Contrast ≥ 4.5:1 for body text; visible focus styles; skip link; landmarks.
- AWS account 369728037262, region `eu-west-1`; ACM cert in `us-east-1`.
- Bucket names: `laise-eduardo-com-web`, `laise-eduardo-com-terraform-state`.
- IAM role name: `laise-eduardo-com-github-actions-deploy`.
- Cloudflare DNS records `proxied = false`.
- GitHub repo: `LaiseEduardo/laise-eduardo.com`, public.
- Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. `content.cv` is `null` → the "Download CV" button must not render (Task 2 test).
2. A project with no `live` URL → the card renders only the repo link, no empty anchor (Task 2 test).
3. Request to `https://www.laise-eduardo.com/x?y=1` → 301 to `https://laise-eduardo.com/x?y=1` (Task 4 unit test of the CloudFront function via `aws cloudfront test-function` is manual; the JS is also exercised by a Node test in Task 4).
4. Unknown path → CloudFront serves `/404.html` with HTTP 404, not 200 (Task 4 config; Task 6 manual curl check).
5. Window width 360px → no horizontal overflow (Task 3 Playwright test).

---

### Task 1: Repo scaffold and smoke-test harness

**Files:**
- Create: `.gitignore`, `README.md`, `package.json`, `playwright.config.js`, `tests/smoke.spec.js`, `site/index.html`

**Interfaces:**
- Produces: `npm test` (Playwright against `python3 -m http.server 4173 -d site`), `npm run lint:html`.

- [ ] **Step 1: Scaffold files**

`.gitignore`:
```
node_modules/
test-results/
playwright-report/
.terraform/
*.tfstate
*.tfstate.backup
.terraform.lock.hcl
.env
.DS_Store
```

`package.json`:
```json
{
  "name": "laise-eduardo.com",
  "private": true,
  "type": "module",
  "scripts": {
    "serve": "python3 -m http.server 4173 -d site",
    "test": "playwright test",
    "lint:html": "html-validate site/index.html site/404.html"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "html-validate": "^9.0.0"
  }
}
```

`playwright.config.js`:
```js
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:4173' },
  webServer: { command: 'python3 -m http.server 4173 -d site', port: 4173, reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 360, height: 740 } } },
  ],
});
```

`README.md`:
```markdown
# laise-eduardo.com

Portfolio of Laise Eduardo. Static site in `site/`, infra in `terraform/`.

- `npm install && npx playwright install chromium`
- `npm run serve` → http://localhost:4173
- `npm test` — Playwright smoke tests
- `npm run lint:html`

Deploy: push to `main` runs `.github/workflows/deploy.yml`. Infra: see `terraform/README.md`.
```

- [ ] **Step 2: Write the failing smoke test**

`tests/smoke.spec.js`:
```js
import { test, expect } from '@playwright/test';

test('home page loads with title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Laise Eduardo/);
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm install && npx playwright install chromium && npm test`
Expected: FAIL (no `site/index.html`, server returns 404).

- [ ] **Step 4: Minimal index.html**

`site/index.html`:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Laise Eduardo — Software Developer in Test</title>
</head>
<body>
  <main id="main"></main>
</body>
</html>
```

- [ ] **Step 5: Run tests, verify pass; commit**

Run: `npm test` → PASS (both projects).
```bash
git add -A && git commit -m "chore: scaffold site and Playwright smoke harness"
```

---

### Task 2: Content model and rendering

**Files:**
- Create: `site/content.js`, `site/main.js`
- Modify: `site/index.html`
- Test: `tests/smoke.spec.js`

**Interfaces:**
- Produces: `site/content.js` default export `content` with shape:
  `{ name, title, location, pitch, email, links: { github, linkedin }, cv: string|null, about: string[], skills: { group: string, items: string[] }[], experience: { role, company, period, bullets: string[] }[], projects: { name, description, tags: string[], repo, live: string|null }[] }`.
- `site/main.js` renders sections with ids `hero`, `about`, `skills`, `experience`, `projects`, `contact`.

- [ ] **Step 1: Add failing tests**

Append to `tests/smoke.spec.js`:
```js
const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];

test('every section is present', async ({ page }) => {
  await page.goto('/');
  for (const id of sections) await expect(page.locator(`#${id}`)).toBeVisible();
});

test('every link has a non-empty href', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(5);
  for (const h of hrefs) expect(h, 'empty href').toMatch(/\S/);
});

test('CV button is hidden when content.cv is null', async ({ page }) => {
  await page.addInitScript(() => { window.__TEST_OVERRIDES__ = { cv: null }; });
  await page.goto('/');
  await expect(page.getByRole('link', { name: /download cv/i })).toHaveCount(0);
});

test('project without live url shows only repo link', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#projects article', { hasText: 'polar-bear' });
  await expect(card.getByRole('link', { name: /code/i })).toHaveCount(1);
  await expect(card.getByRole('link', { name: /live/i })).toHaveCount(0);
});
```

- [ ] **Step 2: Run, verify fail** — `npm test` → 4 new tests FAIL.

- [ ] **Step 3: Write content.js**

`site/content.js`:
```js
const content = {
  name: 'Laise Eduardo',
  title: 'Software Developer in Test · Test Automation Architect',
  location: 'Barcelona, Spain',
  pitch: 'I design test automation that teams trust: fast, readable, and wired into CI from day one.',
  email: 'laise.aeduardo@gmail.com',
  links: {
    github: 'https://github.com/LaiseEduardo',
    linkedin: 'https://www.linkedin.com/in/laise-eduardo', // TODO confirm
  },
  cv: null, // set to 'cv.pdf' when the PDF is added to site/
  about: [
    'TODO — paragraph 1 from CV.',
    'TODO — paragraph 2 from CV.',
  ],
  skills: [
    { group: 'Test automation', items: ['Playwright', 'TypeScript', 'E2E & API testing', 'Test architecture', 'Page objects'] },
    { group: 'CI/CD & cloud', items: ['GitHub Actions', 'AWS (S3, CloudFront, Lambda)', 'Terraform', 'Cloudflare'] },
    { group: 'Engineering', items: ['Node.js', 'React', 'React Native / Expo', 'PostgreSQL', 'REST APIs'] },
  ],
  experience: [
    { role: 'TODO role', company: 'TODO company', period: 'TODO 2024 — present', bullets: ['TODO achievement 1', 'TODO achievement 2'] },
  ],
  projects: [
    { name: 'polar-bear', description: 'Clean, maintainable Playwright + TypeScript test automation framework for the RealWorld app, with CI on every push.', tags: ['Playwright', 'TypeScript', 'GitHub Actions'], repo: 'https://github.com/LaiseEduardo/polar-bear', live: null },
    { name: 'eleven11', description: 'Community price comparison for groceries, fuel and pet products. Web, Expo mobile app and admin, 88%+ test coverage across apps.', tags: ['TypeScript', 'React', 'Expo', 'AWS', 'Terraform'], repo: 'https://github.com/LaiseEduardo/eleven11', live: 'https://eleven11finder.com' },
    { name: '420finder', description: 'Multi-tenant platform for cannabis clubs: catalog, members, prepaid wallets and in-person orders.', tags: ['TypeScript', 'React', 'AWS', 'Terraform'], repo: 'https://github.com/LaiseEduardo/420finder', live: null },
    { name: 'Zelo', description: 'Family care coordination app that turns WhatsApp chaos into organised caregiving.', tags: ['TypeScript', 'React', 'AWS'], repo: 'https://github.com/LaiseEduardo/zelo-app', live: null },
  ],
};
export default content;
```

- [ ] **Step 4: Write main.js**

`site/main.js`:
```js
import base from './content.js';

const content = { ...base, ...(window.__TEST_OVERRIDES__ || {}) };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? vals[i] : ''), '');
const list = (arr, fn) => arr.map(fn).join('');

const hero = () => html`
<section id="hero" class="hero">
  <p class="eyebrow">${esc(content.location)}</p>
  <h1>${esc(content.name)}</h1>
  <p class="title">${esc(content.title)}</p>
  <p class="pitch">${esc(content.pitch)}</p>
  <div class="actions">
    <a class="btn primary" href="#projects">View projects</a>
    ${content.cv ? html`<a class="btn" href="${esc(content.cv)}" download>Download CV</a>` : ''}
  </div>
  <ul class="social">
    <li><a href="${esc(content.links.github)}" rel="me noopener" target="_blank">GitHub</a></li>
    <li><a href="${esc(content.links.linkedin)}" rel="me noopener" target="_blank">LinkedIn</a></li>
    <li><a href="mailto:${esc(content.email)}">Email</a></li>
  </ul>
</section>`;

const about = () => html`
<section id="about"><h2>About</h2>${list(content.about, p => html`<p>${esc(p)}</p>`)}</section>`;

const skills = () => html`
<section id="skills"><h2>Skills</h2>
  ${list(content.skills, g => html`<div class="skill-group"><h3>${esc(g.group)}</h3>
    <ul class="chips">${list(g.items, i => html`<li>${esc(i)}</li>`)}</ul></div>`)}
</section>`;

const experience = () => html`
<section id="experience"><h2>Experience</h2>
  <ol class="timeline">${list(content.experience, e => html`
    <li><h3>${esc(e.role)} <span class="muted">· ${esc(e.company)}</span></h3>
      <p class="period">${esc(e.period)}</p>
      <ul>${list(e.bullets, b => html`<li>${esc(b)}</li>`)}</ul></li>`)}
  </ol>
</section>`;

const projects = () => html`
<section id="projects"><h2>Projects</h2>
  <div class="cards">${list(content.projects, p => html`
    <article class="card">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description)}</p>
      <ul class="chips">${list(p.tags, t => html`<li>${esc(t)}</li>`)}</ul>
      <p class="card-links">
        <a href="${esc(p.repo)}" rel="noopener" target="_blank">Code</a>
        ${p.live ? html`<a href="${esc(p.live)}" rel="noopener" target="_blank">Live site</a>` : ''}
      </p>
    </article>`)}
  </div>
</section>`;

const contact = () => html`
<section id="contact"><h2>Contact</h2>
  <p>Open to QA engineering and test-automation roles, on-site in Barcelona or remote.</p>
  <p><a class="btn primary" href="mailto:${esc(content.email)}">${esc(content.email)}</a></p>
</section>`;

document.getElementById('main').innerHTML = [hero(), about(), skills(), experience(), projects(), contact()].join('');
document.getElementById('year').textContent = new Date().getFullYear();
```

- [ ] **Step 5: Wire index.html**

Replace `<body>` of `site/index.html` with:
```html
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="top">
    <a class="brand" href="#hero">LE</a>
    <nav aria-label="Sections">
      <a href="#about">About</a><a href="#skills">Skills</a><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#contact">Contact</a>
    </nav>
  </header>
  <main id="main"></main>
  <footer><p>© <span id="year"></span> Laise Eduardo · Built with plain HTML &amp; CSS, hosted on AWS.</p></footer>
  <script type="module" src="main.js"></script>
</body>
```

- [ ] **Step 6: Run tests → PASS; commit**

```bash
git add -A && git commit -m "feat: content model and section rendering"
```

---

### Task 3: Styles, 404 page, meta and SEO files

**Files:**
- Create: `site/styles.css`, `site/404.html`, `site/favicon.svg`, `site/robots.txt`, `site/sitemap.xml`
- Modify: `site/index.html` (head)
- Test: `tests/smoke.spec.js`, `npm run lint:html`

**Interfaces:** none new. Use the frontend-design skill when writing `styles.css`; brief: confident, precise, technical; not a template. Keep the class names used in Task 2.

- [ ] **Step 1: Add failing tests**

Append to `tests/smoke.spec.js`:
```js
test('no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('404 page exists and is styled', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('404');
  await expect(page.locator('link[rel=stylesheet]')).toHaveAttribute('href', 'styles.css');
});

test('meta description and canonical present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /.{40,}/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://laise-eduardo.com/');
});
```

- [ ] **Step 2: Run → the 404 and meta tests FAIL.**

- [ ] **Step 3: Head of index.html**

Inside `<head>` after `<title>` add:
```html
  <meta name="description" content="Laise Eduardo is a software developer in test and test automation architect in Barcelona, building Playwright and TypeScript automation wired into CI/CD on AWS.">
  <link rel="canonical" href="https://laise-eduardo.com/">
  <meta property="og:title" content="Laise Eduardo — Software Developer in Test">
  <meta property="og:description" content="Test automation architect in Barcelona. Playwright, TypeScript, CI/CD, AWS.">
  <meta property="og:url" content="https://laise-eduardo.com/">
  <meta property="og:type" content="website">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="styles.css">
```

- [ ] **Step 4: 404.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — Laise Eduardo</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main id="main" class="hero">
    <h1>404</h1>
    <p class="pitch">That page is not here. <a href="/">Back to the start.</a></p>
  </main>
</body>
</html>
```

- [ ] **Step 5: favicon.svg, robots.txt, sitemap.xml**

`favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0f172a"/><text x="32" y="42" font-family="ui-monospace,monospace" font-size="28" font-weight="700" fill="#e2e8f0" text-anchor="middle">LE</text></svg>
```
`robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://laise-eduardo.com/sitemap.xml
```
`sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://laise-eduardo.com/</loc></url></urlset>
```

- [ ] **Step 6: styles.css**

Invoke `frontend-design:frontend-design`, then write `site/styles.css` covering: `:root` tokens (`--bg`, `--fg`, `--muted`, `--accent`, `--card`, `--border`) with a dark-mode override under `@media (prefers-color-scheme: dark)`; `body` explicit background; typography (one display face from Google Fonts loaded via `@import`, system sans for body, monospace for chips); `.skip` visually hidden until focused; sticky `.top` header; `.hero` with large `h1`; `.chips` as inline-flex pills; `.cards` as `grid` with `repeat(auto-fit, minmax(260px, 1fr))`; `.timeline` with a left rule; `.btn` / `.btn.primary`; `:focus-visible` outline 2px `var(--accent)`; `max-width: 72rem` container with `padding-inline: 16px`; `@media (min-width: 48rem)` to widen gutters. Verify contrast of `--fg` on `--bg` ≥ 4.5:1 in both modes.

- [ ] **Step 7: Lint, test, look, commit**

Run: `npm run lint:html` → no errors. `npm test` → PASS. Open `npm run serve` in the browser pane at 1280 and 360 widths and check both color schemes.
```bash
git add -A && git commit -m "feat: styles, 404 page, favicon and SEO files"
```

---

### Task 4: Terraform infrastructure

**Files:**
- Create: `terraform/README.md`, `terraform/backend.tf`, `terraform/providers.tf`, `terraform/variables.tf`, `terraform/web.tf`, `terraform/dns.tf`, `terraform/iam.tf`, `terraform/outputs.tf`, `terraform/www-redirect.js`, `tests/www-redirect.test.js`

**Interfaces:**
- Produces outputs `web_bucket_name`, `web_cloudfront_distribution_id`, `deploy_role_arn` consumed by Task 5.
- Requires env `CLOUDFLARE_API_TOKEN` at plan/apply time.

- [ ] **Step 1: Failing test for the www redirect function**

`tests/www-redirect.test.js` (Node built-in test runner):
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../terraform/www-redirect.js', import.meta.url), 'utf8');
const handler = new Function(`${src}; return handler;`)();

test('www redirects to apex keeping path and query', () => {
  const res = handler({ request: { headers: { host: { value: 'www.laise-eduardo.com' } }, uri: '/x', querystring: { y: { value: '1' }, z: { value: '' } } } });
  assert.equal(res.statusCode, 301);
  assert.equal(res.headers.location.value, 'https://laise-eduardo.com/x?y=1&z');
});

test('apex passes through', () => {
  const req = { headers: { host: { value: 'laise-eduardo.com' } }, uri: '/', querystring: {} };
  assert.equal(handler({ request: req }), req);
});
```
Add to `package.json` scripts: `"test:unit": "node --test tests/*.test.js"`.

- [ ] **Step 2: Run `npm run test:unit` → FAIL (file missing).**

- [ ] **Step 3: www-redirect.js**

`terraform/www-redirect.js`:
```js
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  if (host.indexOf('www.') !== 0) return request;
  var qs = Object.keys(request.querystring).map(function (k) {
    var q = request.querystring[k];
    return q.value === '' ? k : k + '=' + q.value;
  }).join('&');
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: 'https://' + host.slice(4) + request.uri + (qs ? '?' + qs : '') } }
  };
}
```

- [ ] **Step 4: Run `npm run test:unit` → PASS.**

- [ ] **Step 5: Terraform files**

`terraform/backend.tf`:
```hcl
# Create the state bucket once, by hand, before `terraform init`:
#   aws s3api create-bucket --bucket laise-eduardo-com-terraform-state --region eu-west-1 \
#     --create-bucket-configuration LocationConstraint=eu-west-1
#   aws s3api put-bucket-versioning --bucket laise-eduardo-com-terraform-state \
#     --versioning-configuration Status=Enabled
terraform {
  backend "s3" {
    bucket       = "laise-eduardo-com-terraform-state"
    key          = "laise-eduardo.com/terraform.tfstate"
    region       = "eu-west-1"
    use_lockfile = true
    encrypt      = true
  }
}
```

`terraform/providers.tf`:
```hcl
terraform {
  required_version = ">= 1.9.0"
  required_providers {
    aws        = { source = "hashicorp/aws", version = "~> 5.0" }
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 4.0" }
  }
}

locals {
  tags = { Project = "laise-eduardo.com", ManagedBy = "terraform" }
}

provider "aws" {
  region = var.aws_region
  default_tags { tags = local.tags }
}

# CloudFront only accepts ACM certificates issued in us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  default_tags { tags = local.tags }
}

# Auth via CLOUDFLARE_API_TOKEN env var (Zone:DNS:Edit on laise-eduardo.com).
provider "cloudflare" {}
```

`terraform/variables.tf`:
```hcl
variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "domain" {
  type    = string
  default = "laise-eduardo.com"
}

variable "github_repo" {
  description = "owner/repo allowed to assume the deploy role"
  type        = string
  default     = "LaiseEduardo/laise-eduardo.com"
}
```

`terraform/web.tf`:
```hcl
resource "aws_s3_bucket" "web" {
  bucket = "laise-eduardo-com-web"
}

resource "aws_s3_bucket_versioning" "web" {
  bucket = aws_s3_bucket.web.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_public_access_block" "web" {
  bucket                  = aws_s3_bucket.web.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_acm_certificate" "web" {
  provider                  = aws.us_east_1
  domain_name               = var.domain
  subject_alternative_names = ["www.${var.domain}"]
  validation_method         = "DNS"
  lifecycle { create_before_destroy = true }
}

resource "aws_acm_certificate_validation" "web" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.web.arn
  validation_record_fqdns = [for r in cloudflare_record.acm_validation : r.hostname]
}

resource "aws_cloudfront_origin_access_control" "web" {
  name                              = "laise-eduardo-com-web-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "www_redirect" {
  name    = "laise-eduardo-com-www-redirect"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/www-redirect.js")
}

resource "aws_cloudfront_distribution" "web" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.domain, "www.${var.domain}"]
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.web.bucket_regional_domain_name
    origin_id                = "s3-web"
    origin_access_control_id = aws_cloudfront_origin_access_control.web.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-web"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.www_redirect.arn
    }
  }

  # Private OAC bucket answers 403 for missing keys; map both to a real 404.
  custom_error_response {
    error_code         = 403
    response_code      = 404
    response_page_path = "/404.html"
  }
  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.web.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.web.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontServicePrincipal"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.web.arn}/*"
      Condition = { StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.web.arn } }
    }]
  })
}
```

`terraform/dns.tf`:
```hcl
data "cloudflare_zone" "site" {
  name = var.domain
}

resource "cloudflare_record" "acm_validation" {
  for_each = {
    for o in aws_acm_certificate.web.domain_validation_options : o.domain_name => {
      name  = o.resource_record_name
      type  = o.resource_record_type
      value = o.resource_record_value
    }
  }
  zone_id = data.cloudflare_zone.site.id
  name    = trimsuffix(each.value.name, ".")
  type    = each.value.type
  content = trimsuffix(each.value.value, ".")
  ttl     = 60
  proxied = false
}

# DNS-only so CloudFront terminates TLS (no double CDN). Cloudflare flattens the apex CNAME.
resource "cloudflare_record" "apex" {
  zone_id = data.cloudflare_zone.site.id
  name    = "@"
  type    = "CNAME"
  content = aws_cloudfront_distribution.web.domain_name
  ttl     = 300
  proxied = false
}

resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.site.id
  name    = "www"
  type    = "CNAME"
  content = aws_cloudfront_distribution.web.domain_name
  ttl     = 300
  proxied = false
}
```

`terraform/iam.tf`:
```hcl
# The OIDC provider for token.actions.githubusercontent.com already exists in
# this account (created for eleven11); AWS allows one per URL, so reuse it.
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "deploy" {
  name = "laise-eduardo-com-github-actions-deploy"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = data.aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" }
        # GitHub appends numeric ids as "owner@id/repo@id"; wildcard them.
        StringLike = {
          "token.actions.githubusercontent.com:sub" = [
            "repo:${split("/", var.github_repo)[0]}@*/${split("/", var.github_repo)[1]}@*:environment:production",
            "repo:${var.github_repo}:environment:production",
          ]
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "deploy" {
  name = "deploy-site"
  role = aws_iam_role.deploy.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      { Effect = "Allow", Action = ["s3:ListBucket"], Resource = aws_s3_bucket.web.arn },
      { Effect = "Allow", Action = ["s3:PutObject", "s3:DeleteObject"], Resource = "${aws_s3_bucket.web.arn}/*" },
      { Effect = "Allow", Action = ["cloudfront:CreateInvalidation"], Resource = aws_cloudfront_distribution.web.arn },
    ]
  })
}
```

`terraform/outputs.tf`:
```hcl
output "web_bucket_name" { value = aws_s3_bucket.web.bucket }
output "web_cloudfront_distribution_id" { value = aws_cloudfront_distribution.web.id }
output "web_cloudfront_domain" { value = aws_cloudfront_distribution.web.domain_name }
output "deploy_role_arn" { value = aws_iam_role.deploy.arn }
```

`terraform/README.md`:
```markdown
# Infra

One environment (prod). Applied by hand from a laptop with admin AWS credentials.

1. Create the state bucket (see `backend.tf` header) — once.
2. `export CLOUDFLARE_API_TOKEN=...` (Zone:DNS:Edit on laise-eduardo.com).
3. `terraform -chdir=terraform init && terraform -chdir=terraform plan`
4. `terraform -chdir=terraform apply`
5. Put `deploy_role_arn`, `web_bucket_name`, `web_cloudfront_distribution_id` into the GitHub `production` environment variables `AWS_DEPLOY_ROLE_ARN`, `WEB_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.
```

- [ ] **Step 6: Validate**

Run: `terraform -chdir=terraform init -backend=false && terraform -chdir=terraform validate && terraform -chdir=terraform fmt -check`
Expected: `Success! The configuration is valid.`

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "infra: S3 + CloudFront + ACM, Cloudflare DNS, OIDC deploy role"
```

---

### Task 5: GitHub Actions CI and deploy workflows

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes GitHub environment `production` variables `AWS_DEPLOY_ROLE_ARN`, `WEB_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID` (set in Task 6).

- [ ] **Step 1: ci.yml**

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint:html
      - run: npm run test:unit
      - run: npx playwright install --with-deps chromium
      - run: npm test
```

- [ ] **Step 2: deploy.yml**

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
concurrency: { group: deploy-prod, cancel-in-progress: false }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    permissions: { id-token: write, contents: read }
    steps:
      - uses: actions/checkout@v5
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE_ARN }}
          aws-region: eu-west-1
      - name: Sync assets (long cache)
        run: aws s3 sync site/ "s3://${{ vars.WEB_BUCKET }}" --delete --exclude "*.html" --cache-control "public, max-age=3600"
      - name: Sync HTML (no-cache)
        run: aws s3 sync site/ "s3://${{ vars.WEB_BUCKET }}" --exclude "*" --include "*.html" --cache-control "no-cache" --content-type "text/html; charset=utf-8"
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id "${{ vars.CLOUDFRONT_DISTRIBUTION_ID }}" --paths "/*"
```

- [ ] **Step 3: Lint and commit**

Run: `npx --yes action-validator .github/workflows/ci.yml .github/workflows/deploy.yml` (or `yamllint`). Expected: no errors.
```bash
git add -A && git commit -m "ci: test on PR, deploy to S3/CloudFront on main"
```

---

### Task 6: Go live (manual, with Laise present)

**Files:** none new.

- [ ] **Step 1: Create GitHub repo and push**

```bash
gh repo create LaiseEduardo/laise-eduardo.com --public --source=. --remote=origin --push
```

- [ ] **Step 2: State bucket (once)**

```bash
aws s3api create-bucket --bucket laise-eduardo-com-terraform-state --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1
aws s3api put-bucket-versioning --bucket laise-eduardo-com-terraform-state --versioning-configuration Status=Enabled
```

- [ ] **Step 3: Apply**

Laise exports `CLOUDFLARE_API_TOKEN` in her shell (never pasted in chat). Then:
```bash
terraform -chdir=terraform init && terraform -chdir=terraform apply
```
Expected: cert validates within ~5 minutes, distribution deploys in ~5 minutes.

- [ ] **Step 4: GitHub environment variables**

```bash
gh api -X PUT repos/LaiseEduardo/laise-eduardo.com/environments/production
for v in AWS_DEPLOY_ROLE_ARN:deploy_role_arn WEB_BUCKET:web_bucket_name CLOUDFRONT_DISTRIBUTION_ID:web_cloudfront_distribution_id; do
  gh variable set "${v%%:*}" --env production --body "$(terraform -chdir=terraform output -raw "${v##*:}")"
done
```

- [ ] **Step 5: Deploy and verify**

```bash
gh workflow run Deploy && gh run watch
curl -sI https://laise-eduardo.com/ | head -1          # HTTP/2 200
curl -sI https://www.laise-eduardo.com/a?b=1 | grep -i location  # https://laise-eduardo.com/a?b=1
curl -sI https://laise-eduardo.com/nope | head -1      # HTTP/2 404
```
Open https://laise-eduardo.com in the browser pane, check both color schemes and 360px width.

- [ ] **Step 6: Record outputs in README and commit**

Add the live URL to `README.md` top line; commit `docs: link live site`.
