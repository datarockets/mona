/*
  Description:
   Set array of answers for any question you want.
   If somebody in chat write appropriate query, mona will answer him a random response for this query.
*/

var utils = require('./utils');

var handlerCommunication = function(robot, queries, answers) {
  queries.forEach(function(query) {
    robot.hear(new RegExp(query, 'i'), function (response) {
      response.send(response.random(answers))
    });
  })
};

module.exports = function (robot) {
  if(utils.isEnglishDay()) {
    handlerCommunication(robot, ['\^@mona\$'], ['whazzzup bro?', 'how can I help?', 'yeap?)']);
    handlerCommunication(robot, ['Hello', 'Good morning', 'Hi, team!'],
      ['Hey, dude!', 'Good morning in our English day!', 'Whatzzzup, bro :smiley:', 'Morning, bro :smiley:']);
  } else {
    handlerCommunication(robot, ['\^@mona\$'], ['м?)', 'я тут)', 'yeap?)']);
    handlerCommunication(robot, ['Доброго утра', 'Good morning', 'Привет'],
      ['Доброе... :smiley:', 'Привет! :smiley:', 'И тебе! :smiley:', 'Morning, bro :smiley:', 'Привет! Как дела?']);
  }
};
