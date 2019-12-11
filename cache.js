require('dotenv').config()

const tokenCache = JSON.parse(process.env.TOKENS || '{}')
const userCache = JSON.parse(process.env.USERS || '{}')

module.exports = { tokenCache, userCache }
