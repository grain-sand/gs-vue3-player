// noinspection TypeScriptUnresolvedReference

import {describe, expect, it} from 'vitest';
import {enUS, formatDate, jaJP, koKR, zhCN, zhTW} from '../src';

describe('formatDate', () => {
  it('should format date with Date object input', () => {
    const date = new Date('2026-01-15T10:30:00');
    const result = formatDate(date, {
      i18n: zhCN,
      relativeTimeThreshold: null,
      showTime: true
    });
    expect(result).toBe('01-15 10:30');
  });

  it('should format date with timestamp number input', () => {
    const timestamp = new Date('2026-01-15T10:30:00').getTime();
    const result = formatDate(timestamp, {
      i18n: zhCN,
      relativeTimeThreshold: null,
      showTime: true
    });
    expect(result).toBe('01-15 10:30');
  });

  it('should format date with string input', () => {
    const result = formatDate('2026-01-15T10:30:00', {
      i18n: zhCN,
      relativeTimeThreshold: null,
      showTime: true
    });
    expect(result).toBe('01-15 10:30');
  });

  it('should throw error for invalid date input', () => {
    expect(() => formatDate('invalid-date', { i18n: zhCN })).toThrow('Invalid date input');
  });

  describe('relative time formatting', () => {
    it('should format relative time with minutes only', () => {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const result = formatDate(tenMinutesAgo, { i18n: zhCN, relativeTimeThreshold: threshold });
      expect(result).toBe('10分前');
    });

    it('should format relative time with hours and minutes', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000 - 30 * 60 * 1000);
      const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, { i18n: zhCN, relativeTimeThreshold: threshold });
      expect(result).toBe('2时30分前');
    });

    it('should format relative time with days and hours', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000);
      const threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, { i18n: zhCN, relativeTimeThreshold: threshold });
      expect(result).toBe('3天5时前');
    });

    it('should format relative time with days only', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      const threshold = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, { i18n: zhCN, relativeTimeThreshold: threshold });
      expect(result).toBe('5天前');
    });

    it('should show 0 minutes ago for very recent time', () => {
      const now = new Date();
      const justNow = new Date(now.getTime() - 500);
      const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const result = formatDate(justNow, { i18n: zhCN, relativeTimeThreshold: threshold });
      expect(result).toBe('0分前');
    });
  });

  describe('relativeTimeThreshold option', () => {
    it('should use custom threshold', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);
      const customThreshold = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, {
        i18n: zhCN,
        relativeTimeThreshold: customThreshold
      });
      expect(result).toBe('1天1时前');
    });

    it('should not use relative time when threshold is null', () => {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      const result = formatDate(tenMinutesAgo, {
        i18n: zhCN,
        relativeTimeThreshold: null
      });
      expect(result).not.toContain('分前');
    });

    it('should not use relative time when date is before threshold', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000);
      const threshold = new Date(now.getTime() - 20 * 60 * 60 * 1000);

      const result = formatDate(yesterday, {
        i18n: zhCN,
        relativeTimeThreshold: threshold
      });
      expect(result).not.toContain('时前');
    });
  });

  describe('internationalization', () => {
    it('should format with English locale', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, { i18n: enUS, relativeTimeThreshold: threshold });
      expect(result).toBe('2h ago');
    });

    it('should format with Japanese locale', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000);
      const threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, { i18n: jaJP, relativeTimeThreshold: threshold });
      expect(result).toBe('3日2時間前');
    });

    it('should format with Korean locale', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 30 * 60 * 1000);
      const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, { i18n: koKR, relativeTimeThreshold: threshold });
      expect(result).toBe('30분전');
    });

    it('should format with Traditional Chinese locale', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
      const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, { i18n: zhTW, relativeTimeThreshold: threshold });
      expect(result).toBe('5時前');
    });
  });

  describe('timezone support', () => {
    it('should format date with timezone', () => {
      const date = new Date('2026-01-15T10:30:00Z');
      const result = formatDate(date, {
        i18n: zhCN,
        timeZone: 'America/New_York',
        relativeTimeThreshold: null,
        showTime: true
      });
      expect(result).toBe('01-15 05:30');
    });

    it('should handle timezone in relative time calculation', () => {
      const now = new Date();
      const timeAgo = new Date(now.getTime() - 30 * 60 * 1000);
      const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const result = formatDate(timeAgo, {
        i18n: zhCN,
        timeZone: 'America/New_York',
        relativeTimeThreshold: threshold
      });
      expect(result).toBe('30分前');
    });

    it('should use default timezone when not specified', () => {
      const date = new Date('2026-01-15T10:30:00');
      const result = formatDate(date, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        showTime: true
      });
      expect(result).toBe('01-15 10:30');
    });
  });

  describe('default threshold behavior', () => {
    it('should use today start as default threshold', () => {
      const now = new Date();
      const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);

      const result = formatDate(todayMorning, { i18n: zhCN });
      expect(result).toContain('时');
    });

    it('should format as standard date for yesterday', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000);

      const result = formatDate(yesterday, { i18n: zhCN });
      expect(result).not.toContain('前');
    });
  });

  describe('showTime option', () => {
    it('should hide time by default', () => {
      const date = new Date('2026-01-15T10:30:00');
      const result = formatDate(date, {
        i18n: zhCN,
        relativeTimeThreshold: null
      });
      expect(result).toBe('01-15');
    });

    it('should hide time when showTime is false', () => {
      const date = new Date('2026-01-15T10:30:00');
      const result = formatDate(date, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        showTime: false
      });
      expect(result).toBe('01-15');
    });

    it('should show time when showTime is true', () => {
      const date = new Date('2026-01-15T10:30:00');
      const result = formatDate(date, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        showTime: true
      });
      expect(result).toBe('01-15 10:30');
    });
  });

  describe('omitYearThisYear option', () => {
    it('should omit year for this year by default', () => {
      const now = new Date();
      const dateThisYear = new Date(now.getFullYear(), 5, 15, 10, 30);
      const result = formatDate(dateThisYear, {
        i18n: zhCN,
        relativeTimeThreshold: null
      });
      expect(result).toBe('06-15');
    });

    it('should show year when omitYearThisYear is false', () => {
      const now = new Date();
      const dateThisYear = new Date(now.getFullYear(), 5, 15, 10, 30);
      const result = formatDate(dateThisYear, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        omitYearThisYear: false
      });
      expect(result).toMatch(/^\d{2}-/);
    });

    it('should show year for previous year', () => {
      const now = new Date();
      const dateLastYear = new Date(now.getFullYear() - 1, 5, 15, 10, 30);
      const result = formatDate(dateLastYear, {
        i18n: zhCN,
        relativeTimeThreshold: null
      });
      expect(result).toMatch(/^\d{2}-/);
    });
  });

  describe('shortYear option', () => {
    it('should use short year by default', () => {
      const date = new Date('2026-01-15T10:30:00');
      const result = formatDate(date, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        omitYearThisYear: false,
        showTime: true
      });
      expect(result).toBe('26-01-15 10:30');
    });

    it('should use full year when shortYear is false', () => {
      const date = new Date('2026-01-15T10:30:00');
      const result = formatDate(date, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        omitYearThisYear: false,
        shortYear: false,
        showTime: true
      });
      expect(result).toBe('2026-01-15 10:30');
    });

    it('should use short year for previous year', () => {
      const now = new Date();
      const dateLastYear = new Date(now.getFullYear() - 1, 5, 15, 10, 30);
      const result = formatDate(dateLastYear, {
        i18n: zhCN,
        relativeTimeThreshold: null
      });
      expect(result).toMatch(/^\d{2}-/);
    });
  });

  describe('combined options', () => {
    it('should handle all options together for previous year', () => {
      const date = new Date('2025-06-15T14:30:00');
      const result = formatDate(date, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        showTime: false,
        omitYearThisYear: true,
        shortYear: true
      });
      expect(result).toBe('25-06-15');
    });

    it('should handle previous year with all options', () => {
      const now = new Date();
      const dateLastYear = new Date(now.getFullYear() - 1, 11, 25, 20, 0);
      const result = formatDate(dateLastYear, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        showTime: true,
        omitYearThisYear: true,
        shortYear: true
      });
      expect(result).toMatch(/^\d{2}-12-25 20:00$/);
    });

    it('should handle this year with showTime false', () => {
      const now = new Date();
      const dateThisYear = new Date(now.getFullYear(), 6, 15, 14, 30);
      const result = formatDate(dateThisYear, {
        i18n: zhCN,
        relativeTimeThreshold: null,
        showTime: false,
        omitYearThisYear: true
      });
      expect(result).toBe('07-15');
    });
  });
});
