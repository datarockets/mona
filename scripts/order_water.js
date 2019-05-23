/* eslint-disable no-useless-escape */
//
// Description:
//   Create an order for water to office.
//
// Commands:
//   hubot закажи воду - Makes and order by sending template email to water dealer
//
// Dependencies:
//   * mandrill-api
//
// Configuration:
//   SENDGRID_KEY
//   WATER_ORDER_MIN_INTERVAL
//   WATER_ORDER_RECIPIENT_EMAIL
//   WATER_ORDER_RECIPIENT_NAME
//   WATER_ORDER_ADMIN_EMAIL
//   WATER_ORDER_ADMIN_NAME
//   WATER_ORDER_SUCCESS_WEBHOOK
//   SENDGRID_WATER_ORDER_TEMPLATE
const https = require('https');

const DEFAULT_WATER_ORDER_INTERVAL = 5 * 24 * 60 * 60; // 5 days in seconds

const sendgrid = require('sendgrid')(process.env.SENDGRID_KEY);

const sendOrderToWaterDealer = (robot, successCallback, errorCallback) => {
  const message = {
    to: process.env.WATER_ORDER_RECIPIENT_EMAIL,
    toname: process.env.WATER_ORDER_RECIPIENT_NAME,
    from: process.env.WATER_ORDER_ADMIN_EMAIL,
    fromname: process.env.WATER_ORDER_ADMIN_NAME,
    cc: process.env.WATER_ORDER_ADMIN_EMAIL,
    subject: ' ',
    text: ' ',
  };

  const email = new sendgrid.Email(message);
  email.setFilters({
    templates: {
      settings: {
        enable: 1,
        template_id: process.env.SENDGRID_WATER_ORDER_TEMPLATE,
      },
    },
  });

  sendgrid.send(email, (error, result) => {
    console.log(result);
    if (error) {
      console.log(error);
      errorCallback();
    } else {
      https.get(process.env.WATER_ORDER_SUCCESS_WEBHOOK);
      robot.brain.set('LastWaterOrderCreatedAt', new Date());
      successCallback();
    }
  });
};

const passedEnoughTimeFromLastOrder = (robot) => {
  const lastWaterOrder = new Date(robot.brain.get('LastWaterOrderCreatedAt'));
  if (lastWaterOrder) {
    const currentDate = new Date();
    if ((currentDate - lastWaterOrder) / 1000 >
    (process.env.WATER_ORDER_MIN_INTERVAL || DEFAULT_WATER_ORDER_INTERVAL)) {
      return (true);
    }
    return (false);
  }
  return (true);
};

const respondWithOrderConfirmation = (response) => {
  const possibleReplies = [
    'Got it.',
    'Ok.',
    'Going to order.',
    'Ready :white_check_mark:.',
    'Good.',
    'Ok.',
    'I will!',
    'Done :white_check_mark:.',
    'Yes!'
  ];
  response.reply(response.random(possibleReplies));
};

const respondWithOrderSendingError = (response) => {
  const possibleReplies = [
    'Something went wrong and request hasn\'t been sent. :non-potable_water:'
  ];
  response.reply(response.random(possibleReplies));
};

const respondWithTooMuchOrdersError = (response, robot) => {
  const possibleReplies = [
    `:non-potable_water:. You can't send water that often.\
      Last time I ordered it ${robot.brain.get('LastWaterOrderCreatedAt')}`,
  ];
  response.reply(response.random(possibleReplies));
};

const handlerCommunication = (robot, queries) => {
  queries.forEach((query) => {
    robot.hear(new RegExp(`^${query}$`, 'i'), (response) => {
      if (passedEnoughTimeFromLastOrder(robot)) {
        sendOrderToWaterDealer(
          robot,
          () => {
            respondWithOrderConfirmation(response);
          },
          () => {
            respondWithOrderSendingError(response);
          }
        );
      } else {
        respondWithTooMuchOrdersError(response, robot);
      }
    });
  });
};

const waterOrderQuery = /^(?=.*\bmona\b)(?=.*\border\b)(?=.*\bwater\b).*$/;

// This one triggers ONLY on those phrases
module.exports = (robot) => {
  handlerCommunication(robot, [waterOrderQuery]);
};
