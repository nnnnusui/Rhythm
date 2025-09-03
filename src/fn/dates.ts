/** @public */
export const Dates = (() => {
  const toPaddedParts = (date: Date) => {
    const timezone = -date.getTimezoneOffset();
    return {
      /* eslint-disable @stylistic/newline-per-chained-call */
      year: date.getFullYear().toString().padStart(4, "0"),
      month: (date.getMonth() + 1).toString().padStart(2, "0"),
      day: date.getDate().toString().padStart(2, "0"),
      hour: date.getHours().toString().padStart(2, "0"),
      minute: date.getMinutes().toString().padStart(2, "0"),
      second: date.getSeconds().toString().padStart(2, "0"),
      milliSecond: date.getMilliseconds().toString().padStart(3, "0"),
      tzSign: timezone >= 0 ? "+" : "-",
      tzHour: Math.floor(timezone / 60).toString().padStart(2, "0"),
      tzMin: (timezone % 60).toString().padStart(2, "0"),
      /* eslint-enable @stylistic/newline-per-chained-call */
    };
  };

  const tryToISO8601WithTimezone = (date: Date | undefined) =>
    date ? toISO8601WithTimezone(date) : undefined;

  const toISO8601WithTimezone = (date: Date): string => {
    const p = toPaddedParts(date);
    const datePart = `${p.year}-${p.month}-${p.day}`;
    const timePart = `${p.hour}:${p.minute}:${p.second}.${p.milliSecond}`;
    const offsetPart = `${p.tzSign}${p.tzHour}:${p.tzMin}`;
    return `${datePart}T${timePart}${offsetPart}`;
  };

  return {
    tryToISO8601WithTimezone,
    toISO8601WithTimezone,
  };
})();
