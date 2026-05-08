import {IFormatDateOption, IDateI18n} from "../type";


const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatDate(dateInput: Date | number | string, option: IFormatDateOption): string {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return ''
  }

  const now = new Date();

  if (option.relativeTimeThreshold !== null) {
    const threshold = option.relativeTimeThreshold ?? getTodayStart(now, option.timeZone);

    if (date >= threshold) {
      const diff = now.getTime() - date.getTime();
      return formatRelativeTime(diff, option.i18n);
    }
  }

  return formatStandardDate(date, now, option);
}

function getTodayStart(date: Date, timeZone?: string): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  if (timeZone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(date);
    const tzYear = parseInt(parts.find(p => p.type === 'year')?.value || `${year}`);
    const tzMonth = parseInt(parts.find(p => p.type === 'month')?.value || `${month + 1}`) - 1;
    const tzDay = parseInt(parts.find(p => p.type === 'day')?.value || `${day}`);

    return new Date(tzYear, tzMonth, tzDay);
  }

  return new Date(year, month, day);
}

function formatRelativeTime(diff: number, i18n: IDateI18n): string {
  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}${i18n.day}`);
  }

  if (hours > 0 && parts.length < 2) {
    parts.push(`${hours}${i18n.hour}`);
  }

  if (minutes > 0 && parts.length < 2) {
    parts.push(`${minutes}${i18n.minute}`);
  }

  if (parts.length === 0) {
    return `${0}${i18n.minute}${i18n.ago}`;
  }

  return `${parts.join('')}${i18n.ago}`;
}

function formatStandardDate(date: Date, now: Date, options: IFormatDateOption): string {
  const showTime = options.showTime ?? false;
  const omitYearThisYear = options.omitYearThisYear ?? true;
  const shortYear = options.shortYear ?? true;

  const dateYear = date.getFullYear();
  const nowYear = now.getFullYear();
  const isThisYear = dateYear === nowYear;

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit'
  };

  if (!omitYearThisYear || !isThisYear) {
    formatOptions.year = shortYear ? '2-digit' : 'numeric';
  }

  if (showTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  if (options.timeZone) {
    formatOptions.timeZone = options.timeZone;
  }

  const formatted = new Intl.DateTimeFormat('zh-CN', formatOptions).format(date);
  return formatted.replace(/\//g, '-');
}
