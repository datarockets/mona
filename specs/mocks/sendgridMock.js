const sendgridMock = () => ({
  send: async message => (message),
  setApiKey: key => (key),
})

module.exports = sendgridMock
