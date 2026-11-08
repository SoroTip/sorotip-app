import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against the already-built, already-running production server (see
 * the "webServer" block) at a 375px-wide viewport — iPhone SE/8 width, the
 * narrowest common real device size — to catch responsive layout breakage.
 * Real iOS/Android device checks remain NEEDS ME; this only simulates a
 * 375px Chromium viewport, not a real mobile browser engine.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    viewport: { width: 375, height: 812 },
  },
  projects: [
    {
      name: "mobile-375",
      // Chromium specifically, not devices["iPhone SE"]'s default WebKit:
      // only Chromium's browser binary is installed here. This simulates a
      // 375px Chromium viewport with touch/mobile UA hints, not a real
      // WebKit (iOS Safari) engine — see the NEEDS ME note in README.md.
      use: {
        ...devices["Desktop Chrome"],
        ...devices["iPhone SE"],
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
      },
    },
  ],
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
