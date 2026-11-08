import { expect, test } from "@playwright/test";

/**
 * Runs at a 375px viewport (iPhone SE width — the narrowest common real
 * device) against the production build. Each test asserts the page has no
 * unintended horizontal overflow (the mobile nav's own horizontal scroller
 * is explicitly excluded — that one scrolls on purpose) and takes a
 * full-page screenshot for visual review.
 *
 * This simulates a 375px Chromium viewport; it is not a real iOS/Android
 * device or browser engine (Safari/WebKit on iOS, Chrome on Android) — see
 * README.md for what's NEEDS ME.
 */

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, "page should not scroll horizontally at 375px").toBeLessThanOrEqual(clientWidth);
}

test("home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Monetize your creativity/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/screenshots/home-375.png", fullPage: true });
});

test("explore page", async ({ page }) => {
  await page.goto("/explore");
  await expect(page.getByRole("heading", { name: "Explore creators" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/screenshots/explore-375.png", fullPage: true });
});

test("send page", async ({ page }) => {
  await page.goto("/send");
  await expect(page.getByLabel("Stellar address")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/screenshots/send-375.png", fullPage: true });
});

test("dashboard page shows the wallet gate without a connected wallet", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Connect your wallet" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/screenshots/dashboard-375.png", fullPage: true });
});

test("history page shows the wallet gate without a connected wallet", async ({ page }) => {
  await page.goto("/history");
  await expect(page.getByRole("heading", { name: "Connect your wallet" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/screenshots/history-375.png", fullPage: true });
});

test("tip page renders without a connected wallet", async ({ page }) => {
  // This address has no registered profile on the configured contract, so
  // this also exercises the "creator not found" empty state for real.
  //
  // This hits real public Soroban testnet RPC (useProfile/useTipGoal/
  // useTipHistory each build their own client, ~9 round trips total) —
  // measured at ~17s locally, well past Playwright's 5s default assertion
  // timeout, hence the explicit override below.
  await page.goto("/tip/GA52PIZVVCRK5J2QKD26RIAZ36PNXNW3ZAZMGYNUJ2PFP2XPKCX5BKXH");
  await expect(page.getByRole("heading", { name: "Creator not found" })).toBeVisible({ timeout: 30_000 });
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: "test-results/screenshots/tip-not-found-375.png", fullPage: true });
});
