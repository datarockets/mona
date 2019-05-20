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
];

const responsesOnName = [
  "I'm listening",
  'How can I help?',
  'Yeap?)',
  'Mm?)',
  "I'm here)",
];

const responsesOnGreeting = [
  'Hey!',
  'Morning, :smiley:',
  'Nice... :smiley:',
  'Hello! :smiley:',
  'Morning, :smiley:',
  'Hi, how are you?',
];

const cyrillicQuery = '[\u0400-\u04FF]+';


const handlerCommunication = (robot, queries, answers) => {
  queries.forEach((query) => {
    robot.hear(new RegExp(query, 'i'), (response) => {
      if (query === cyrillicQuery) {
        return response.send("It's, uncool. Speak in English, please :slightly_smiling_face:");
      }

      return response.send(response.random(answers));
    });
  });
};

module.exports = (robot) => {
  handlerCommunication(robot, ['\^@mona\$'], responsesOnName);
  handlerCommunication(
    robot,
    [...incomingGreetings, cyrillicQuery],
    responsesOnGreeting,
  );
};
