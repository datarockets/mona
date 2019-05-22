# mona

## Launching locally

To launch bot locally you need:

- create .env file and add secrets (use .env.sample as example)
- run `npm start`
- run `ngrok http 3000` in order to make bot visible in internet
- add url which ngrok generates for bot to [Event Subscriptions page](https://api.slack.com/apps/AJWCSQ4CU/event-subscriptions?) (example of url - `https://82f6e9d9.ngrok.io/api/messages`)

Then bot will be available in slack.

## Deployment

Deployment is run automatically after merging changes to the master branch.

Mona deployed on Heroku.
