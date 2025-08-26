import { Event } from '../../types';
import { generateRepeatEvents } from '../../utils/repeatEvents';

describe('generateRepeatEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2025-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'daily', interval: 1, endDate: '2025-07-03' },
      notificationTime: 1,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2025-07-01',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'weekly', interval: 2, endDate: '2025-09-01' },
      notificationTime: 1,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2025-07-02',
      startTime: '11:00',
      endTime: '12:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-09-02' },
      notificationTime: 1,
    },
    {
      id: '4',
      title: '이벤트 4',
      date: '2025-07-03',
      startTime: '13:00',
      endTime: '14:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'yearly', interval: 1, endDate: '2026-07-03' },
      notificationTime: 1,
    },
  ];

  it('매일 반복 시 연속된 날짜로 이벤트가 생성된다', () => {
    const result = generateRepeatEvents(events[0], {
      type: 'daily',
      interval: 1,
      endDate: '2025-07-03',
    });

    expect(result).toEqual([
      { ...events[0], date: '2025-07-01' },
      { ...events[0], date: '2025-07-02' },
      { ...events[0], date: '2025-07-03' },
    ]);
  });

  it('매주 반복 시 연속된 날짜로 이벤트가 생성된다', () => {
    const result = generateRepeatEvents(events[1], {
      type: 'weekly',
      interval: 2,
      endDate: '2025-09-01',
    });

    expect(result).toEqual([
      { ...events[1], date: '2025-07-01' },
      { ...events[1], date: '2025-07-15' },
      { ...events[1], date: '2025-07-29' },
      { ...events[1], date: '2025-08-12' },
      { ...events[1], date: '2025-08-26' },
    ]);
  });

  it('매월 반복 시 연속된 날짜로 이벤트가 생성된다', () => {
    const result = generateRepeatEvents(events[2], {
      type: 'monthly',
      interval: 1,
      endDate: '2025-09-02',
    });

    expect(result).toEqual([
      { ...events[2], date: '2025-07-02' },
      { ...events[2], date: '2025-08-02' },
      { ...events[2], date: '2025-09-02' },
    ]);
  });

  it('매년 반복 시 연속된 날짜로 이벤트가 생성된다', () => {
    const result = generateRepeatEvents(events[3], {
      type: 'yearly',
      interval: 1,
      endDate: '2026-07-03',
    });

    expect(result).toEqual([
      { ...events[3], date: '2025-07-03' },
      { ...events[3], date: '2026-07-03' },
    ]);
  });

  it.only('반복 종료 날짜가 없으면 이벤트가 생성되지 않는다', () => {
    const result = generateRepeatEvents(events[0], {
      type: 'daily',
      interval: 1,
      endDate: undefined,
    });

    expect(result).toBeUndefined();
  });
});
