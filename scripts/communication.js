//  Description:
//   Set array of answers for any question you want.
//   If somebody in chat write appropriate query,
//   mona will answer him a random response for this query.

const incomingGreetings = [
  'Hello',
  'Good morning',
  'G\'day',
  '\^Hi\$',
  'Morning',
  'Hey'
];

const responsesOnName = [
  "I'm listening",
  'How can I help?',
  'Yeap?)',
  'Mm?)',
  "I'm here)"
];

const responsesOnGreeting = [
  'Hey!',
  'Morning, :smiley:',
  'Nice... :smiley:',
  'Hello! :smiley:',
  'Morning, :smiley:',
  'Hi, how are you?'
];

const handlerCommunication = (robot, queries, answers) => {
  const matchKeys = queries.join('|');
  const regexp = new RegExp(`\\b(${matchKeys})\\b`, 'i');

  robot.hear(regexp, response => response.send(response.random(answers)));
};

module.exports = (robot) => {
  handlerCommunication(robot, ['\^@mona\$'], responsesOnName);
  handlerCommunication(
    robot,
    incomingGreetings,
    responsesOnGreeting
  );
};
