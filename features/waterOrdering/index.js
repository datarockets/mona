const https = require('https')
const sgMail = require('@sendgrid/mail')

const queries = require('./queries.js')
const replies = require('./replies.js')
const { randomArrayItem } = require('../../lib')

const DEFAULT_WATER_ORDER_INTERVAL = 5 * 24 * 60 * 60 // 5 days in seconds

const tooMuchOrdersReplies = lastOrderTime => (
  replies.tooMuchOrdersError.map(reply => (
    reply.replace('{{lastWaterOrderCreatedAt}}', lastOrderTime)
  ))
)

sgMail.setApiKey(process.env.SENDGRID_KEY)

const setLastWaterOrderCreatedAt = async (robot) => {
  const { storage } = robot._controller
  const storeItems = await storage.read(['LastWaterOrderCreatedAt'])

  storeItems.LastWaterOrderCreatedAt = { date: new Date(), eTag: '*' }
  await storage.write(storeItems)
}

const sendOrderToWaterDealer = async (robot, successCallback, errorCallback) => {
  const message = {
    to: process.env.WATER_ORDER_RECIPIENT_EMAIL,
    toname: process.env.WATER_ORDER_RECIPIENT_NAME,
    from: process.env.WATER_ORDER_ADMIN_EMAIL,
    fromname: process.env.WATER_ORDER_ADMIN_NAME,
    cc: process.env.WATER_ORDER_ADMIN_EMAIL,
    templateId: process.env.SENDGRID_WATER_ORDER_TEMPLATE,
  }

  await sgMail.send(message)
    .then(async () => {
      https.get(process.env.WATER_ORDER_SUCCESS_WEBHOOK)
      await setLastWaterOrderCreatedAt(robot)
      await successCallback()
    })
    .catch(async () => {
      await errorCallback()
    })
}

const lastWaterOrderCreatedAt = async (robot) => {
  const { storage } = robot._controller
  const storeItems = await storage.read(['LastWaterOrderCreatedAt'])

  return storeItems.LastWaterOrderCreatedAt
    ? new Date(storeItems.LastWaterOrderCreatedAt.date)
    : null
}

const passedEnoughTimeFromLastOrder = async (robot) => {
  const lastWaterOrder = await lastWaterOrderCreatedAt(robot)

  if (lastWaterOrder) {
    const currentDate = new Date()

    if ((currentDate - lastWaterOrder) / 1000
      > (process.env.WATER_ORDER_MIN_INTERVAL || DEFAULT_WATER_ORDER_INTERVAL)) {
      return (true)
    }

    return (false)
  }

  return (true)
}

module.exports = (controller) => {
  controller.hears(
    queries,
    ['direct_mention'],
    async (bot, message) => {
      const passedEnoughTime = await passedEnoughTimeFromLastOrder(bot)

      if (passedEnoughTime) {
        await sendOrderToWaterDealer(
          bot,
          async () => { await bot.reply(message, { text: randomArrayItem(replies.good) }) },
          async () => { await bot.reply(message, { text: randomArrayItem(replies.sendingError) }) },
        )
      } else {
        const lastOrderTime = await lastWaterOrderCreatedAt(bot)
        await bot.reply(message, { text: randomArrayItem(tooMuchOrdersReplies(lastOrderTime)) })
      }
    },
  )
}
