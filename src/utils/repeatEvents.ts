import { EventForm, RepeatInfo } from '../types';

export function generateDailyRepeatEvents(event: EventForm, repeatConfig: RepeatInfo): EventForm[] {
  const startDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: EventForm[] = [];

  while (startDate <= endDate) {
    events.push({
      ...event,
      // id: `${event.id}-${startDate.toISOString().split('T')[0]}`,
      date: startDate.toISOString().split('T')[0],
    });
    startDate.setDate(startDate.getDate() + repeatConfig.interval);
  }

  return events;
}

export function generateWeeklyRepeatEvents(
  event: EventForm,
  repeatConfig: RepeatInfo
): EventForm[] {
  const startDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: EventForm[] = [];

  while (startDate <= endDate) {
    events.push({
      ...event,
      date: startDate.toISOString().split('T')[0],
    });
    startDate.setDate(startDate.getDate() + 7 * repeatConfig.interval);
  }

  return events;
}

export function generateMonthlyRepeatEvents(
  event: EventForm,
  repeatConfig: RepeatInfo
): EventForm[] {
  const originalDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: EventForm[] = [];

  const originalDay = originalDate.getDate();
  let currentYear = originalDate.getFullYear();
  let currentMonth = originalDate.getMonth();

  // 종료 조건
  const maxYearsToCheck = endDate.getFullYear() - originalDate.getFullYear();

  while (currentYear <= originalDate.getFullYear() + maxYearsToCheck) {
    // 현재 월의 마지막 날 확인
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 원본 일자가 현재 월에 존재하는 경우만 이벤트 생성
    if (originalDay <= daysInCurrentMonth) {
      const currentDate = new Date(currentYear, currentMonth, originalDay);

      // 종료일을 넘으면 루프 종료
      if (currentDate > endDate) break;

      events.push({
        ...event,
        date: currentDate.toISOString().split('T')[0],
      });
    }

    // 다음 반복 월로 이동
    currentMonth += repeatConfig.interval;

    // 연도 경계 처리
    while (currentMonth >= 12) {
      currentYear++;
      currentMonth -= 12;
    }

    // 현재 월이 종료일보다 훨씬 뒤면 종료
    if (currentYear > endDate.getFullYear() + 1) break;
  }

  return events;
}

export function generateYearlyRepeatEvents(
  event: EventForm,
  repeatConfig: RepeatInfo
): EventForm[] {
  const originalDate = new Date(event.date);
  const endDate = new Date(repeatConfig.endDate!);
  const events: EventForm[] = [];

  const originalMonth = originalDate.getMonth();
  const originalDay = originalDate.getDate();
  let currentYear = originalDate.getFullYear();

  // 종료 조건
  while (currentYear <= endDate.getFullYear()) {
    // 현재 연도에 원본 날짜가 유효한지 확인 (윤년 처리)
    const currentDate = new Date(currentYear, originalMonth, originalDay);

    // 날짜가 유효한지 확인 (2월 29일이 평년에 설정되면 3월 1일이 됨)
    const isValidDate =
      currentDate.getMonth() === originalMonth && currentDate.getDate() === originalDay;

    if (isValidDate) {
      // 종료일을 넘으면 루프 종료
      if (currentDate > endDate) break;

      events.push({
        ...event,
        date: currentDate.toISOString().split('T')[0],
      });
    }

    // 다음 반복 연도로 이동
    currentYear += repeatConfig.interval;
  }

  return events;
}

export function generateRepeatEvents(
  event: EventForm,
  repeatConfig: RepeatInfo
): EventForm[] | undefined {
  if (!repeatConfig.endDate) {
    return undefined;
  }

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
    case 'none':
      return [event];
    default:
      return undefined;
  }
}
