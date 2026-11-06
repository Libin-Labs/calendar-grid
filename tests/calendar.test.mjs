import test from 'node:test';
import assert from 'node:assert/strict';
import { createCalendarGrid, isLeapYear } from '../dist/esm/index.js';

test('renders Monday-first February 2024 with leap day and adjacent dates', () => {
  const grid = createCalendarGrid(2024, 2);
  assert.equal(grid.length, 5);
  assert.equal(grid[0][3].date, '2024-02-01');
  assert.equal(grid[0][3].weekday, 4);
  assert.equal(grid.flat().find((cell) => cell.date === '2024-02-29').inMonth, true);
  assert.equal(grid[0][0].date, '2024-01-29');
});
test('supports six fixed weeks and Sunday-first weekday indices', () => {
  const grid = createCalendarGrid(2024, 2, { weekStartsOn: 0, fixedWeeks: true });
  assert.equal(grid.length, 6);
  assert.equal(grid[0][0].weekday, 0);
  assert.equal(grid[0][4].date, '2024-02-01');
});
test('reports ISO week 53 at the end of 2020 and start of 2021', () => {
  const dec = createCalendarGrid(2020, 12)
    .flat()
    .find((cell) => cell.date === '2020-12-31');
  const jan = createCalendarGrid(2021, 1)
    .flat()
    .find((cell) => cell.date === '2021-01-01');
  assert.equal(dec.isoWeek, 53);
  assert.equal(jan.isoWeek, 53);
});
test('uses Gregorian leap-year rules including century exceptions', () => {
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(2024), true);
});
test('uses five or six complete rows only and returns seven cells per week', () => {
  for (const month of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const grid = createCalendarGrid(2025, month);
    assert.ok(grid.length === 4 || grid.length === 5 || grid.length === 6);
    assert.ok(grid.every((week) => week.length === 7));
  }
});
test('rejects invalid dates and week options', () => {
  assert.throws(() => createCalendarGrid(0, 1), RangeError);
  assert.throws(() => createCalendarGrid(2024, 13), RangeError);
  assert.throws(() => createCalendarGrid(2024, 1, { weekStartsOn: 3 }), RangeError);
});
