/*
  Description:
   Set array of answers for any question you want.
   If somebody in chat write appropriate query, mona will answer him a random response for this query.
*/

var handlerCommunication = function(robot, queries, answers) {
  queries.forEach(function(query) {
    robot.hear(new RegExp(query, 'i'), function (response) {
      response.send(response.random(answers))
    });
  })
};

module.exports = function (robot) {
  handlerCommunication(robot, ['\^@mona\$'], ['м?)', 'я тут)', 'yeap?)']);
  handlerCommunication(robot, ['\\(╯°□°\）╯︵ ┻━┻'], ['┬─┬ノ( º _ ºノ) Calm down, bro.']);
  handlerCommunication(robot, ['Утро', 'Доброго утра', 'Good morning'], ['Доброе... :smiley:', 'Привет!!! :smiley:', 'И тебе! :smiley:', 'Morning, bro :smiley:'])
};
