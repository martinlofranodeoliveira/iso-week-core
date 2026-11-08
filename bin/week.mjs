#!/usr/bin/env node
// Demo: fixed conversions, asserts exact output. --assert exits non-zero on mismatch.
import { toISOWeek, fromISOWeek } from '../src/week.mjs';

let failed = 0;
const w = toISOWeek('2026-01-01');
const pass1 = w.isoYear === 2026 && w.week === 1 && w.weekday === 4;
console.log(`${pass1 ? 'PASS' : 'FAIL'} 2026-01-01 -> ${w.isoYear}-W${w.week}-${w.weekday}`);
if (!pass1) failed++;
const back = fromISOWeek(2020, 53, 4);
const pass2 = back === '2020-12-31';
console.log(`${pass2 ? 'PASS' : 'FAIL'} 2020-W53-4 -> ${back}`);
if (!pass2) failed++;
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
