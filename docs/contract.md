# Contract — iso-week-core

Pure ESM in `src/week.mjs`, zero runtime dependencies, Node >= 22.
UTC days; years 1..9999; weeks per ISO 8601 (week 1 holds Jan 4).

| Export | Result |
| --- | --- |
| `toISOWeek('YYYY-MM-DD')` | `{ isoYear, week, weekday }`. Validates the real calendar. |
| `fromISOWeek(isoYear, week, weekday)` | `'YYYY-MM-DD'`. Week 53 only in 52/53 rule years, else `NO_WEEK_53`. |

53-week rule: Jan 1 is Thursday, or leap year starting Wednesday.

Errors: `BAD_DATE` · `OUT_OF_RANGE` · `NO_WEEK_53`.
