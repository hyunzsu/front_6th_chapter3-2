import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2025-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};

export const setupMockHandlerRepeatCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events-list', async ({ request }) => {
      const { events: requestEvents } = (await request.json()) as { events: Event[] };
      const repeatId = String(mockEvents.length + 1);
      const newEvents = requestEvents.map((event, index) => {
        const isRepeatEvent = event.repeat.type !== 'none';
        return {
          ...event,
          id: String(mockEvents.length + index + 1),
          repeat: {
            ...event.repeat,
            id: isRepeatEvent ? repeatId : undefined,
          },
        };
      });

      mockEvents.push(...newEvents);

      return HttpResponse.json(newEvents, { status: 201 });
    })
  );
};

export const setupMockHandlerRepeatUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '매일 스탠드업',
      date: '2025-10-16',
      startTime: '10:30',
      endTime: '11:00',
      description: '매일 스탠드업 미팅',
      location: '온라인',
      category: '업무',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2025-11-30',
      },
      notificationTime: 1,
    },
    {
      id: '2',
      title: '매주 팀 회의',
      date: '2025-10-22',
      startTime: '09:00',
      endTime: '10:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-31',
      },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events-list', async ({ request }) => {
      const { events: requestEvents } = (await request.json()) as { events: Event[] };
      let isUpdated = false;

      const newEvents = [...mockEvents];
      requestEvents.forEach((event) => {
        const index = mockEvents.findIndex((target) => target.id === event.id);
        if (index !== -1) {
          isUpdated = true;
          newEvents[index] = { ...mockEvents[index], ...event };
        }
      });

      if (isUpdated) {
        mockEvents.splice(0, mockEvents.length, ...newEvents);
        return HttpResponse.json(newEvents, { status: 200 });
      }

      return new HttpResponse(null, { status: 404 });
    })
  );
};

export const setupMockHandlerRepeatDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제될 반복 이벤트 1',
      date: '2025-10-16',
      startTime: '10:30',
      endTime: '11:00',
      description: '삭제될 매일 스탠드업',
      location: '온라인',
      category: '업무',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2025-11-30',
      },
      notificationTime: 5,
    },
    {
      id: '2',
      title: '삭제될 반복 이벤트 2',
      date: '2025-10-22',
      startTime: '14:00',
      endTime: '15:00',
      description: '삭제될 주간 회의',
      location: '회의실 B',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-31',
      },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events-list', async ({ request }) => {
      const { eventIds } = (await request.json()) as { eventIds: string[] };
      const remainingEvents = mockEvents.filter((event) => !eventIds.includes(event.id));

      mockEvents.splice(0, mockEvents.length, ...remainingEvents);

      return new HttpResponse(null, { status: 204 });
    })
  );
};
