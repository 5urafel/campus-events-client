import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import {
  useEventsStore,
  useFilterStore,
  useModalStore,
  selectFilteredEvents,
} from './store';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { EventCard } from './components/EventCard';
import { EventDetailsModal } from './components/EventDetailsModal';
import { EventFormModal } from './components/EventFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/Toast';

export const App: React.FC = () => {
  // Store hooks
  const { events, isLoading, isBackendOnline, loadEvents } = useEventsStore();
  const filterState = useFilterStore();
  const { viewMode, resetFilters } = filterState;
  const openCreate = useModalStore((state) => state.openCreate);

  // Initialize event data on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Derive filtered events using store selector
  const filteredEvents = useMemo(() => {
    return selectFilteredEvents(events, {
      searchQuery: filterState.searchQuery,
      timeFrame: filterState.timeFrame,
      sortBy: filterState.sortBy,
      selectedOrganizer: filterState.selectedOrganizer,
      selectedTag: filterState.selectedTag,
    });
  }, [events, filterState]);

  const hasActiveFilters = Boolean(
    filterState.searchQuery ||
      filterState.selectedTag ||
      filterState.timeFrame !== 'all' ||
      filterState.selectedOrganizer
  );

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Backend offline helper banner */}
        {isBackendOnline === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-semibold">
                  NestJS Backend is not running on port 3000.
                </span>
                <span className="text-amber-700 ml-1 hidden sm:inline">
                  Preview mode active with sample data. To connect live:
                </span>
                <div className="text-[11px] font-mono text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded mt-1 inline-block">
                  npm run start --prefix campus-events-server
                </div>
              </div>
            </div>

            <button
              onClick={() => loadEvents(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-xs transition-colors shrink-0"
            >
              Retry Connection
            </button>
          </motion.div>
        )}

        {/* Hero Section */}
        <HeroSection />

        {/* Filter & View Controls */}
        <FilterBar totalResults={filteredEvents.length} />

        {/* Events View */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 animate-pulse space-y-4"
              >
                <div className="h-6 bg-slate-200 rounded-lg w-1/3" />
                <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
                <div className="h-16 bg-slate-100 rounded-2xl" />
                <div className="h-8 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-3.5'
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto my-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No matching events found
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              We couldn't find any campus events matching your active filters or
              search terms.
            </p>
            <div className="flex items-center justify-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={openCreate}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
              >
                Create Event
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Campus Events Hub</span>
            <span>•</span>
            <span>Clean, Responsive & Interactive React App</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by React 18, Zustand, Tailwind CSS & Framer Motion</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EventDetailsModal />
      <EventFormModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default App;
