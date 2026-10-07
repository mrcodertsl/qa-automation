import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  use: {
    trace: 'on-first-retry',
    testIdAttribute: "data-test",
  },
  // БЕЗ множинних browser-проєктів — браузери задає browserstack.yml
});