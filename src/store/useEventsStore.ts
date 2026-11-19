import { create } from 'zustand';
import { CampusEvent, CreateEventInput, UpdateEventInput } from '../types';
import * as api from '../api';
import { fallbackEvents } from '../mockData';
import { useToastStore } from './useToastStore';

interface EventsState {
  events: CampusEvent[];
  isLoading: boolean;
  isBackendOnline: boolean | null;
  isCheckingBackend: boolean;

  // Actions
  loadEvents: (isManualRefresh?: boolean) => Promise<void>;
  createEvent: (input: CreateEventInput) => Promise<CampusEvent>;
  updateEvent: (id: number, input: UpdateEventInput) => Promise<CampusEvent>;
  deleteEvent: (id: number) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  isLoading: true,
  isBackendOnline: null,
  isCheckingBackend: false,

  loadEvents: async (isManualRefresh = false) => {
    if (isManualRefresh) set({ isCheckingBackend: true });
    try {
      const data = await api.fetchEvents();
      set({
        events: data,
        isBackendOnline: true,
        isLoading: false,
        isCheckingBackend: false,
      });
      if (isManualRefresh) {
        useToastStore
          .getState()
          .addToast('success', 'Backend Connected', `Loaded ${data.length} events from NestJS`);
      }
    } catch (err: any) {
      console.warn('Backend currently unreachable, using fallback seed data:', err.message);
      set((state) => ({
        events: state.events.length > 0 ? state.events : fallbackEvents,
        isBackendOnline: false,
        isLoading: false,
        isCheckingBackend: false,
      }));
      if (isManualRefresh) {
        useToastStore
          .getState()
          .addToast(
            'error',
            'NestJS Backend Not Reachable',
            'Make sure backend is running on http://localhost:3000'
          );
      }
    }
  },

  createEvent: async (input: CreateEventInput) => {
    const { isBackendOnline, events } = get();
    if (isBackendOnline) {
      const created = await api.createEvent(input);
      set({ events: [...events, created] });
      useToastStore
        .getState()
        .addToast('success', 'Event Created', `"${created.title}" is now published.`);
      return created;
    } else {
      // Local fallback simulation
      const newId = Math.max(0, ...events.map((e) => e.id)) + 1;
      const created: CampusEvent = {
        id: newId,
        title: input.title,
        description: input.description,
        location: input.location,
        date: input.date,
        organizer: input.organizer,
        sessions: (input.sessions || []).map((s, idx) => ({
          id: s.id ?? idx + 1,
          title: s.title,
          description: s.description,
          speaker: s.speaker,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      };
      set({ events: [...events, created] });
      useToastStore
        .getState()
        .addToast('success', 'Event Created (Local)', `"${created.title}" added to active view.`);
      return created;
    }
  },

  updateEvent: async (id: number, input: UpdateEventInput) => {
    const { isBackendOnline, events } = get();
    if (isBackendOnline) {
      const updated = await api.updateEvent(id, input);
      set({
        events: events.map((e) => (e.id === id ? updated : e)),
      });
      useToastStore
        .getState()
        .addToast('success', 'Event Updated', `"${updated.title}" was successfully updated.`);
      return updated;
    } else {
      const current = events.find((e) => e.id === id);
      const updated: CampusEvent = {
        ...(current || {} as CampusEvent),
        ...input,
        id,
        sessions: (input.sessions || current?.sessions || []) as any,
      };
      set({
        events: events.map((e) => (e.id === id ? updated : e)),
      });
      useToastStore
        .getState()
        .addToast('success', 'Event Updated (Local)', `"${updated.title}" updated locally.`);
      return updated;
    }
  },

  deleteEvent: async (id: number) => {
    const { isBackendOnline, events } = get();
    const eventToDelete = events.find((e) => e.id === id);
    if (isBackendOnline) {
      await api.deleteEvent(id);
    }
    set({
      events: events.filter((e) => e.id !== id),
    });
    if (eventToDelete) {
      useToastStore
        .getState()
        .addToast('info', 'Event Deleted', `"${eventToDelete.title}" has been deleted.`);
    }
  },
}));
