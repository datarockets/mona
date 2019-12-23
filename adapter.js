require('dotenv').config()
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack')
const { tokenCache, userCache } = require('./cache')

const getTokenForTeam = async (teamId) => {
  if (tokenCache[teamId]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tokenCache[teamId])
      }, 150)
    })
  }

  return console.error('Team not found in tokenCache: ', teamId) // eslint-disable-line no-console
}

const getBotUserByTeam = async (teamId) => {
  if (userCache[teamId]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userCache[teamId])
      }, 150)
    })
  }

  return console.error('Team not found in userCache: ', teamId) // eslint-disable-line no-console
}

const {
  verificationToken,
  clientSigningSecret,
  botToken,
  clientId,
  clientSecret,
  redirectUri,
} = process.env

const adapter = new SlackAdapter({
  verificationToken,
  clientSigningSecret,
  botToken,
  clientId,
  clientSecret,
  scopes: ['bot'],
  redirectUri,
  getTokenForTeam,
  getBotUserByTeam,
})

adapter.use(new SlackEventMiddleware())
adapter.use(new SlackMessageTypeMiddleware())

module.exports = adapter
