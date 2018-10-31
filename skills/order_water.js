const greetingMessages = ['^say (.*)', '^say']
const waterOrderingMessages = ['^закажи воду$', '^order water$']
const reactMessageKinds = ['direct_message', 'direct_mention']

const sendOrder = () => new Promise((resolve, reject) => {
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
      reject()
    } else {
      resolve()
    }
  });
})

const register = (controller) => {
  controller.hears(greetingMessages, reactMessageKinds, (mona, message) => {
    const [_, userInput] = message

    mona.reply('Sorry, did you say ', `*${userInput}*`, '?')
  })

  controller.hears(waterOrderingMessages, reactMessageKinds, (mona, message) => {
    sendOrder()
  })
}

module.exports = register