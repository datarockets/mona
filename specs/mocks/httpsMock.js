const httpsMock = () => ({
  get: async url => (url),
})

module.exports = httpsMock
