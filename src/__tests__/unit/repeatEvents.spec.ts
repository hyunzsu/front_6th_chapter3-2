import { Event, RepeatType } from '../../types';
import {
  generateRepeatEvents,
  generateDailyRepeatEvents,
  generateWeeklyRepeatEvents,
  generateMonthlyRepeatEvents,
  generateYearlyRepeatEvents,
} from '../../utils/repeatEvents';

describe('generateRepeatEvents - Individual Functions', () => {
  const baseEvent: Event = {
    id: 'test-id',
    title: '테스트 이벤트',
    date: '2025-01-31',
    startTime: '10:00',
    endTime: '11:00',
    description: '테스트 설명',
    location: '테스트 장소',
    category: '테스트',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  describe('generateDailyRepeatEvents', () => {
    it('매일 반복 (interval: 1) - 기본 케이스', () => {
      const event = { ...baseEvent, date: '2025-01-01' };
      const result = generateDailyRepeatEvents(event, {
        type: 'daily',
        interval: 1,
        endDate: '2025-01-03',
      });

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-02');
      expect(result[2].date).toBe('2025-01-03');

      // 다른 속성들이 유지되는지 확인
      expect(result[0].title).toBe('테스트 이벤트');
      expect(result[0].startTime).toBe('10:00');
    });

    it('격일 반복 (interval: 2)', () => {
      const event = { ...baseEvent, date: '2025-01-01' };
      const result = generateDailyRepeatEvents(event, {
        type: 'daily',
        interval: 2,
        endDate: '2025-01-07',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-03');
      expect(result[2].date).toBe('2025-01-05');
      expect(result[3].date).toBe('2025-01-07');
    });

    it('월 경계를 넘나드는 경우', () => {
      const event = { ...baseEvent, date: '2025-01-30' };
      const result = generateDailyRepeatEvents(event, {
        type: 'daily',
        interval: 2,
        endDate: '2025-02-05',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-30');
      expect(result[1].date).toBe('2025-02-01');
      expect(result[2].date).toBe('2025-02-03');
      expect(result[3].date).toBe('2025-02-05');
    });

    it('윤년 처리 - 2월 28일에서 시작', () => {
      const event = { ...baseEvent, date: '2024-02-28' };
      const result = generateDailyRepeatEvents(event, {
        type: 'daily',
        interval: 1,
        endDate: '2024-03-02',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2024-02-28');
      expect(result[1].date).toBe('2024-02-29'); // 윤년의 29일
      expect(result[2].date).toBe('2024-03-01');
      expect(result[3].date).toBe('2024-03-02');
    });
  });

  describe('generateWeeklyRepeatEvents', () => {
    it('매주 반복 (interval: 1) - 기본 케이스', () => {
      const event = { ...baseEvent, date: '2025-01-01' };
      const result = generateWeeklyRepeatEvents(event, {
        type: 'weekly',
        interval: 1,
        endDate: '2025-01-22',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-08');
      expect(result[2].date).toBe('2025-01-15');
      expect(result[3].date).toBe('2025-01-22');
    });

    it('격주 반복 (interval: 2)', () => {
      const event = { ...baseEvent, date: '2025-01-01' };
      const result = generateWeeklyRepeatEvents(event, {
        type: 'weekly',
        interval: 2,
        endDate: '2025-02-12',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-15');
      expect(result[2].date).toBe('2025-01-29');
      expect(result[3].date).toBe('2025-02-12');
    });

    it('연도 경계를 넘나드는 경우', () => {
      const event = { ...baseEvent, date: '2024-12-25' };
      const result = generateWeeklyRepeatEvents(event, {
        type: 'weekly',
        interval: 1,
        endDate: '2025-01-15',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2024-12-25');
      expect(result[1].date).toBe('2025-01-01');
      expect(result[2].date).toBe('2025-01-08');
      expect(result[3].date).toBe('2025-01-15');
    });
  });

  describe('generateMonthlyRepeatEvents', () => {
    it('매월 반복 (interval: 1) - 기본 케이스', () => {
      const event = { ...baseEvent, date: '2025-01-15' };
      const result = generateMonthlyRepeatEvents(event, {
        type: 'monthly',
        interval: 1,
        endDate: '2025-04-15',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-15');
      expect(result[1].date).toBe('2025-02-15');
      expect(result[2].date).toBe('2025-03-15');
      expect(result[3].date).toBe('2025-04-15');
    });

    it('격월 반복 (interval: 2)', () => {
      const event = { ...baseEvent, date: '2025-01-15' };
      const result = generateMonthlyRepeatEvents(event, {
        type: 'monthly',
        interval: 2,
        endDate: '2025-07-15',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-15');
      expect(result[1].date).toBe('2025-03-15');
      expect(result[2].date).toBe('2025-05-15');
      expect(result[3].date).toBe('2025-07-15');
    });

    it('31일 매월 반복 - 31일이 없는 달은 스킵', () => {
      const event = { ...baseEvent, date: '2025-01-31' };
      const result = generateMonthlyRepeatEvents(event, {
        type: 'monthly',
        interval: 1,
        endDate: '2025-05-31',
      });

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-31');
      expect(result[1].date).toBe('2025-03-31');
      expect(result[2].date).toBe('2025-05-31');
    });

    it('30일 매월 반복 - 30일이 없는 달은 스킵', () => {
      const event = { ...baseEvent, date: '2025-01-30' };
      const result = generateMonthlyRepeatEvents(event, {
        type: 'monthly',
        interval: 1,
        endDate: '2025-04-30',
      });

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-01-30');
      expect(result[1].date).toBe('2025-03-30');
      expect(result[2].date).toBe('2025-04-30');
    });
  });

  describe('generateYearlyRepeatEvents', () => {
    it('매년 반복 (interval: 1) - 기본 케이스', () => {
      const event = { ...baseEvent, date: '2025-03-15' };
      const result = generateYearlyRepeatEvents(event, {
        type: 'yearly',
        interval: 1,
        endDate: '2028-03-15',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-03-15');
      expect(result[1].date).toBe('2026-03-15');
      expect(result[2].date).toBe('2027-03-15');
      expect(result[3].date).toBe('2028-03-15');
    });

    it('2년마다 반복 (interval: 2)', () => {
      const event = { ...baseEvent, date: '2025-01-01' };
      const result = generateYearlyRepeatEvents(event, {
        type: 'yearly',
        interval: 2,
        endDate: '2031-01-01',
      });

      expect(result).toHaveLength(4);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2027-01-01');
      expect(result[2].date).toBe('2029-01-01');
      expect(result[3].date).toBe('2031-01-01');
    });

    it('윤년 2월 29일 매년 반복 - 평년은 스킵', () => {
      const event = { ...baseEvent, date: '2024-02-29' }; // 윤년
      const result = generateYearlyRepeatEvents(event, {
        type: 'yearly',
        interval: 1,
        endDate: '2030-02-29',
      });

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2024-02-29');
      expect(result[1].date).toBe('2028-02-29');
    });

    it('4년 간격 윤년 반복', () => {
      const event = { ...baseEvent, date: '2024-02-29' };
      const result = generateYearlyRepeatEvents(event, {
        type: 'yearly',
        interval: 4,
        endDate: '2032-02-29',
      });

      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2024-02-29');
      expect(result[1].date).toBe('2028-02-29');
      expect(result[2].date).toBe('2032-02-29');
    });
  });
});

describe('generateRepeatEvents - Integration Tests', () => {
  const baseEvent: Event = {
    id: 'integration-test',
    title: '통합 테스트',
    date: '2025-01-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  it('올바른 타입별 함수 호출 - daily', () => {
    const result = generateRepeatEvents(baseEvent, {
      type: 'daily',
      interval: 1,
      endDate: '2025-01-03',
    });

    expect(result).toHaveLength(3);
    expect(result![0].date).toBe('2025-01-01');
  });

  it('올바른 타입별 함수 호출 - weekly', () => {
    const result = generateRepeatEvents(baseEvent, {
      type: 'weekly',
      interval: 1,
      endDate: '2025-01-15',
    });

    expect(result).toHaveLength(3);
    expect(result![1].date).toBe('2025-01-08');
  });

  it('올바른 타입별 함수 호출 - monthly', () => {
    const result = generateRepeatEvents(baseEvent, {
      type: 'monthly',
      interval: 1,
      endDate: '2025-03-01',
    });

    expect(result).toHaveLength(3);
    expect(result![1].date).toBe('2025-02-01');
  });

  it('올바른 타입별 함수 호출 - yearly', () => {
    const result = generateRepeatEvents(baseEvent, {
      type: 'yearly',
      interval: 1,
      endDate: '2027-01-01',
    });

    expect(result).toHaveLength(3);
    expect(result![1].date).toBe('2026-01-01');
  });

  it('endDate가 없으면 undefined 반환', () => {
    const result = generateRepeatEvents(baseEvent, {
      type: 'daily',
      interval: 1,
      endDate: undefined,
    });

    expect(result).toBeUndefined();
  });

  it('none 타입 처리', () => {
    const result = generateRepeatEvents(baseEvent, {
      type: 'none',
      interval: 0,
      endDate: '2025-12-31',
    });

    expect(result).toEqual([baseEvent]);
  });

  it('잘못된 타입에 대한 처리', () => {
    const result = generateRepeatEvents(baseEvent, {
      type: 'invalid' as RepeatType,
      interval: 1,
      endDate: '2025-12-31',
    });

    expect(result).toBeUndefined();
  });
});

describe('generateRepeatEvents - Edge Cases', () => {
  const baseEvent: Event = {
    id: 'edge-test',
    title: '엣지 케이스',
    date: '2025-01-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  it('시작일이 종료일보다 늦은 경우', () => {
    const event = { ...baseEvent, date: '2025-01-10' };
    const result = generateRepeatEvents(event, {
      type: 'daily',
      interval: 1,
      endDate: '2025-01-05',
    });

    expect(result).toEqual([]);
  });

  it('시작일과 종료일이 같은 경우', () => {
    const event = { ...baseEvent, date: '2025-01-01' };
    const result = generateRepeatEvents(event, {
      type: 'daily',
      interval: 1,
      endDate: '2025-01-01',
    });

    expect(result).toHaveLength(1);
    expect(result![0].date).toBe('2025-01-01');
  });

  it('매우 큰 interval 값', () => {
    const event = { ...baseEvent, date: '2025-01-01' };
    const result = generateRepeatEvents(event, {
      type: 'yearly',
      interval: 100,
      endDate: '2200-01-01',
    });

    expect(result).toHaveLength(2);
    expect(result![0].date).toBe('2025-01-01');
    expect(result![1].date).toBe('2125-01-01');
  });
});
