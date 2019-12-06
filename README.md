# mona

## Launching locally

To launch bot locally you need:

- create .env file and add secrets (use .env.sample as example)
- run `npm start`
- run `ngrok http 3000` in order to make bot visible in internet
- Create your own Slack app [here](https://api.slack.com/apps)
- add url which ngrok generates for bot to [Event Subscriptions page](https://api.slack.com/apps/AJWCSQ4CU/event-subscriptions?) (example of url - `https://82f6e9d9.ngrok.io/api/messages`)

Then bot will be available in slack.

## dotenv configuration

- __clientSigningSecret__: Use `Signing Secret` from the `App Credentials` section on your Slack `Basic Information` app page
- __botToken__: Use `Bot User OAuth Access Token` from the `Tokens for Your Workspace` section on your Slack `OAuth & Permissions` app page

## Deployment

Deployment is run automatically after merging changes to the master branch.

Mona deployed on Heroku.

## Testing

We're using `mocha` with [botkit-mock](https://github.com/gratifyguy/botkit-mock) for testing.

In order to run all specs, execute command bellow in the project's root folder:

```
./bin/mocha specs
```
