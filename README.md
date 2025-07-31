# LeTip

A tip calculator with value conversion. Made with Vue.js 3 + TS.

## Project Setup

First of all, you may put create an `.env` file on the root folder of this project, based on the `.env.example`.

To get an API Key, you shall create an account on [SWOP API](https://swop.cx/) and validate your email before using the application.

Setting up the API Key, you can proceed with the commands below:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

```sh
# When using CI, the project must be built first.
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chrome
npm run test:e2e -- --env chrome
# Runs the tests of a specific file
npm run test:e2e -- tests/e2e/example.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
