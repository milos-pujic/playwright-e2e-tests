# Playwright E2E Testing Framework

Playwright E2E Testing Framework project represents a starting point for writing tests in Playwright.

Provided tests are based on examples how to define and use utility functions, explicit wait for some element, usage of **faker** for generating random data and possible solutions for organizing tests using Page Object pattern.

## IDE Setup

- Install [Visual Studio Code](https://code.visualstudio.com/download)
  - _Recommended extensions in Visual Studio Code:_
    - [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
    - [ESLint](<https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>)
    - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    - [Local History](https://marketplace.visualstudio.com/items?itemName=xyz.local-history)
    - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
    - [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- Install [Node JS](https://nodejs.org/en/download/)
- Clone the repository to your local system
- Open the project in Visual Studio Code and open the terminal
  - Make sure the path to the project is correct `<local_path>\playwright-e2e-tests`
- In the terminal, execute the following command: ```npm install```
  - The command will install all found in the package.json

## Used Libraries

- [Playwright](https://github.com/microsoft/playwright)
- [Monocart Reporter](https://github.com/cenfun/monocart-reporter)
- [Allure Reporter](https://github.com/allure-framework/allure-js)
- [Faker JS](https://github.com/faker-js/faker)
- [Prettier](https://prettier.io/)
- [ESLint](https://github.com/eslint/eslint)
- [Husky](https://typicode.github.io/husky/#/)
- [Lint Staged](https://github.com/okonet/lint-staged)

## Launch Playwright and Execute Test Cases

Open the terminal inside `<local_path>\playwright-e2e-tests` and use the following commands to:

- Open the Playwright UI to execute test cases against default environment: `npx playwright test --ui`
- Execute all test cases without opening the Playwright UI against default environment: `npx playwright test`
- Environment variables:
  - `ENV`, which can have value `prod` / `local` / `docker` / `kube` / `kubeLocal` , depending on which environment you would like to execute your tests (if not defined, `prod` will be used by default)
    - `prod` uses `https://automationintesting.online` as app URL
    - `local` uses `http://localhost` as app URL
    - `kubeLocal` uses `http://kube.local` as app URL
    - `docker` uses `http://rbp-proxy` as app URL
    - `kube` uses `http://rbp-proxy.restful-booker-platform` as app URL
- Test filtering using Tags:
  - If not set all tests will be executed. Filtering tests using Tags is done with `--grep` and `--grep-invert` command line flags
    - `npx playwright test --grep "@sanity"` - Tests tagged with `@sanity` will be filtered
    - `npx playwright test --grep-invert "@room-management"` - Tests that are not tagged with `@room-management` will be filtered
    - `npx playwright test --grep "(?=.*@management)(?=.*@room-management)"` - Tests tagged with both `@management` and `@room-management` will be filtered
    - `npx playwright test --grep "@booking|@contact"` - Tests tagged with either `@booking` or `@contact` will be filtered

Example of above commands with possible variables:

- `ENV=local npx playwright test --ui` - Open Playwright UI to execute tests against Local environment
- `ENV=prod npx playwright test` - Execute All tests without opening the Playwright UI against Production environment in all setup projects (browsers)
- `ENV=local npx playwright test tests/admin-panel/login.spec.ts` - Execute Login tests without opening the Playwright UI on Local environment in all setup projects (browsers)
- `ENV=prod npx playwright test --grep "@booking|@contact"` - Execute tests tagged with `@booking` or `@contact`, without opening the Playwright UI on Production environment in all setup projects (browsers)
- `ENV=prod npx playwright test --grep-invert "@room-management" --project chromium` - Execute tests not tagged with `@room-management`, without opening the Playwright UI on Production environment only on `chromium` project (browser)

## Local Docker Environment with Docker for Desktop

> Before you proceed, you should install Docker Desktop depending on your OS and start it:
>
>- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
>- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
>
> As Docker for Desktop is **paid** software now, instead of it you can set up and start minikube using bellow guides:
>
>- [Minikube Setup for Windows](/docs/minikube-setup-windows.md)
>- [Minikube Setup for Mac](/docs/minikube-setup-mac.md)

After Docker has been installed on your machine, open the terminal inside `<local_path>\playwright-e2e-tests` and use the following command:

    docker compose -f ./docker-compose-restful-booker.yml up -d 

That will start Restful Booker Platform locally.

After everything is up and running you will have Restful Booker Platform available at:

- Docker for Desktop: `http://localhost`
- minikube: `http://kube.local`

## Local Kubernetes Environment with Minikube's Kubernetes

> Before you proceed, you should set up and start minikube using bellow guides:
>
>- [Minikube Setup for Windows](/docs/minikube-setup-windows.md)
>- [Minikube Setup for Mac](/docs/minikube-setup-mac.md)

After minikube has been properly installed and started on your machine, open the terminal inside `<local_path>\playwright-e2e-tests` and use the following command:

    kubectl apply -f .kube/restful-booker-platform.yml 

That will start Restful Booker Platform locally.

After everything is up and running you will have Restful Booker Platform available at `http://kube.local`.

## Execute Playwright E2E Tests using GitHub Actions Workflows on GitHub

All GitHub Actions Workflows are configured in [**GitHub Folder**](/.github/workflows) yml files.

They all can be found by navigating to [GitHub Repository > Actions](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions).

There are 3 GitHub Actions Workflows setup for Playwright E2E Tests repository:

- [Playwright Tests](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions/workflows/playwright.yml)
- [Check - Sanity Test](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions/workflows/check-sanity.yml)
- [Check - Changed Test](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions/workflows/check-changed.yml)

---

### Playwright Tests  

This workflow is designed to run comprehensive automated tests using Playwright across multiple browsers. It Executes All Playwright E2E Tests on `local` environment using `chromium`, `firefox` and `webkit` browsers from defined branch (by default it is `main`). It includes parallel test execution, detailed reporting, and scheduled runs to maintain the reliability.  

Status of all ongoing and previously executed `Playwright Tests` Workflow runs can be found [here](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions/workflows/playwright.yml).

GitHub Action Workflow configuration file of this workflow is [playwright.yml](/.github/workflows/playwright.yml).

#### Playwright Tests: Key Features  

- **Trigger Events**:  
  - Manually triggered via `workflow_dispatch`.  
  - Automatically scheduled to run every Monday at 9:00 AM (UTC).  

- **Setup and Dependencies**:  
  - Installs Node.js and caches Node modules for faster execution.  
  - Prepares Playwright binaries and their system dependencies.  
  - Validates the codebase with TypeScript type checks.  

- **Test Execution**:  
  - Executes tests for `chromium`, `firefox`, and `webkit` browsers.  
  - Implements test sharding to run tests concurrently, improving efficiency.  

- **Test Environment**:
  - Deploys multiple Docker-based microservices to emulate the testing environment, ensuring tests run against a realistic backend setup.

- **Reporting**:  
  - Generates multiple types of test reports, including HTML, Monocart, and Allure.  
  - Merges test results and publishes them to GitHub Pages for easy access.  

#### Playwright Tests: Workflow Overview  

- **Install Job**  
  - Sets up the environment, installs dependencies, and validates the codebase with type checks.  
- **Test Job**  
  - Executes Playwright tests in parallel across browsers and shards.  
  - Deploys Docker services to replicate the application environment.  
  - Uploads reports and test results as artifacts for post-test analysis.  
- **Report Job**  
  - Consolidates and merges test reports from parallel runs.  
  - Generates Playwright HTML, Monocart, and Allure reports.  
  - Publishes the reports to GitHub Pages for easy sharing and review.  
  - Cleans up unnecessary artifacts to optimize storage usage.  

#### Playwright Tests: Usage

To trigger the workflow:

- **Manual Run:** Go to the [Actions](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions) tab in your GitHub repository, select the [Playwright Tests](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions/workflows/playwright.yml) workflow, and click `Run workflow`.
  - :warning: This GitHub Actions publishes report on GitHub pages and because of that it can **ONLY** be executed on **main** branch. :warning:
- **Scheduled Run:** The workflow automatically runs every Monday at 9:00 AM UTC.

#### Playwright Tests: Reports

- **Playwright HTML Report:** Test report without execution history and trends.
- **Monocart Report:** Test report with execution history and trends..
- **Allure Report:** Test report with execution history and trends.

Access the reports via the GitHub Pages link provided in the workflow logs after execution, or click [here](https://m-pujic-levi9-com.github.io/playwright-e2e-tests/).

---

### Check - Sanity Tests

This GitHub Action ensures that essential functionality remains intact. It runs `@sanity` tagged tests on `local` environment using `chromium`, `firefox` and `webkit` browsers. It is triggered automatically on changes to specified parts of the repository or during pull requests targeting the `main` branch.

Status of all ongoing and previously executed `Check - Sanity Tests` Workflow runs can be found [here](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions/workflows/check-sanity.yml).

GitHub Action Workflow configuration file of this workflow is [check-sanity.yml](/.github/workflows/check-sanity.yml).

#### Check - Sanity Tests: Key Features

- **Trigger Events**:
  The workflow executes on:
  - Push events to the `main` branch, specifically when changes occur in:
    - Directories: `apis/`, `pages/`, `tests/`, `utils/`
    - Workflow file: `.github/workflows/sanity-check.yml`
    - Configuration files: `playwright.config.ts`, `package-lock.json`, `package.json`
  - Pull request events targeting the `main` branch:
    - Opened  
    - Reopened  
    - Synchronized  
    - Labeled  

- **Setup and Dependencies**:
  - Installs Node.js and caches Node modules for faster subsequent runs.
  - Installs and caches Playwright binaries, along with their system dependencies.
  - Runs TypeScript type checks to validate code integrity.

- **Test Environment**:
  - Deploys multiple Docker-based microservices to emulate the testing environment, ensuring tests run against a realistic backend setup.

- **Test Execution**:
  - Leverages Playwright to execute tests marked with the `@sanity` tag.
  - Ensures essential application flows are thoroughly verified.

- **Reports**:
  - Automatically generates and uploads an HTML report for the sanity test results, accessible via workflow artifacts.

#### Check - Sanity Tests: Workflow Overview  

- **Install Job**  
  - Sets up the environment, installs dependencies, and ensures readiness for testing.
  - Verifies code correctness with TypeScript type checks.
- **Test Job**  
  - Deploys test environment by initializing a set of microservices using Docker.
  - Executes sanity tests using Playwright.
  - Uploads a detailed HTML test report.

---

### Check - Changed Tests

This GitHub Action is designed to streamline the testing process for pull requests. It identifies only the tests affected by the introduced changes and executes them on `local` environment using `chromium`, `firefox` and `webkit` browsers. It is triggered automatically during pull requests targeting the `main` branch.

Status of all ongoing and previously executed `Check - Changed Tests` Workflow runs can be found [here](https://github.com/m-pujic-levi9-com/playwright-e2e-tests/actions/workflows/check-changes.yml).

GitHub Action Workflow configuration file of this workflow is [check-changes.yml](/.github/workflows/check-changes.yml).

#### Check - Changed Tests: Key Features  

- **Trigger Events**:
  Automatically runs when a pull request targeting the `main` branch is:
  - Opened  
  - Reopened  
  - Synchronized  
  - Labeled  

- **Setup and Dependencies**:
  - Performs a full repository checkout for accurate diff comparisons.
  - Sets up Node.js and caches Node modules to speed up subsequent runs.
  - Installs and caches Playwright binaries, along with their system dependencies.
  - Runs TypeScript type checks to validate code integrity.

- **Test Environment**:
  - Deploys multiple Docker-based microservices to emulate the testing environment, ensuring tests run against a realistic backend setup.

- **Test Execution**:
  - Leverages Playwright's `--only-changed` option to execute only the tests impacted by code changes, improving feedback time and reducing resource usage.

- **Reports**:
  - Automatically generates and uploads an HTML report for Playwright test results, which can be accessed and reviewed directly from the workflow artifacts.

#### Check - Changed Tests: Workflow Overview  

- **Install Job**
  - Sets up the environment, installs dependencies, and ensures everything is ready for test execution.
  - Runs TypeScript type checks to ensure code validity.

- **Test Job**
  - Deploys test environment by initializing a set of microservices using Docker.
  - Executes Playwright Tests for the affected files.
  - Uploads a detailed HTML test report.
