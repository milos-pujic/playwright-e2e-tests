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

- Open the Playwright UI to execute test cases against default environnement: `npx playwright test --ui`
- Execute all test cases without opening the Playwright UI against default environnement: `npx playwright test`
- Environnement variables:
  - `ENV`, which can have value `prod` / `local` / `docker` / `kube` / `kubeLocal` , depending on which environnement you would like to execute your tests (if not defined, `prod` will be used by default)
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

- `ENV=local npx playwright test --ui` - Open Playwright UI to execute tests against Local environnement
- `ENV=prod npx playwright test` - Execute All tests without opening the Playwright UI against Production environnement in all setup projects (browsers)
- `ENV=local npx playwright test tests/admin-panel/login.spec.ts` - Execute Login tests without opening the Playwright UI on Local environnement in all setup projects (browsers)
- `ENV=prod npx playwright test --grep "@booking|@contact"` - Execute tests tagged with `@booking` or `@contact`, without opening the Playwright UI on Production environnement in all setup projects (browsers)
- `ENV=prod npx playwright test --grep-invert "@room-management" --project chromium` - Execute tests not tagged with `@room-management`, without opening the Playwright UI on Production environnement only on `chromium` project (browser)

## Local Docker Environment with Docker for Desktop

>Before you proceed, you should install Docker Desktop depending on your OS and start it:
>
>- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
>- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
>
>As Docker for Desktop is **paid** software now, instead of it you can setup and start minikube using bellow guides:
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

>Before you proceed, you should setup and start minikube using bellow guides:
>
>- [Minikube Setup for Windows](/docs/minikube-setup-windows.md)
>- [Minikube Setup for Mac](/docs/minikube-setup-mac.md)

After minikube has been properly installed and started on your machine, open the terminal inside `<local_path>\playwright-e2e-tests` and use the following command:

    kubectl apply -f .kube/restful-booker-platform.yml 

That will start Restful Booker Platform locally.

After everything is up and running you will have Restful Booker Platform available at `http://kube.local`.

## Execute Playwright E2E Tests using Github Actions Workflows on GitHub

All Github Actions Workflows are configured in [**GitHub Folder**](/.github/workflows/) yaml files.

They all can be found by navigating to [GitHub Repository > Actions](https://github.com/milos-pujic/playwright-e2e-tests/actions).

![GitHub Actions Workflows](/docs/imgs/GitHub-Actions.png)

There are 2 GitHub Actions Workflows setup for Playwright E2E Tests repository:

- [Playwright Tests](https://github.com/milos-pujic/playwright-e2e-tests/actions/workflows/playwright.yml)
- [Sanity Check](https://github.com/milos-pujic/playwright-e2e-tests/actions/workflows/sanity-check.yml)

### Playwright Tests

This GitHub Action Workflow Executes All Playwright E2E Tests on `local` environnement using `chromium`, `firefox` and `webkit` browsers from defined branch (by default it is `main`).
Environnement `local` means that, Restful Booker Platform will be started inside GitHub Services and tests will run against it.

GitHub Action Workflow configuration file of this workflow is [playwright.yml](/.github/workflows/playwright.yml).

This workflow is only triggered Manually. Steps to trigger it:

1. Open [Playwright Tests](https://github.com/milos-pujic/playwright-e2e-tests/actions/workflows/playwright.yml)
2. Click on `Run workflow` button
    - (which opens sub-modal where `Branch` can be selected, `main` selected by default)
3. Select `Branch`
4. Click on `Run workflow` button

![Playwright Tests](/docs/imgs/Playwright-Tests.png)

Also, on [Playwright Tests](https://github.com/milos-pujic/playwright-e2e-tests/actions/workflows/playwright.yml) page, status of all on-going and previously executed 'Playwright Tests' Workflow runs can be found.

Latest Test reports, with trends history, Playwright Tests GitHub Action Workflow can be found [here](https://milos-pujic.github.io/playwright-e2e-tests/).

![Playwright Tests Reports](/docs/imgs/Playwright-Tests-Reports.png)

There are 3 types of reports:

1. Regular Playwright HTML Reports, without trend history
2. Monocart Report, with trend history
3. Allure Report, with trend history

### Sanity Check

This GitHub Action Workflow Executes `@sanity` tagged tests of Playwright E2E Tests on `local` environnement using `chromium`, `firefox` and `webkit` browsers from `main` or Pull Request source branch.

GitHub Action Workflow configuration file of this workflow is [sanity-check.yaml](/.github/workflows/sanity-check.yaml).

This workflow is only triggered automatically on specific events:

- Merge Events on `main` branch
- Create / Update GitHub Pull Request Events

Also, on [Sanity Check](https://github.com/milos-pujic/playwright-e2e-tests/actions/workflows/sanity-check.yml) page, status of all on-going and previously executed 'Sanity Check' Workflow runs can be found.

This workflow doesn't produce reports like Playwright Tests Workflow, and its status and results can be checked inside GitHub Action Job Summary.
