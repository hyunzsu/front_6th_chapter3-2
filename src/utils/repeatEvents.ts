import { Event, RepeatInfo } from '../types';

function generateDailyRepeatEvents(event: Event, repeatConfig: RepeatInfo): Event[] {
  const startDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: Event[] = [];

  while (startDate <= endDate) {
    events.push({
      ...event,
      date: startDate.toISOString().split('T')[0],
    });
    startDate.setDate(startDate.getDate() + repeatConfig.interval);
  }

  return events;
}

function generateWeeklyRepeatEvents(event: Event, repeatConfig: RepeatInfo): Event[] {
  const startDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: Event[] = [];

  while (startDate <= endDate) {
    events.push({ ...event, date: startDate.toISOString().split('T')[0] });
    startDate.setDate(startDate.getDate() + 7 * repeatConfig.interval);
  }

  return events;
}

function generateMonthlyRepeatEvents(event: Event, repeatConfig: RepeatInfo): Event[] {
  const startDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: Event[] = [];

  while (startDate <= endDate) {
    events.push({ ...event, date: startDate.toISOString().split('T')[0] });
    startDate.setMonth(startDate.getMonth() + repeatConfig.interval);
  }

  return events;
}

function generateYearlyRepeatEvents(event: Event, repeatConfig: RepeatInfo): Event[] {
  const startDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: Event[] = [];

  while (startDate <= endDate) {
    events.push({ ...event, date: startDate.toISOString().split('T')[0] });
    startDate.setFullYear(startDate.getFullYear() + repeatConfig.interval);
  }

  return events;
}

export function generateRepeatEvents(event: Event, repeatConfig: RepeatInfo) {
  if (!repeatConfig.endDate) return undefined;

  const { type } = repeatConfig;

  switch (type) {
    case 'daily':
      return generateDailyRepeatEvents(event, repeatConfig);
    case 'weekly':
      return generateWeeklyRepeatEvents(event, repeatConfig);
    case 'monthly':
      return generateMonthlyRepeatEvents(event, repeatConfig);
    case 'yearly':
      return generateYearlyRepeatEvents(event, repeatConfig);
  }
}
