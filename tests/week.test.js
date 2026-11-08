import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toISOWeek, fromISOWeek, WeekError } from '../src/week.mjs';

describe('toISOWeek', () => {
  it('pins known dates', () => {
    assert.deepEqual(toISOWeek('2026-01-01'), { isoYear: 2026, week: 1, weekday: 4 }); // Thursday
    assert.deepEqual(toISOWeek('2025-12-29'), { isoYear: 2026, week: 1, weekday: 1 }); // year boundary
    assert.deepEqual(toISOWeek('2020-12-31'), { isoYear: 2020, week: 53, weekday: 4 }); // 53-week year
    assert.deepEqual(toISOWeek('2021-01-01'), { isoYear: 2020, week: 53, weekday: 5 });
  });
  it('rejects impossible dates', () => {
    assert.throws(() => toISOWeek('2026-02-30'), (e) => e.code === 'BAD_DATE');
    assert.throws(() => toISOWeek('january'), (e) => e.code === 'BAD_DATE');
  });
});

describe('fromISOWeek', () => {
  it('inverts known dates', () => {
    assert.equal(fromISOWeek(2026, 1, 4), '2026-01-01');
    assert.equal(fromISOWeek(2020, 53, 4), '2020-12-31');
  });
  it('rejects week 53 in 52-week years', () => {
    assert.throws(() => fromISOWeek(2021, 53, 1), (e) => e.code === 'NO_WEEK_53');
    assert.throws(() => fromISOWeek(2026, 1, 8), (e) => e.code === 'OUT_OF_RANGE');
    assert.ok(new WeekError('X') instanceof Error);
  });
  it('round-trips across year boundaries', () => {
    for (const d of ['2025-12-28', '2025-12-29', '2026-01-01', '2026-01-04', '2020-12-31', '2021-01-03']) {
      const w = toISOWeek(d);
      assert.equal(fromISOWeek(w.isoYear, w.week, w.weekday), d, d);
    }
  });
});
