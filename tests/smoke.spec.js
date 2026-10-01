import { test, expect } from '@playwright/test';

test('home page loads with title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Laise Eduardo/);
});

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

test('no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('404 page exists and is styled', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('404');
});

test('meta description and canonical present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content', /.{40,}/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://laise-eduardo.com/');
});

test('no horizontal overflow at tablet width (768px)', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('404 page uses root-absolute asset paths so it styles at any depth', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.locator('link[rel=stylesheet][href="/styles.css"]')).toHaveCount(1);
  await expect(page.locator('link[rel=icon][href="/favicon.svg"]')).toHaveCount(1);
});

test('skill groups put the term before its description', async ({ page }) => {
  await page.goto('/');
  const firstTags = await page.locator('#skills .dim-row').evaluateAll(rows => rows.map(r => r.firstElementChild.tagName));
  for (const t of firstTags) expect(t).toBe('DT');
});

test('CV button renders exactly once when content.cv is set', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /download cv/i })).toHaveCount(1);
  const status = await page.evaluate(async () => (await fetch('/cv.pdf', { method: 'HEAD' })).status);
  expect(status).toBe(200);
});

test('section headings match the nav labels', async ({ page }) => {
  await page.goto('/');
  const heads = await page.locator('main h2').evaluateAll(hs => hs.map(h => h.firstChild.textContent.trim()));
  expect(heads).toEqual(['About', 'Skills', 'Experience', 'Projects', 'Contact']);
});

test('about stays short: at most two paragraphs under 260 characters each', async ({ page }) => {
  await page.goto('/');
  const lens = await page.locator('#about .prose p').evaluateAll(ps => ps.map(p => p.textContent.length));
  expect(lens.length).toBeLessThanOrEqual(2);
  for (const l of lens) expect(l).toBeLessThan(260);
});

test('content width is capped on very wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 2000, height: 1000 });
  await page.goto('/');
  const w = await page.locator('#hero').evaluate(el => el.getBoundingClientRect().width);
  expect(w).toBeLessThanOrEqual(1200);
});
