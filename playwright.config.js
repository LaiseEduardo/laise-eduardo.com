import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.js/,
  use: { baseURL: 'http://localhost:4817' },
  webServer: { command: 'python3 -m http.server 4817 -d site', port: 4817, reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 360, height: 740 } } },
  ],
});
