import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CalendarDays, Users, Mic, Building2 } from 'lucide-react';
import { useEventsStore, useFilterStore } from '../store';

export const HeroSection: React.FC = () => {
  const events = useEventsStore((state) => state.events);
  const { selectedTag, setSelectedTag } = useFilterStore();

  const totalSessions = events.reduce((acc, ev) => acc + (ev.sessions?.length || 0), 0);
  const uniqueSpeakers = new Set(
    events.flatMap((ev) => ev.sessions?.map((s) => s.speaker.trim()) || [])
  ).size;
  const uniqueOrganizers = new Set(events.map((ev) => ev.organizer.trim())).size;

  const quickTags = ['All', 'Technology', 'Career', 'Workshop', 'AI', 'Innovation'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-2xl mb-8 border border-indigo-800/40">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-medium mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Spring 2026 Academic & Tech Calendar</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
        >
          Explore & Connect at <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-indigo-100">Campus Events</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal"
        >
          Join workshops, technical symposiums, career bootcamps, and inspiring guest lectures hosted by departments across the university.
        </motion.p>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
            <div className="flex items-center justify-center gap-2 text-indigo-300 mb-1">
              <CalendarDays className="w-4 h-4" />
              <span className="text-2xl font-bold text-white">{events.length}</span>
            </div>
            <p className="text-xs text-indigo-200/80 font-medium">Curated Events</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
            <div className="flex items-center justify-center gap-2 text-sky-300 mb-1">
              <Mic className="w-4 h-4" />
              <span className="text-2xl font-bold text-white">{totalSessions}</span>
            </div>
            <p className="text-xs text-sky-200/80 font-medium">Key Sessions</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
            <div className="flex items-center justify-center gap-2 text-emerald-300 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-2xl font-bold text-white">{uniqueSpeakers}</span>
            </div>
            <p className="text-xs text-emerald-200/80 font-medium">Distinguished Speakers</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
            <div className="flex items-center justify-center gap-2 text-amber-300 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-2xl font-bold text-white">{uniqueOrganizers}</span>
            </div>
            <p className="text-xs text-amber-200/80 font-medium">Departments</p>
          </div>
        </motion.div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Trending:</span>
          {quickTags.map((tag) => {
            const isSelected = (selectedTag || 'All') === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === 'All' ? '' : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/50'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
