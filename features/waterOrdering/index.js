const https = require('https')
const sgMail = require('@sendgrid/mail')

const queries = require('./queries.js')
const replies = require('./replies.js')
const { randomArrayItem } = require('../../lib')

const DEFAULT_WATER_ORDER_INTERVAL = 5 * 24 * 60 * 60 // 5 days in seconds

const generateTooMuchOrdersReplies = lastOrderTime => (
  replies.tooMuchOrdersError.map(reply => (
    reply.replace('{{lastWaterOrderCreatedAt}}', lastOrderTime)
  ))
)

sgMail.setApiKey(process.env.SENDGRID_KEY)

const setLastWaterOrderCreatedAt = async (robot) => {
  const { _controller: { storage } } = robot
  const storeItems = await storage.read(['LastWaterOrderCreatedAt'])

  storeItems.LastWaterOrderCreatedAt = { date: new Date(), eTag: '*' }
  await storage.write(storeItems)
}

const sendOrderToWaterDealer = async (robot) => {
  const message = {
    to: process.env.WATER_ORDER_RECIPIENT_EMAIL,
    toname: process.env.WATER_ORDER_RECIPIENT_NAME,
    from: process.env.WATER_ORDER_ADMIN_EMAIL,
    fromname: process.env.WATER_ORDER_ADMIN_NAME,
    cc: process.env.WATER_ORDER_ADMIN_EMAIL,
    templateId: process.env.SENDGRID_WATER_ORDER_TEMPLATE,
  }

  await sgMail.send(message)
  https.get(process.env.WATER_ORDER_SUCCESS_WEBHOOK)
  await setLastWaterOrderCreatedAt(robot)
}

const lastWaterOrderCreatedAt = async (robot) => {
  const { _controller: { storage } } = robot
  const storeItems = await storage.read(['LastWaterOrderCreatedAt'])

  return storeItems.LastWaterOrderCreatedAt
    ? new Date(storeItems.LastWaterOrderCreatedAt.date)
    : null
}

const isEnoughTimePassed = (date) => {
  const orderTimeInterval = process.env.WATER_ORDER_MIN_INTERVAL || DEFAULT_WATER_ORDER_INTERVAL

  return (new Date() - date) / 1000 > orderTimeInterval
}

const passedEnoughTimeFromLastOrder = async (robot) => {
  const lastWaterOrder = await lastWaterOrderCreatedAt(robot)

  return lastWaterOrder === null || isEnoughTimePassed(lastWaterOrder)
}

const withRespect = ({ text }) => text.toLowerCase().includes('please')

const getResponsesList = async (bot, message) => {
  const { good, sendingError, noRespect } = replies
  const passedEnoughTime = await passedEnoughTimeFromLastOrder(bot)
  const lastOrderTime = await lastWaterOrderCreatedAt(bot)

  if (!withRespect(message)) {
    return noRespect
  }

  if (passedEnoughTime) {
    try {
      await sendOrderToWaterDealer(bot)

      return good
    } catch (e) {
      return sendingError
    }
  }

  return generateTooMuchOrdersReplies(lastOrderTime)
}

module.exports = async (controller) => {
  controller.hears(
    queries,
    ['direct_mention'],
    async (bot, message) => {
      const repliesList = await getResponsesList(bot, message)
      await bot.reply(message, { text: randomArrayItem(repliesList) })
    },
  )
}
