module.exports = (message, queries) => {
  const messageWithoutCode = message.text.replace(/ *`[^)]*` */g, '')

  return queries.map(query => messageWithoutCode.match(new RegExp(query, 'i'))).filter(Boolean).length > 0
}
