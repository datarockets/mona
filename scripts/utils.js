const moment = require('moment-timezone');

module.exports = {
  isEnglishDay: () => {
    const currentDayOfWeek = moment().tz('Europe/Minsk').day();
    return process.env.ENGLISH_DAY_OF_WEEK === currentDayOfWeek;
  },
};
