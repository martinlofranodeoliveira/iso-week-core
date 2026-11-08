// SPDX-License-Identifier: MIT
// Gregorian <-> ISO week date conversion (ISO 8601 weeks: Monday start,
// week 1 contains the first Thursday). UTC days only. No network, no I/O.

export const MIN_YEAR = 1;
export const MAX_YEAR = 9999;

export class WeekError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'WeekError';
    this.code = code;
  }
}

const DAY = 86400000;

function parseDay(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new WeekError('BAD_DATE');
  const [y, m, d] = s.split('-').map(Number);
  if (m < 1 || m > 12) throw new WeekError('BAD_DATE');
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    throw new WeekError('BAD_DATE');
  }
  if (y < MIN_YEAR || y > MAX_YEAR) throw new WeekError('OUT_OF_RANGE');
  return dt;
}

const fmt = (dt) => dt.toISOString().slice(0, 10);
// Monday=1..Sunday=7 for a UTC date.
const isoDow = (dt) => ((dt.getUTCDay() + 6) % 7) + 1;

/** Gregorian 'YYYY-MM-DD' -> { isoYear, week, weekday }. */
export function toISOWeek(date) {
  const dt = parseDay(date);
  const thursday = new Date(dt.getTime() + (4 - isoDow(dt)) * DAY);
  const isoYear = thursday.getUTCFullYear();
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const week1Mon = new Date(jan4.getTime() - (isoDow(jan4) - 1) * DAY);
  const week = Math.round((thursday.getTime() - week1Mon.getTime()) / (7 * DAY)) + 1;
  return { isoYear, week, weekday: isoDow(dt) };
}

function weeksInYear(y) {
  const jan1 = new Date(Date.UTC(y, 0, 1));
  const dow = isoDow(jan1);
  const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  return dow === 4 || (leap && dow === 3) ? 53 : 52;
}

/** ISO (year, week 1..52/53, weekday 1..7) -> 'YYYY-MM-DD'. */
export function fromISOWeek(isoYear, week, weekday) {
  for (const [name, v, lo, hi] of [['isoYear', isoYear, MIN_YEAR, MAX_YEAR], ['week', week, 1, 53], ['weekday', weekday, 1, 7]]) {
    if (!Number.isInteger(v) || v < lo || v > hi) throw new WeekError('OUT_OF_RANGE', name);
  }
  if (week === 53 && weeksInYear(isoYear) === 52) throw new WeekError('NO_WEEK_53');
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const monday = new Date(jan4.getTime() - (isoDow(jan4) - 1) * DAY);
  return fmt(new Date(monday.getTime() + ((week - 1) * 7 + (weekday - 1)) * DAY));
}
