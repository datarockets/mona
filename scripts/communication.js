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
  'Hey',
  'Wazzzup',
];

const responsesOnName = [
  'Whazzzup bro?',
  'How can I help?',
  'Yeap?)',
  'Mm?)',
  "I'm here)",
];

const responsesOnGreeting = [
  'Hey, dude!',
  'Whatzzzup, bro :smiley:',
  'Morning, bro :smiley:',
  'Nice... :smiley:',
  'Hello! :smiley:',
  'Morning, bro :smiley:',
  'Hi, how are you?',
  'Hell ou',
];

const handlerCommunication = (robot, queries, answers) => {
  queries.forEach((query) => {
    robot.hear(new RegExp(query, 'i'), (response) => {
      response.send(response.random(answers));
    });
  });
};

module.exports = (robot) => {
  handlerCommunication(robot, ['\^@mona\$'], responsesOnName);
  handlerCommunication(
    robot,
    incomingGreetings,
    responsesOnGreeting,
  );
};
