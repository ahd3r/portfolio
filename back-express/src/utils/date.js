const momentTimezone = require('moment-timezone');

const kievUtcOffset = momentTimezone.tz('Europe/Kiev').utcOffset();

const getNowTimestamp = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + kievUtcOffset);
  return d;
};

module.exports = { getNowTimestamp };
