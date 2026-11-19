import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { FilterTimeFrame } from '../types';
import { useEventsStore, useFilterStore } from '../store';

interface FilterBarProps {
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ totalResults }) => {
  const events = useEventsStore((state) => state.events);
  const {
    timeFrame,
    setTimeFrame,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedOrganizer,
    setSelectedOrganizer,
    selectedTag,
    searchQuery,
    resetFilters,
  } = useFilterStore();

  const organizers = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.organizer.trim()))).filter(Boolean);
  }, [events]);

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedTag ||
      timeFrame !== 'all' ||
      selectedOrganizer
  );

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm mb-6 transition-all">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left side: Timeframe Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
          {(
            [
              { key: 'all', label: 'All Events' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past' },
            ] as const
          ).map((tab) => {
            const isActive = timeFrame === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setTimeFrame(tab.key as FilterTimeFrame)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="timeframe-indicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Department select, Sort, View Toggle, Result count */}
        <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
          {/* Organizer Dropdown */}
          {organizers.length > 0 && (
            <div className="relative flex items-center">
              <select
                value={selectedOrganizer}
                onChange={(e) => setSelectedOrganizer(e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium pl-3 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
              >
                <option value="">All Organizers ({organizers.length})</option>
                {organizers.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'date-asc' | 'date-desc' | 'title')
              }
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium pl-3 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
            >
              <option value="date-asc">Date: Soonest First</option>
              <option value="date-desc">Date: Latest First</option>
              <option value="title">Title: A to Z</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2"
            >
              Reset
            </button>
          )}

          {/* Result counter */}
          <span className="text-xs text-slate-500 font-medium pl-1">
            {totalResults} {totalResults === 1 ? 'event' : 'events'}
          </span>
        </div>
      </div>
    </div>
  );
};
