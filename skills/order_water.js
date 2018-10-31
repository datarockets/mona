const DEFAULT_WATER_ORDER_INTERVAL = 5 * 24 * 60 * 60

const greetingMessages = ['^say (.*)', '^say']
const waterOrderingMessages = ['^закажи воду$', '^order water$']
const reactMessageKinds = ['direct_message', 'direct_mention']


const passedEnoughTimeFromLastOrder = (createdAt) => {
  const lastWaterOrder = new Date(createdAt)
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

const makeOrder = () => new Promise((_resolve, reject) => {
  if (passedEnoughTimeFromLastOrder()) {
    return sendEmail()
  } else {
    return reject()
  }
})

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

  sendgrid.send(email, (error, result) => {
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  });
})

const register = (controller) => {
  controller.hears(greetingMessages, reactMessageKinds, (mona, message) => {
    const [_, userInput] = message

    mona.reply('Sorry, did you say ', `*${userInput}*`, '?')
  })

  controller.hears(waterOrderingMessages, reactMessageKinds, (mona, message) => {
    makeOrder()
      .then(() => {
        mona.reply('Done!')
      })
      .catch(() => {
        mona.reply('Ooops...')
      })
  })
}

module.exports = register