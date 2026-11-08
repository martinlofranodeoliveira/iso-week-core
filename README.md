# iso-week-core

Gregorian to ISO week date conversion and back, with 53-week year
handling. Zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { toISOWeek } from './src/week.mjs';
toISOWeek('2026-01-01'); // { isoYear: 2026, week: 1, weekday: 4 }
```

```sh
npm test          # 5 tests, node:test, no dependencies
npm run demo
```

Years 1..9999, UTC days. MIT — see `LICENSE`.
[Versão em português](README.pt-BR.md).
