const sendgridMock = () => {
  return ({
    send: async (message) => {},
    setApiKey: (key) => {}
  })
}

module.exports = sendgridMock
