# member-fe-microsite

Microsite for Member FE Conference July 2024

## Local Development

After pulling this repo down, run `npm install` to install package dependencies. To run the application locally, run `npm run start` which will run `server.js` in watch mode; any changes to imported javascript files will restart the process. Note that changes to `html` files will not trigger a restart and you will have to restart the process manually.

## Templates and Partials

Any `.html` file in the `templates` and `partials` folder will be picked up by the application and registered with handlebars.

## Running Tests

This project uses `Cypress` to run our test suite.

To run tests in Cypress's head mode:

- run `npm run start` to start the local web server`. If you want to run the webserver in watch mode (great for test/cypress rdriven development), run `npm run start:watch` instead
- in a separate terminal, run `npm run cypress:open`. This will automatically open the Cypress GUI.
- select `e2e tests` in the first page and select a test to run the test

To run tests in Cypress's headless mode:

- follow the first step above to start a local webserver
- in a separate terminal, run `npm run cypress:run`. Cypress will output the test results in your terminal, then exit
