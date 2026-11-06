# @lp-labs/calendar-grid

Pure Gregorian calendar grids. Pure Gregorian month grids with adjacent dates, selectable week starts, fixed rows, and ISO week numbers.

## Install

```sh
npm install @lp-labs/calendar-grid
```

## Quick start

```js
import { createCalendarGrid } from '@lp-labs/calendar-grid';
console.log(createCalendarGrid(2024, 2)[0][3].date); // 2024-02-01
```

## Runtime exports

- `createCalendarGrid`
- `isLeapYear`

The package supplies independent ESM and CommonJS builds, bundled declarations, and no runtime or peer dependencies.

## Complete public TypeScript declarations

```ts
export type WeekStart = 0 | 1;
export interface CalendarCell {
  date: string;
  day: number;
  weekday: number;
  inMonth: boolean;
  isoWeek: number;
}
export interface CalendarGridOptions {
  weekStartsOn?: WeekStart;
  fixedWeeks?: boolean;
}
export declare function createCalendarGrid(
  year: number,
  month: number,
  options?: CalendarGridOptions,
): CalendarCell[][];
export declare function isLeapYear(year: number): boolean;
```

## Scope and limits

Builds complete 4?6 row month grids from integer civil dates, including adjacent-month cells, Sunday/Monday week starts, optional fixed six-week output, weekday numbers, and ISO week numbers. Gregorian leap years are available separately.

## Errors and bounds

Invalid year/month/week options raise RangeError; non-boolean fixedWeeks raises TypeError.

## Customization

Set weekStartsOn to 0 or 1 and fixedWeeks to true for exactly 42 cells. The default is Monday-first with the minimum complete number of weeks.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
