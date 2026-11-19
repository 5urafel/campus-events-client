export interface EventSession {
  id: number;
  title: string;
  description: string;
  speaker: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
}

export interface CampusEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;       // YYYY-MM-DD
  organizer: string;
  sessions: EventSession[];
}

export type CreateEventInput = Omit<CampusEvent, 'id' | 'sessions'> & {
  sessions?: Array<Omit<EventSession, 'id'> & { id?: number }>;
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type FilterTimeFrame = 'all' | 'upcoming' | 'past';
export type ViewMode = 'grid' | 'list';
