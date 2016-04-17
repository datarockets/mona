/*
  Description:
    Create an order for water to office.

  Commands:
    hubot закажи воду - Makes and order by sending template email to water dealer

  Dependencies:
    * mandrill-api

  Configuration:
    SENDGRID_KEY
    WATER_ORDER_MIN_INTERVAL
    WATER_ORDER_RECIPIENT_EMAIL
    WATER_ORDER_RECIPIENT_NAME
    WATER_ORDER_ADMIN_EMAIL
    WATER_ORDER_ADMIN_NAME
    SENDGRID_WATER_ORDER_TEMPLATE
*/

var DEFAULT_WATER_ORDER_INTERVAL = 5*24*60*60; // 5 days in seconds

var sendgrid = require('sendgrid')(process.env.SENDGRID_KEY);

var sendOrderToWaterDealer = function (robot, successCallback, errorCallback) {
  var message = {
    "to": process.env.WATER_ORDER_RECIPIENT_EMAIL,
    "toname": process.env.WATER_ORDER_RECIPIENT_NAME,
    "from": process.env.WATER_ORDER_ADMIN_EMAIL,
    "fromname": process.env.WATER_ORDER_ADMIN_NAME,
    "cc": process.env.WATER_ORDER_ADMIN_EMAIL,
    "subject": " ",
    "text": " "
  }

  var email = new sendgrid.Email(message);
  email.setFilters({
    "templates": {
      "settings": {
        "enable": 1,
        "template_id": process.env.SENDGRID_WATER_ORDER_TEMPLATE
      }
    }
  });

  sendgrid.send(email, function(error, result) {
    console.log(result);
    if (error) {
      console.log(error);
      errorCallback();
    }
    else {
      robot.brain.set('LastWaterOrderCreatedAt', new Date());
      successCallback();
    }
  });
};

var passedEnoughTimeFromLastOrder = function (robot) {
  var lastWaterOrder = new Date(robot.brain.get('LastWaterOrderCreatedAt'));

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
