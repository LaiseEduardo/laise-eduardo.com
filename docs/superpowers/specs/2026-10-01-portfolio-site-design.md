# laise-eduardo.com — portfolio site design

Date: 2026-10-01

## Purpose

A personal portfolio for Laise Eduardo, software developer in test / test
automation architect based in Barcelona. The audience is recruiters and
hiring managers for QA and test-automation roles (employment or freelance).
Success: a recruiter lands on the site, understands in under a minute what
Laise does and how well, sees concrete projects with code, and can reach her.

Language: English only.

## Scope

In scope:

- One static page served at `https://laise-eduardo.com` (with `www` redirecting to apex).
- Infrastructure as code (Terraform) for hosting and DNS.
- GitHub Actions deploy on push to `main`.

Out of scope (YAGNI): blog, CMS, i18n, analytics, contact form backend,
multiple environments. A dev/staging environment can be added later; the
site is low-risk and deploys are seconds.

## Content and sections

Single page, in this order:

1. **Hero** — name, title ("Software Developer in Test · Test Automation Architect"), location (Barcelona), one-line pitch, buttons: "View projects", "Download CV", links GitHub / LinkedIn / email.
2. **About** — 2–3 short paragraphs. Placeholder until CV arrives.
3. **Skills** — grouped chips: Test automation (Playwright, TypeScript, …), CI/CD (GitHub Actions), Cloud (AWS, Terraform), Backend/Web (Node, React, …). Initial list derived from the repos; refined from the CV.
4. **Experience** — timeline of roles. Placeholder entries clearly marked `TODO` until the CV arrives.
5. **Projects** — cards from GitHub: polar-bear (Playwright test framework), eleven11 (price comparison platform, live), 420finder (multi-tenant platform), Zelo (family care coordination). Each card: name, one-line description, tech tags, links (repo, live site where it exists).
6. **Contact** — email, GitHub, LinkedIn. Plain `mailto:` link; no form.
7. **Footer** — copyright, "built with HTML/CSS, hosted on AWS".

Content lives in `site/content.js` as a plain JS object so text edits do not
touch markup; `site/main.js` renders the sections. The CV is a PDF at
`site/cv.pdf` (placeholder until provided).

## Site implementation

- Plain HTML, CSS, JavaScript. No framework, no build step. Files in `site/`:
  `index.html`, `styles.css`, `content.js`, `main.js`, `cv.pdf`, `favicon.svg`,
  `og.png` (optional, later).
- Responsive from 360px up; 16px gutters on phones.
- Light and dark theme via `prefers-color-scheme`, colors as CSS custom properties on `:root`.
- Semantic HTML with skip link, landmarks, visible focus styles, contrast ≥ 4.5:1.
- Meta: title, description, Open Graph, canonical. `robots.txt` and `sitemap.xml`.
- Design direction is handled by the frontend-design skill at implementation time; the brief is "confident, precise, technical; not a template".

## Infrastructure (Terraform, `terraform/`)

Mirrors the proven 420finder pattern in the same AWS account (369728037262):

- `aws_s3_bucket` `laise-eduardo-com-web`, all public access blocked, versioning on.
- `aws_cloudfront_origin_access_control` so only CloudFront reads the bucket.
- `aws_acm_certificate` in `us-east-1` for `laise-eduardo.com` + `www.laise-eduardo.com`, DNS validation.
- `cloudflare_record` resources (Cloudflare Terraform provider) for the ACM validation CNAMEs, so `aws_acm_certificate_validation` completes in one apply.
- `aws_cloudfront_distribution` with the S3 origin, `redirect-to-https`, `index.html` root, TLS 1.2_2021, compression on, a CloudFront Function that 301s `www` → apex, custom 403/404 → `/404.html` with status 404 (not an SPA; real 404s).
- `cloudflare_record` CNAMEs: apex (CNAME flattening) and `www` → the CloudFront domain, **DNS only (proxied = false)** so CloudFront terminates TLS and no double-CDN.
- `aws_s3_bucket_policy` allowing only that distribution.
- IAM: `aws_iam_role` `laise-eduardo-com-github-actions-deploy` trusting the existing GitHub OIDC provider, `sub` scoped to `repo:LaiseEduardo@*/laise-eduardo.com@*:environment:production`. Policy: `s3:ListBucket`, `s3:PutObject`, `s3:DeleteObject` on the web bucket and `cloudfront:CreateInvalidation` on the distribution.
- State: S3 backend, bucket `laise-eduardo-com-terraform-state` (eu-west-1, versioned, `use_lockfile = true`), created once by hand before `terraform init`.
- Providers: `hashicorp/aws ~> 5`, `cloudflare/cloudflare ~> 4`. Cloudflare auth via `CLOUDFLARE_API_TOKEN` env var (Zone:DNS:Edit on laise-eduardo.com). Zone id via `data "cloudflare_zone"`.
- Terraform is applied by hand from the laptop (one environment, infrequent changes). It is not run in CI.

## Deploy (`.github/workflows/deploy.yml`)

On push to `main` (and `workflow_dispatch`), job `deploy` with
`environment: production`, `permissions: id-token: write`:

1. `aws-actions/configure-aws-credentials` assuming the deploy role.
2. `aws s3 sync site/ s3://laise-eduardo-com-web --delete` with sensible `Cache-Control`: HTML `no-cache`, assets `max-age=31536000` (assets are referenced by plain names, so this stays `max-age=3600` until fingerprinting is wanted).
3. `aws cloudfront create-invalidation --paths "/*"`.

Also `ci.yml` on pull requests: `html-validate` and a link check (`lychee`) over `site/`. No JS test suite; the page has no logic worth unit testing beyond rendering content, which `html-validate` plus a Playwright smoke test (page loads, every section id present, every link has an href) covers. Playwright smoke runs in CI against a `python -m http.server` of `site/`.

## Error handling

- Missing CV: button hidden when `content.cv` is null.
- CloudFront 403/404: `404.html` page styled like the site.
- Deploy failure: the workflow fails loudly; previous objects remain (sync happens before invalidation).

## Repository layout

```
laise-eduardo.com/
  site/            static site
  terraform/       infra
  tests/           Playwright smoke test
  .github/workflows/{ci,deploy}.yml
  docs/superpowers/{specs,plans}/
  README.md
```

GitHub: `LaiseEduardo/laise-eduardo.com`, public (it is a portfolio).

## Open items (owner: Laise)

- CV / LinkedIn content for About, Skills, Experience.
- Cloudflare API token (Zone:DNS:Edit, zone laise-eduardo.com) exported as `CLOUDFLARE_API_TOKEN` for the Terraform apply.
- LinkedIn URL and the public contact email to show.
