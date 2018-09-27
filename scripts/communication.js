//  Description:
//   Set array of answers for any question you want.
//   If somebody in chat write appropriate query,
//   mona will answer him a random response for this query.

const greetings = ['Hello', 'Good morning', 'G\'day', '\^Hi\$', 
  'Доброго утра', 'Доброе утро', 'Привет'];

const handlerCommunication = (robot, queries, answers) => {
  queries.forEach((query) => {
    robot.hear(new RegExp(query, 'i'), (response) => {
      response.send(response.random(answers));
    });
  });
};

module.exports = (robot) => {
  handlerCommunication(robot, ['\^@mona\$'], ['whazzzup bro?', 
    'how can I help?', 'yeap?)', 'м?)', 'я тут)', 'yeap?)']
  );
  handlerCommunication(
    robot,
    greetings,
    ['Hey, dude!', 'Whatzzzup, bro :smiley:', 'Morning, bro :smiley:',
      'Доброе... :smiley:', 'Привет! :smiley:', 'И тебе! :smiley:',
      'Morning, bro :smiley:', 'Привет! Как дела?']
  );
};
