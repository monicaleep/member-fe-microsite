# member-fe-microsite
Microsite for Member FE Conference July 2024

## Local Development

After pulling this repo down, run `npm install` to install package dependencies.  To run the application locally, run `npm run start` which will run `server.js` in watch mode; any changes to imported javascript files will restart the process. Note that changes to `html` files will not trigger a restart and you will have to restart the process manually.

## Templates and Partials

Any `.html` file in the `templates` and `partials` folder will be picked up by the application and registered with handlebars.
