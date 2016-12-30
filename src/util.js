import moment from 'moment';

export function computeElapsedSeconds(startedEpoch, duration) {
  if (startedEpoch === null) {
    return duration;
  }

  const now = moment();
  const startedTime = moment.unix(startedEpoch);
  const elapsedSeconds = now.diff(startedTime, 'seconds') + duration;
  return elapsedSeconds;
}

export function toHoursAndMinutes(seconds) {
  const m = moment.duration(seconds * 1000);
  return {
    hours: m.hours(),
    minutes: m.minutes()
  };
}

export function toSeconds(hours, minutes) {
  return (hours * 60 + minutes) * 60;
}
