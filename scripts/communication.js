//  Description:
//   Set array of answers for any question you want.
//   If somebody in chat write appropriate query,
//   mona will answer him a random response for this query.


const utils = require('./utils');

const englishGreetings = ['Hello', 'Good morning', 'G\'day', '\^Hi\$'];
const russianGreetings = ['Доброго утра', 'Доброе утро', 'Привет'];
const greetings = russianGreetings.concat(englishGreetings);

const handlerCommunication = (robot, queries, answers) => {
  queries.forEach((query) => {
    robot.hear(new RegExp(query, 'i'), (response) => {
      response.send(response.random(answers));
    });
  });
};

module.exports = (robot) => {
  if (utils.isEnglishDay()) {
    handlerCommunication(robot, ['\^@mona\$'], ['whazzzup bro?', 'how can I help?', 'yeap?)']);
    handlerCommunication(
      robot,
      englishGreetings,
      ['Hey, dude!', 'Good morning in our English day!',
        'Whatzzzup, bro :smiley:', 'Morning, bro :smiley:']
    );
  } else {
    handlerCommunication(robot, ['\^@mona\$'], ['м?)', 'я тут)', 'yeap?)']);
    handlerCommunication(
      robot, greetings,
      ['Доброе... :smiley:', 'Привет! :smiley:', 'И тебе! :smiley:', 'Morning, bro :smiley:', 'Привет! Как дела?']
    );
  }
};
