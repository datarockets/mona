//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the mona bot.

const path = require('path')
const { Botkit } = require('botkit')
const { BotkitCMSHelper } = require('botkit-plugin-cms')
const { MongoDbStorage } = require('botbuilder-storage-mongodb')
const { removeCodeFromMessage } = require('./lib/middleware')
const adapter = require('./adapter')

require('dotenv').config()

let storage = null

if (process.env.MONGO_URI) {
  storage = new MongoDbStorage({
    url: process.env.MONGO_URI,
    database: process.env.MONGO_DB_NAME,
  })
}

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
  controller.loadModules(path.join(__dirname, 'features'))

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
