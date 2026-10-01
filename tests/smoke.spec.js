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
