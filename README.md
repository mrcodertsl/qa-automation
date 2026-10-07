# qa-automation

[![Playwright Tests](https://github.com/mrcodertsl/qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/mrcodertsl/qa-automation/actions/workflows/playwright.yml)

End-to-end test framework for [SauceDemo](https://www.saucedemo.com/), a demo online shop, built with [Playwright](https://playwright.dev/) and TypeScript. The suite covers login, the product list, the cart, checkout and order completion, and it runs:

- locally in Chromium, Firefox and WebKit;
- in GitHub Actions on every push and pull request to `main`;
- on BrowserStack (Windows 11 and macOS) through the BrowserStack Node SDK;

with Playwright HTML and Allure reports.

## Contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [How the framework is built](#how-the-framework-is-built)
- [Test suite](#test-suite)
- [Setup](#setup)
- [Running tests locally](#running-tests-locally)
- [Reports](#reports)
- [Running on BrowserStack](#running-on-browserstack)
- [Continuous integration](#continuous-integration)
- [Writing new tests](#writing-new-tests)
- [Troubleshooting](#troubleshooting)
- [Notes and known limitations](#notes-and-known-limitations)

## Tech stack

| Tool | Version | Role |
| --- | --- | --- |
| [@playwright/test](https://playwright.dev/docs/intro) | ^1.61 | Test runner, browser automation, assertions |
| TypeScript | ^6.0 | Language (`strict` mode) |
| [dotenv](https://github.com/motdotla/dotenv) | ^17 | Loads `.env` into `process.env` |
| [allure-playwright](https://allurereport.org/docs/playwright/) + allure-commandline | ^3.10 / ^2.43 | Allure results and report generation (the CLI is a Java application) |
| [browserstack-node-sdk](https://www.browserstack.com/docs/automate/playwright) | ^1.61 | Runs the suite on BrowserStack |
| GitHub Actions | – | CI (`.github/workflows/playwright.yml`) |

Requirements:

- Node.js 18 or newer (the project is developed with Node 26) and npm.
- A Java runtime, only for generating Allure reports.
- A BrowserStack account, only for cloud runs.

`package.json` defines no npm scripts, so every command below is run through `npx`.

## Project structure

```text
.
├── .github/workflows/playwright.yml   # CI: run the suite, upload HTML + Allure reports
├── config/
│   ├── env.ts                         # picks the environment config by ENV (test | dev)
│   ├── test.config.ts                 # baseURL https://www.saucedemo.com/  (default)
│   └── dev.config.ts                  # baseURL https://dev.saucedemo.com/  (placeholder)
├── constants/
│   ├── user.ts                        # SauceDemo usernames; passwords come from env vars
│   ├── login.constants.ts             # expected login error messages
│   ├── inventory.constants.ts         # product names, prices, add/remove button ids
│   └── checkout.constants.ts          # TAX_RATE, checkout customer data
├── pages/                             # page objects, one class per page
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   ├── checkout.page.ts
│   └── finish.page.ts
├── flows/
│   └── checkout.flow.ts               # multi-page journeys composed from page objects
├── tests/
│   ├── e2e/                           # the SauceDemo suite (20 tests)
│   │   ├── login.spec.ts
│   │   ├── inventory.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── finish.spec.ts
│   └── example.spec.ts                # Playwright's scaffold sample (visits playwright.dev)
├── log/                               # BrowserStack SDK logs (generated, see notes)
├── playwright.config.ts               # local and CI configuration
├── playwright.browserstack.config.ts  # configuration used for BrowserStack runs
├── browserstack.yml                   # BrowserStack platforms and credentials
├── tsconfig.json
└── package.json
```

Generated and ignored by git: `.env`, `playwright-report/`, `allure-results/`, `allure-report/`, `test-results/`, `blob-report/`.

## How the framework is built

```text
tests/e2e/*.spec.ts        test cases: preconditions in beforeEach, web-first assertions
   │
   ├── flows/*.flow.ts     multi-step journeys (login → add items → cart → checkout form …)
   │      │
   └──────┴── pages/*.page.ts   one class per page: actions + Locators
                  │
                  ├── constants/*       test data and data-test ids
                  └── config/env.ts     base URL for the selected environment
```

### Page objects

- One class per page, constructed with the Playwright `Page`: `constructor(private page: Page) {}`.
- Selectors are the `data-test` attributes SauceDemo renders. Each page keeps them as private string fields and resolves them with `page.getByTestId()`; `playwright.config.ts` sets `testIdAttribute: "data-test"` so `getByTestId("username")` matches `[data-test="username"]`.
- Members fall into three kinds:
  - actions: `async` methods that click, fill or navigate (`login()`, `addItemToCart()`, `goToCart()`);
  - locator getters: synchronous methods returning a `Locator`, so specs can use retrying assertions such as `await expect(page.getShoppingCartBadge()).toHaveText("1")`;
  - value readers: `async` methods that parse text into numbers (`getTax()`, `getTotalPrice()`).

```ts
// pages/inventory.page.ts (excerpt)
public async addItemToCart(itemName: string): Promise<void> {
    const addButtonId = AddItemNameLocatorPairs.get(itemName);
    if (!addButtonId) {
        throw new Error(`No add-to-cart locator mapped for item: "${itemName}"`);
    }
    await this.getInventoryItems()
        .filter({ hasText: itemName })
        .getByTestId(addButtonId)
        .click();
}
```

### Flows

`flows/checkout.flow.ts` composes the page objects into journeys that several tests need as a precondition. `CheckoutFlow` exposes its page objects as public fields, so a spec can drive the journey and then assert on any page:

- `goToCheckoutForm(user, password, items)` – log in, add the items, open the cart, press *Checkout*.
- `goToOverview(user, password, items, customer)` – the same, then fill in the customer form and press *Continue*.

### Test data and configuration

- `constants/inventory.constants.ts` maps product names to prices and to the `data-test` ids of their *Add to cart* / *Remove* buttons.
- `constants/user.ts` holds the SauceDemo usernames (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`); the passwords are read from `STANDARD_PASSWORD` and `WRONG_PASSWORD`.
- `config/env.ts` selects the base URL from the `ENV` variable: `test` (default) or `dev`; any other value throws `Unknown ENV: <value>`. `LoginPage.login()` navigates to that URL, so Playwright's `use.baseURL` is intentionally unset.
- `playwright.config.ts` loads `.env` with dotenv before anything else.

Every test starts in a fresh browser context and logs in through the UI in `beforeEach`; no storage state is shared between tests.

## Test suite

| Spec | Tests | What is verified |
| --- | --- | --- |
| `tests/e2e/login.spec.ts` | 3 | Successful login lands on the products page; a wrong password shows the error banner; `locked_out_user` stays on the login page and sees the "locked out" message |
| `tests/e2e/inventory.spec.ts` | 4 | Page title is *Products*; six products are listed; the cart badge shows 1 after adding one item and 3 after adding three |
| `tests/e2e/cart.spec.ts` | 4 | One or three added items appear in the cart; removing an item updates the list and the badge; *Continue Shopping* returns to the products page |
| `tests/e2e/checkout.spec.ts` | 8 | The checkout form is shown; *Cancel* returns to the cart; after valid customer data the overview page (`checkout-step-two`) lists the added items; subtotal equals the sum of item prices; tax equals 8 % of the subtotal; total equals subtotal + tax |
| `tests/e2e/finish.spec.ts` | 1 | *Finish* shows "Thank you for your order!" |
| `tests/example.spec.ts` | 2 | Playwright's scaffold sample against playwright.dev (not part of the SauceDemo coverage) |

22 tests per browser project; `playwright.config.ts` defines the `chromium`, `firefox` and `webkit` projects, so a full local run executes 66 tests.

## Setup

```bash
git clone https://github.com/mrcodertsl/qa-automation.git
cd qa-automation
npm ci
npx playwright install --with-deps   # Chromium, Firefox, WebKit (+ system packages on Linux)
```

Create a `.env` file in the project root (it is git-ignored):

```dotenv
STANDARD_PASSWORD=<the SauceDemo password shown on its login page>
WRONG_PASSWORD=<any incorrect password>

# only needed for BrowserStack runs
BROWSERSTACK_USERNAME=<your BrowserStack username>
BROWSERSTACK_ACCESS_KEY=<your BrowserStack access key>
```

If `STANDARD_PASSWORD` or `WRONG_PASSWORD` is missing, the framework does not fail early: the passwords become empty strings and the login tests fail on the SauceDemo page instead.

## Running tests locally

| Command | What it does |
| --- | --- |
| `npx playwright test` | Whole suite, all three browsers, headless |
| `npx playwright test --project=firefox` | One browser project (`chromium`, `firefox` or `webkit`) |
| `npx playwright test tests/e2e/login.spec.ts` | One spec file |
| `npx playwright test -g "wrong password"` | Tests whose title matches the text |
| `npx playwright test --headed` | Watch the browsers |
| `npx playwright test --ui` | Playwright UI mode |
| `npx playwright test --debug` | Step through with the Playwright Inspector |
| `npx playwright test --workers=1` | Run tests one at a time |
| `npx playwright test --trace on` | Record a trace for every test |
| `ENV=dev npx playwright test` | Use the `dev` base URL (PowerShell: `$env:ENV="dev"; npx playwright test`) |

Settings that apply locally (`playwright.config.ts`):

- `fullyParallel: true`; the worker count is Playwright's default (half of the CPU cores).
- No retries, so traces are not recorded unless `--trace on` is passed.
- The `chromium` project runs with a 1400 × 780 viewport and `slowMo: 1000`, which pauses one second after every action. Chromium runs are therefore much slower than Firefox and WebKit; remove `launchOptions.slowMo` if you do not need to watch the actions.
- Default Playwright timeouts apply: 30 s per test, 5 s per `expect`.

## Reports

### Playwright HTML report

Written to `playwright-report/` after every run and opened automatically when a test fails locally. Open the last report at any time with:

```bash
npx playwright show-report
```

Traces (recorded on the first retry in CI, or with `--trace on`) land in `test-results/` and are linked from the HTML report; open one directly with `npx playwright show-trace <path-to-trace.zip>`.

### Allure report

The `allure-playwright` reporter writes raw results to `allure-results/` on every run. Results accumulate across runs; delete the folder when you want a report of a single run.

```bash
# build a static report and open it in a browser (needs Java)
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

# or serve a temporary report straight from the results
npx allure serve allure-results
```

The report must be opened through `allure open` or `allure serve`; loading `allure-report/index.html` from disk does not work because browsers block the data files on `file://` URLs.

The tests do not use the Allure API, so the report shows Playwright's own structure: spec files, `describe` blocks, test titles and the browser project of each result.

## Running on BrowserStack

Two files describe the cloud run:

- `browserstack.yml` – credentials (`${BROWSERSTACK_USERNAME}` / `${BROWSERSTACK_ACCESS_KEY}` placeholders), project and build names, and the platforms:

  | OS | Browser |
  | --- | --- |
  | Windows 11 | `playwright-chromium`, latest |
  | OS X Ventura | `playwright-webkit`, latest |
  | Windows 11 | `playwright-firefox`, latest |

  `parallelsPerPlatform: 1` gives one session per platform (three in parallel); `browserstackLocal: false` because SauceDemo is public.
- `playwright.browserstack.config.ts` – a minimal Playwright config without browser projects; the platforms above take their place.

Run the suite, or a single spec, with the SDK and this config:

```bash
npx browserstack-node-sdk playwright test --config=playwright.browserstack.config.ts
npx browserstack-node-sdk playwright test tests/e2e/login.spec.ts --config=playwright.browserstack.config.ts
```

Each test runs once per platform. The run appears on the Automate dashboard as build `playwright-browserstack #N` (the number increments automatically) and in Test Reporting & Analytics; the SDK prints both links at the end.

Things to know:

- The SDK reads `.env` and expands the `${...}` placeholders in `browserstack.yml`. If it reports missing credentials, export `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in the shell before running.
- Do not pass `--project=...` together with the BrowserStack config: it defines no projects, so nothing would run.
- `browserName` in `browserstack.yml` must be one of `chrome`, `edge`, `playwright-chromium`, `playwright-webkit`, `playwright-firefox`.
- The BrowserStack config declares no reporter, so these runs use Playwright's default terminal output and produce no HTML or Allure report; results live on the BrowserStack dashboard.
- The SDK writes its logs to `log/` (`sdk-cli.log`, `usage.log`, `events.json`, `performance-report/`). They include every test step with the values typed into forms, including passwords.
- So far the BrowserStack setup has been exercised with `tests/e2e/login.spec.ts` only; the last recorded run passed on all three platforms.

## Continuous integration

`.github/workflows/playwright.yml` runs on every push and pull request to `main` (or `master`), on `ubuntu-latest` with the current Node LTS:

1. `npm ci`
2. `npx playwright install --with-deps`
3. `npx playwright test` with `STANDARD_PASSWORD` and `WRONG_PASSWORD` taken from repository secrets
4. upload `playwright-report/` as the `playwright-report` artifact
5. `npx allure generate allure-results --clean -o allure-report` (the Ubuntu runner ships with Java)
6. upload `allure-report/` as the `allure-report` artifact

Artifacts are kept for 30 days and are uploaded even when tests fail; the job times out after 60 minutes. To view a downloaded artifact, run `npx playwright show-report <folder>` for the HTML report or `npx allure open <folder>` for the Allure report.

Because GitHub sets `CI=true`, `playwright.config.ts` switches to CI behaviour: `test.only` fails the build, every failed test is retried twice, a trace is recorded on the first retry, and tests run with a single worker. All three browser projects run, including the slowed-down Chromium project, so a CI run takes considerably longer than a local one.

Required repository secrets: `STANDARD_PASSWORD`, `WRONG_PASSWORD`. Pull requests from forks do not receive secrets, so their login tests fail. BrowserStack runs are not part of CI.

## Writing new tests

1. **Page object** – add `pages/<name>.page.ts` with one class, `data-test` ids as private fields, action methods and `Locator` getters. Keep assertions out of page objects.
2. **Test data** – put names, prices, messages and ids into `constants/`, never inline in specs. Secrets are read from `process.env`.
3. **Flow** – if several tests need the same multi-page precondition, add a method to `flows/checkout.flow.ts` or create a new flow class.
4. **Spec** – add `tests/e2e/<name>.spec.ts`; create page objects in `beforeEach`, use web-first assertions (`await expect(locator).toHaveText(...)`) rather than reading text and comparing it.

```ts
// pages/menu.page.ts
import { Locator, Page } from "@playwright/test";

export class MenuPage {
    private openMenuBtn = "open-menu";
    private logoutLink = "logout-sidebar-link";

    constructor(private page: Page) {}

    public async logout(): Promise<void> {
        await this.page.getByTestId(this.openMenuBtn).click();
        await this.page.getByTestId(this.logoutLink).click();
    }

    public getLoginButton(): Locator {
        return this.page.getByTestId("login-button");
    }
}

// tests/e2e/menu.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { MenuPage } from "../../pages/menu.page";
import { Passwords, Usernames } from "../../constants/user";

test("logout returns to the login page", async ({ page }) => {
    await new LoginPage(page).login(Usernames.STANDARD, Passwords.STANDARD_PASSWORD);
    const menu = new MenuPage(page);

    await menu.logout();
    await expect(menu.getLoginButton()).toBeVisible();
});
```

Type-check the project with `npx tsc --noEmit`. Playwright compiles the TypeScript tests itself, so `tsconfig.json` mainly serves the editor and this check.

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Login tests fail with a SauceDemo error about the password | `.env` is missing or incomplete; see [Setup](#setup) |
| `Error: Unknown ENV: ...` while loading tests | `ENV` must be `test` or `dev` |
| `browserType.launch: Executable doesn't exist` | Run `npx playwright install --with-deps` |
| `allure` fails to start or complains about Java | Install a Java runtime; `allure-commandline` is a Java application |
| Allure report shows old or duplicated results | Delete `allure-results/` before the run |
| BrowserStack run executes no tests | Remove `--project=...`; the BrowserStack config has no projects |
| BrowserStack: `Invalid 'browser'` | Use a supported `browserName` in `browserstack.yml` (see above) |
| Chromium runs are very slow | `slowMo: 1000` in the `chromium` project of `playwright.config.ts` |

## Notes and known limitations

- `tests/example.spec.ts` is the sample generated by `npm init playwright`; it visits playwright.dev and runs with the rest of the suite. Delete it or point `testDir` at `tests/e2e` if you only want the SauceDemo tests.
- `config/dev.config.ts` points to `https://dev.saucedemo.com/`, a placeholder; set a real URL before using `ENV=dev`.
- In `checkout.spec.ts`, the test titled "check error appears on continue action with empty user data form" currently asserts the item list of the overview page (the same check as the following test); the empty-form validation is not covered yet.
- Not covered yet: product sorting and product details, the burger menu and logout, checkout form validation errors, the `problem_user` and `performance_glitch_user` accounts.
- Playwright reports, Allure results and the BrowserStack SDK logs record the values typed into forms. The SauceDemo credentials are public demo data, but keep this in mind before publishing reports or committing `log/` if you ever test with real credentials.
