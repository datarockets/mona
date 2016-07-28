/*
  Description:
    Prevent using of Russian words in English Thursdays at datarockets.

  Dependencies:
    * moment

  Configuration:
    ENGLISH_DAY_OF_WEEK

*/
var moment = require('moment');

var answers = [
  'Man, it is  English Thursday Today',
  'I told you, dude, speak English pls',
  'Who can understand your Russian during our cool English day?',
  'It doesn\'t work - speak English please'
];

module.exports = function (robot) {
  robot.hear(new RegExp('[а-я]', 'i'), function(response) {
    var currentDayOfWeek = moment(new Date()).day();
    if(process.env.ENGLISH_DAY_OF_WEEK == currentDayOfWeek) {
      response.reply(answers[Math.floor(Math.random() * answers.length)]);
    }
  });
};
