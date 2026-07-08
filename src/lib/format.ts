import { format, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';
import { fr } from 'date-fns/locale/fr';

import type { AppLocale } from '@/providers/locale-provider';

const locales = { fr, en: enGB };

function dfLocale(locale: AppLocale) {
  return locales[locale];
}

/** '2026-08-21' or ISO timestamp → 'ven. 21 août' / 'Fri 21 Aug' */
export function formatDay(date: string, locale: AppLocale): string {
  return format(parseISO(date), 'EEE d MMM', { locale: dfLocale(locale) });
}

/** ISO timestamp → '19:00' */
export function formatTime(timestamp: string, locale: AppLocale): string {
  return format(parseISO(timestamp), 'HH:mm', { locale: dfLocale(locale) });
}

/** ISO timestamps → '19:00 – 20:15' */
export function formatTimeRange(startsAt: string, endsAt: string, locale: AppLocale): string {
  return `${formatTime(startsAt, locale)} – ${formatTime(endsAt, locale)}`;
}

/** 'HH:MM:SS' time-of-day → 'HH:MM' */
export function formatClock(time: string): string {
  return time.slice(0, 5);
}

/** '2026-05-29' → 'vendredi 29' / 'Friday 29' */
export function formatDayLong(date: string, locale: AppLocale): string {
  return format(parseISO(date), 'EEEE d', { locale: dfLocale(locale) });
}

/** ISO date → '21 août 2026' / '21 Aug 2026' */
export function formatFullDate(date: string, locale: AppLocale): string {
  return format(parseISO(date), 'd MMM yyyy', { locale: dfLocale(locale) });
}

/** Weekday number (1 = Monday .. 7 = Sunday) → localized name. */
export function weekdayName(weekday: number, locale: AppLocale): string {
  // 2024-01-01 is a Monday.
  const date = new Date(2024, 0, weekday);
  return format(date, 'EEEE', { locale: dfLocale(locale) });
}

/** Local calendar day of an ISO timestamp, e.g. '2026-08-21'. */
export function dayKey(timestamp: string): string {
  return format(parseISO(timestamp), 'yyyy-MM-dd');
}

/** All calendar days of an edition (inclusive). */
export function editionDays(startsOn: string, endsOn: string): string[] {
  const days: string[] = [];
  const end = parseISO(endsOn);
  let cursor = parseISO(startsOn);
  while (cursor <= end && days.length < 30) {
    days.push(format(cursor, 'yyyy-MM-dd'));
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }
  return days;
}
