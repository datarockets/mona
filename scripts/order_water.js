/*
  Description:
    Create an order for water to office.

  Dependencies:
    * mandrill-api

  Configuration:
    MANDRILL_KEY
    WATER_ORDER_MIN_INTERVAL
    WATER_ORDER_RECIPIENT_EMAIL
    WATER_ORDER_RECIPIENT_NAME
    WATER_ORDER_ADMIN_EMAIL
    WATER_ORDER_ADMIN_NAME
    MANDRILL_WATER_ORDER_TEMPLATE

  Commands:
    hubot закажи воду
*/

var DEFAULT_WATER_ORDER_INTERVAL = 5*24*60*60; // 5 days in seconds

var mandrillApi = require('mandrill-api/mandrill');
var Mandrill = new mandrillApi.Mandrill(process.env.MANDRILL_KEY);

var passedEnoughTimeFromLastOrder = function (robot) {
  var lastWaterOrder = robot.brain.get('LastWaterOrderCreatedAt');

  if (lastWaterOrder) {
    var currentDate = new Date();
    if ((currentDate - lastWaterOrder) / 1000 > (process.env.WATER_ORDER_MIN_INTERVAL || DEFAULT_WATER_ORDER_INTERVAL)) {
      return(true);
    }
    else {
      return(false);
    }
  }
  else {
    return(true);
  }
};

var sendOrderToWaterDealer = function (robot, successCallback, errorCallback) {
  var message = {
    "to": [
      {
        "email": process.env.WATER_ORDER_RECIPIENT_EMAIL,
        "name": process.env.WATER_ORDER_RECIPIENT_NAME,
        "type": "to"
      },
      {
        "email": process.env.WATER_ORDER_ADMIN_EMAIL,
        "name": process.env.WATER_ORDER_ADMIN_NAME,
        "type": "cc"
      }
    ]
  };
  Mandrill.messages.sendTemplate(
    {
      "template_name": process.env.MANDRILL_WATER_ORDER_TEMPLATE,
      "template_content": [],
      "message": message
    },
    function (success) {
      console.log(success);
      robot.brain.set('LastWaterOrderCreatedAt', new Date());
      successCallback();
    },
    function (erorr) {
      console.log(error);
      errorCallback();
    }
  );
  console.log('done');
};

var respondWithOrderConfirmation = function (response) {
  var possibleReplies = ['Хорошо.', 'Ок.', 'Закажу.', 'Yes sir! :guardsman:', 'Done :white_check_mark:.'];
  response.reply(response.random(possibleReplies));
};

var respondWithOrderSendingError = function (response) {
  response.reply('Произошла ошибка и запрос не отправился. :non-potable_water:');
};

// TODO: Show error with useful information about when next order can be done.
var respondWithTooMuchOrdersError = function (response) {
  response.reply(':non-potable_water:. Нельзя заказывать воду слишком часто.');
};

module.exports = function (robot) {
  robot.respond(/закажи воду/i, function (response) {
    if (passedEnoughTimeFromLastOrder(robot)) {
      sendOrderToWaterDealer(
        robot,
        function () {
          respondWithOrderConfirmation(response);
        },
        function () {
          respondWithOrderSendingError(response);
        });
    }
    else {
      respondWithTooMuchOrdersError(response);
    }
  });
};
