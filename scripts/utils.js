var moment = require('moment');

module.exports = {
  isEnglishDay: function() {
    var currentDayOfWeek = moment(new Date()).day();
    return process.env.ENGLISH_DAY_OF_WEEK == currentDayOfWeek;
  },
};
