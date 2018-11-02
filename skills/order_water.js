const _sample = require('lodash/sample')

const DEFAULT_WATER_ORDER_MIN_INTERVAL = 5 * 24 * 60 * 60
const LAST_WATER_ORDER_DATE_KEY = 'water-order-last-date'

const greetingMessages = ['^say (.*)', '^say']
const waterOrderingMessages = ['^закажи воду$', '^order water$']

const respondWithOrderConfirmation = () => {
  const possibleReplies = [
    'Хорошо.',
    'Ок.',
    'Закажу.',
    'Да, сэр :guardsman:!',
    'Готово :white_check_mark:!',
    'Good.',
    'Ok.',
    'I will!',
    'Yes, sir! :guardsman:',
    'Done :white_check_mark:.'
  ]

  _sample(possibleReplies)
};

const respondWithOrderSendingError = () => {
  const possibleReplies = [
    'Something went wrong and request hasn\'t been sent. :non-potable_water:',
    'Произошла ошибка и запрос не отправился. :non-potable_water:'
  ]

  _sample(possibleReplies)
};

const respondWithTooMuchOrdersError = (lastWaterOrderDate) => {
  const possibleReplies = [
    `:non-potable_water:. You can't send water that often.\
      Last time I ordered it ${lastWaterOrderDate}`,
    `:non-potable_water:. Нельзя заказывать воду слишком часто.\
      В последний раз я заказывала воду ${lastWaterOrderDate}`
  ]

  _sample(possibleReplies)
};

const passedEnoughTimeFromLastOrder = (lastWaterOrderDate) => {
  const lastWaterOrder = new Date(lastWaterOrderDate)
  const currentDate = new Date()
  const minInterval = process.env.WATER_ORDER_MIN_INTERVAL || DEFAULT_WATER_ORDER_MIN_INTERVAL
  const currentIntercal = (currentDate - lastWaterOrder) / 1000
  const isEnough = currentIntercal > minInterval

  if (lastWaterOrder && isEnough) {
    return true
  }

  if (!lastWaterOrder) {
    return true
  }

  return false
};

const makeOrder = (lastWaterOrderDate) => {
  if (passedEnoughTimeFromLastOrder(lastWaterOrderDate)) {
    return sendEmail()
  } else {
    const message = respondWithTooMuchOrdersError(lastWaterOrderDate)

    return Promise.reject(message)
  }
}

const sendEmail = () => new Promise((resolve, reject) => {
  const message = {
    to: process.env.WATER_ORDER_RECIPIENT_EMAIL,
    toname: process.env.WATER_ORDER_RECIPIENT_NAME,
    from: process.env.WATER_ORDER_ADMIN_EMAIL,
    fromname: process.env.WATER_ORDER_ADMIN_NAME,
    cc: process.env.WATER_ORDER_ADMIN_EMAIL,
    subject: ' ',
    text: ' ',
  }

  const email = new sendgrid.Email(message)

  email.setFilters({
    templates: {
      settings: {
        enable: 1,
        template_id: process.env.SENDGRID_WATER_ORDER_TEMPLATE,
      },
    },
  });

  sendgrid.send(email, (error) => {
    if (error) {
      reject(respondWithOrderConfirmation())
    } else {
      resolve(respondWithOrderSendingError())
    }
  });
})

const register = (controller) => {
  controller.hears(greetingMessages, 'direct_message,direct_mention', (mona, message) => {
    const userInput = message.match[1]

    mona.reply(message, `Sorry, did you say *${userInput}*?`)
  })

  controller.hears(waterOrderingMessages, 'direct_message,direct_mention', (mona, message) => {
    const lastWaterOrderDate = controller.storage.brain.get(LAST_WATER_ORDER_DATE_KEY)
    console.log(lastWaterOrderDate)
    makeOrder(lastWaterOrderDate)
      .then((result) => {
        console.log('makeOrder:then >>>>', message, result)
        mona.reply(message, result)
        controller.storage.brain.save({
          id: LAST_WATER_ORDER_DATE_KEY,
          value: new Date(),
        })
      })
      .catch((result) => {
        console.log('makeOrder:catch >>>>', message, result)
        mona.reply(message, 'Oops')
      })
  })
}

module.exports = register