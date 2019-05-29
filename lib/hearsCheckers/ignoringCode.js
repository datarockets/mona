const removeCodeFromMessage = message => message.text.replace(/ *`[^)]*` */g, '')

const matches = (messageWithoutCode, queries) =>
  queries.map(query => messageWithoutCode.match(new RegExp(query, 'i')))

const filteredMatches = (messageWithoutCode, queries) =>
  matches(messageWithoutCode, queries).filter(Boolean)

const anyMatches = (messageWithoutCode, queries) =>
  filteredMatches(messageWithoutCode, queries).length > 0

module.exports = (message, queries) => {
  const messageWithoutCode = removeCodeFromMessage(message)

  return anyMatches(messageWithoutCode, queries)
}
