const { defineConfig } = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1000,
  viewportHeight: 1000,
  fixturesFolder: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'test-results/cypress/junit-[hash].xml'
  },
  retries: {
    runMode: 3
  },
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
    experimentalSessionAndOrigin: true
  },
  env: {
    USER_EMAIL: 'admin@alimansari.com',
    USER_PASSWORD: 'rH$x4zV5a6x3y2h'
  }
});
