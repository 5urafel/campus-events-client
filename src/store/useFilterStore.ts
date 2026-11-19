import { create } from 'zustand';
import { FilterTimeFrame, ViewMode, CampusEvent } from '../types';

interface FilterState {
  searchQuery: string;
  timeFrame: FilterTimeFrame;
  sortBy: 'date-asc' | 'date-desc' | 'title';
  viewMode: ViewMode;
  selectedOrganizer: string;
  selectedTag: string;

  // Actions
  setSearchQuery: (query: string) => void;
  setTimeFrame: (timeFrame: FilterTimeFrame) => void;
  setSortBy: (sortBy: 'date-asc' | 'date-desc' | 'title') => void;
  setViewMode: (viewMode: ViewMode) => void;
  setSelectedOrganizer: (organizer: string) => void;
  setSelectedTag: (tag: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  timeFrame: 'all',
  sortBy: 'date-asc',
  viewMode: 'grid',
  selectedOrganizer: '',
  selectedTag: '',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setTimeFrame: (timeFrame) => set({ timeFrame }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedOrganizer: (selectedOrganizer) => set({ selectedOrganizer }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  resetFilters: () =>
    set({
      searchQuery: '',
      timeFrame: 'all',
      selectedOrganizer: '',
      selectedTag: '',
    }),
}));

// Helper selector to filter events based on current filter state
export function selectFilteredEvents(
  events: CampusEvent[],
  filterState: {
    searchQuery: string;
    timeFrame: FilterTimeFrame;
    sortBy: 'date-asc' | 'date-desc' | 'title';
    selectedOrganizer: string;
    selectedTag: string;
  }
): CampusEvent[] {
  const {
    searchQuery,
    timeFrame,
    sortBy,
    selectedOrganizer,
    selectedTag,
  } = filterState;

  const today = new Date().toISOString().split('T')[0];

  return events
    .filter((ev) => {
      // Search text matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(q);
        const matchDesc = ev.description.toLowerCase().includes(q);
        const matchOrg = ev.organizer.toLowerCase().includes(q);
        const matchLoc = ev.location.toLowerCase().includes(q);
        const matchSpeaker = ev.sessions?.some(
          (s) =>
            s.speaker.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchDesc && !matchOrg && !matchLoc && !matchSpeaker) {
          return false;
        }
      }

      // Tag matching
      if (selectedTag) {
        const t = selectedTag.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(t);
        const matchDesc = ev.description.toLowerCase().includes(t);
        const matchOrg = ev.organizer.toLowerCase().includes(t);
        const matchSessions = ev.sessions?.some(
          (s) =>
            s.title.toLowerCase().includes(t) || s.description.toLowerCase().includes(t)
        );
        if (!matchTitle && !matchDesc && !matchOrg && !matchSessions) {
          return false;
        }
      }

      // Timeframe
      if (timeFrame === 'upcoming' && ev.date < today) return false;
      if (timeFrame === 'past' && ev.date >= today) return false;

      // Organizer
      if (selectedOrganizer && ev.organizer !== selectedOrganizer) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date-asc') {
        return a.date.localeCompare(b.date);
      }
      if (sortBy === 'date-desc') {
        return b.date.localeCompare(a.date);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
}
