//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the mona bot.

// Import Botkit's core features
const { Botkit } = require('botkit')
const { BotkitCMSHelper } = require('botkit-plugin-cms')

// Import a platform-specific adapter for slack.

const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack')

const { MongoDbStorage } = require('botbuilder-storage-mongodb')

// Load process.env values from .env file
require('dotenv').config()

const { removeCodeFromMessage } = require('./lib/middleware')

let storage = null

if (process.env.MONGO_URI) {
  storage = new MongoDbStorage({
    url: process.env.MONGO_URI,
    database: process.env.MONGO_DB_NAME,
  })
}

let tokenCache = {}
let userCache = {}

if (process.env.TOKENS) {
  tokenCache = JSON.parse(process.env.TOKENS)
}

if (process.env.USERS) {
  userCache = JSON.parse(process.env.USERS)
}

async function getTokenForTeam(teamId) {
  if (tokenCache[teamId]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tokenCache[teamId])
      }, 150)
    })
  }

  return console.error('Team not found in tokenCache: ', teamId) // eslint-disable-line no-console
}

async function getBotUserByTeam(teamId) {
  if (userCache[teamId]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userCache[teamId])
      }, 150)
    })
  }

  return console.error('Team not found in userCache: ', teamId) // eslint-disable-line no-console
}

const adapter = new SlackAdapter({
  // parameters used to secure webhook endpoint
  verificationToken: process.env.verificationToken,
  clientSigningSecret: process.env.clientSigningSecret,

  // auth token for a single-team app
  botToken: process.env.botToken,

  // credentials used to set up oauth for multi-team apps
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['bot'],
  redirectUri: process.env.redirectUri,

  // functions required for retrieving team-specific info
  // for use in multi-team apps
  getTokenForTeam,
  getBotUserByTeam,
})

// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware())

// Use SlackMessageType middleware to further classify messages
// as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware())

const controller = new Botkit({
  debug: true,
  webhook_uri: '/api/messages',
  adapter,
  storage,
})

if (process.env.cms_uri) {
  controller.usePlugin(new BotkitCMSHelper({
    cms_uri: process.env.cms_uri,
    token: process.env.cms_token,
  }))
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
  // load traditional developer-created local custom feature modules
  controller.loadModules(`${__dirname}/features`)

  /* catch-all that uses the CMS to trigger dialogs */
  if (controller.plugins.cms) {
    controller.on('message,direct_message', async (bot, message) => {
      let results = false
      results = await controller.plugins.cms.testTrigger(bot, message)

      if (results !== false) {
        // do not continue middleware!
        return false
      }

      return null
    })
  }
})

controller.webserver.get('/install', (req, res) => {
  // getInstallLink points to slack's oauth endpoint and includes clientId and scopes
  res.redirect(controller.adapter.getInstallLink())
})

controller.webserver.get('/install/auth', async (req, res) => {
  try {
    const results = await controller.adapter.validateOauthCode(req.query.code)

    console.log('FULL OAUTH DETAILS', results) // eslint-disable-line no-console

    // Store token by team in bot state.
    tokenCache[results.team_id] = results.bot.bot_access_token

    // Capture team to bot id
    userCache[results.team_id] = results.bot.bot_user_id

    res.json('Success! Bot installed.')
  } catch (err) {
    console.error('OAUTH ERROR:', err) // eslint-disable-line no-console
    res.status(401)
    res.send(err.message)
  }
})

controller.middleware.ingest.use(removeCodeFromMessage)
