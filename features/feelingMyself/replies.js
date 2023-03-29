function continousVerb({ plural }) {
  return plural ? 'are' : 'is'
}

function simpleVerb({ plural, third }) {
  return plural || !third ? 'do' : 'does'
}

module.exports = (subject, continous) => ([
  `:cool_cat: I bet ${subject.reference} ${continous ? continousVerb(subject) : simpleVerb(subject)}! :trollface:`,
])
