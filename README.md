# Sauce Demo E2E Automation Framework

Playwright + TypeScript E2E suite for [sauce-demo.myshopify.com](https://sauce-demo.myshopify.com/), a real (public) Shopify storefront.

## Stack

- **Playwright Test** + **TypeScript**, Page Object Model + typed fixtures
- Cross-browser: Chromium, Firefox, WebKit
- Reporting: Playwright HTML report + Allure
- CI: GitHub Actions (`.github/workflows/e2e.yml`), matrix across browsers

## Getting started

```bash
npm install
npx playwright install --with-deps
cp .env.example .env   # optional, defaults to the live store
```

## Running tests

```bash
npm test                 # full suite, all 3 browsers
npm run test:smoke       # @smoke-tagged tests only
npm run test:chromium    # single browser
npm run test:headed      # headed, for visual debugging
npm run test:ui          # Playwright UI mode
```

## Reports

```bash
npm run report:html      # Playwright HTML report
npm run report:allure    # Allure report (generates + opens)
```

## Project layout

```
src/
  pages/        Page Object Model (one class per page)
  components/   Shared widgets composed into pages (site header/nav)
  fixtures/     Playwright test fixtures + test-data factories
  utils/        Env config, semantic wait helpers
  types/        Shared TS interfaces
tests/
  smoke/        @smoke tagged sanity checks
  catalog/      Browsing, product detail, search
  cart/         Add/update/remove, order notes
  checkout/     Cart → real Shopify checkout handoff (no payment/PII submitted)
  account/      @account tagged: real registration/login against the live store
  journey/      @account @journey: signup → login → add to cart → checkout → nav browsing, chained in one flow
```

## Known constraints of this target

**Sauce Demo is Cloudflare-protected.** Cloudflare's bot management occasionally
serves a "Verify you are human" challenge to automated browsers (Playwright,
Selenium, Puppeteer, etc.), independent of IP reputation — a plain `curl` from
the same network passes with `200`, while a Playwright-driven Chromium can get
challenged, including in headed, single-worker runs. This is an inherent
property of the target site's bot protection, not a defect in this framework:

- A red run in CI or locally may mean Cloudflare challenged the runner, not a
  real regression — re-run before treating it as a bug.
- This framework will **never** attempt to solve or bypass that challenge
  (no CAPTCHA-solving, no stealth/anti-detection plugins). If CI flakiness from
  this becomes a persistent problem, the durable fixes are outside the test
  code: asking the store owner to allowlist CI IP ranges, running from a
  self-hosted runner with a trusted IP, or pointing the suite at a
  Cloudflare-free staging environment.

**Registration and login are hCaptcha-protected, and currently do not submit
under Playwright at all.** Both `/account/register` and `/account/login` load
an invisible hCaptcha widget. Confirmed via network inspection: a Playwright
click on "Create" or "Sign In" never fires the underlying `POST` — hCaptcha's
challenge never resolves for a Chrome-DevTools-Protocol-driven browser, so the
page's JS submit handler silently never proceeds (no error, no navigation, no
console message). This reproduced consistently, not intermittently, across
runs. Verified as a hard block, not a bug in the page objects — the same
inputs submitted through a non-CDP browsing session (used to explore this
site) go through and create/authenticate a real account. Per policy, this
framework will **not** attempt to solve or route around hCaptcha in any way.
Practically: `tests/account/*.spec.ts` and the signup/login steps in
`tests/journey/full-purchase-journey.spec.ts` are correct and ready to run,
but expect them to hang/fail on this target until hCaptcha is disabled or
allowlisted for your test traffic by whoever administers the store — the same
kind of fix as the Cloudflare constraint above, not a code fix.

**`@account` specs mutate real store data.** `tests/account/*.spec.ts` register
real disposable customer accounts (unique, timestamped emails via
`buildDisposableUser()`) against the live store. There's no sandbox mode for
this Shopify instance — treat these specs as intentionally creating live data.

**Checkout tests stop short of payment.** `tests/checkout/checkout-flow.spec.ts`
verifies the cart hands off to Shopify's real checkout URL
(`/checkouts/cn/...`) and stops there — no payment or personal information is
ever submitted.

## CI

`.github/workflows/e2e.yml` runs on push/PR to `main` and on demand
(`workflow_dispatch`), matrixed across the three browser projects. Each job
uploads its Playwright HTML report and Allure results as artifacts; a final
job merges all Allure results into one report artifact.
