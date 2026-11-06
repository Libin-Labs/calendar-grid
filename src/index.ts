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

function integer(value: number, name: string, minimum: number, maximum: number): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum)
    throw new RangeError(`${name} must be an integer from ${minimum} to ${maximum}.`);
}

function daysFromCivil(year: number, month: number, day: number): number {
  const adjustedYear = year - (month <= 2 ? 1 : 0);
  const era = Math.floor(adjustedYear / 400);
  const yearOfEra = adjustedYear - era * 400;
  const shiftedMonth = month + (month > 2 ? -3 : 9);
  const dayOfYear = Math.floor((153 * shiftedMonth + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

function civilFromDays(days: number): [number, number, number] {
  const z = days + 719468;
  const era = Math.floor(z / 146097);
  const dayOfEra = z - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36524) -
      Math.floor(dayOfEra / 146096)) /
      365,
  );
  let year = yearOfEra + era * 400;
  const dayOfYear =
    dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthPrime = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * monthPrime + 2) / 5) + 1;
  const month = monthPrime + (monthPrime < 10 ? 3 : -9);
  year += month <= 2 ? 1 : 0;
  return [year, month, day];
}

function weekday(days: number): number {
  return (((days + 4) % 7) + 7) % 7;
}
function isoWeek(days: number): number {
  const thursday = days + (3 - ((weekday(days) + 6) % 7));
  const year = civilFromDays(thursday)[0];
  const january4 = daysFromCivil(year, 1, 4);
  const firstMonday = january4 - ((weekday(january4) + 6) % 7);
  return Math.floor((days - firstMonday) / 7) + 1;
}
function formatDate(days: number): string {
  const [year, month, day] = civilFromDays(days);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function createCalendarGrid(
  year: number,
  month: number,
  options: CalendarGridOptions = {},
): CalendarCell[][] {
  integer(year, 'Year', 1, 9999);
  integer(month, 'Month', 1, 12);
  const startsOn = options.weekStartsOn ?? 1;
  if (startsOn !== 0 && startsOn !== 1)
    throw new RangeError('weekStartsOn must be 0 (Sunday) or 1 (Monday).');
  if (options.fixedWeeks !== undefined && typeof options.fixedWeeks !== 'boolean')
    throw new TypeError('fixedWeeks must be boolean.');
  const first = daysFromCivil(year, month, 1);
  const offset = (weekday(first) - startsOn + 7) % 7;
  const monthDays =
    daysFromCivil(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1) - first;
  const count = options.fixedWeeks ? 42 : Math.ceil((offset + monthDays) / 7) * 7;
  const start = first - offset;
  const cells: CalendarCell[][] = [];
  for (let index = 0; index < count; index += 7) {
    const week: CalendarCell[] = [];
    for (let column = 0; column < 7; column += 1) {
      const dateDays = start + index + column;
      const [cellYear, cellMonth, day] = civilFromDays(dateDays);
      week.push({
        date: formatDate(dateDays),
        day,
        weekday: weekday(dateDays),
        inMonth: cellYear === year && cellMonth === month,
        isoWeek: isoWeek(dateDays),
      });
    }
    cells.push(week);
  }
  return cells;
}

export function isLeapYear(year: number): boolean {
  integer(year, 'Year', 1, 9999);
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
