import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Building,
  Clock,
  User,
  ChevronRight,
  Edit2,
  Trash2,
  Share2,
} from 'lucide-react';
import { CampusEvent } from '../types';
import { useFilterStore, useModalStore, useToastStore } from '../store';

interface EventCardProps {
  event: CampusEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const viewMode = useFilterStore((state) => state.viewMode);

  const openDetails = useModalStore((state) => state.openDetails);
  const openEdit = useModalStore((state) => state.openEdit);
  const openDeleteConfirm = useModalStore((state) => state.openDeleteConfirm);
  const addToast = useToastStore((state) => state.addToast);

  // Format date nicely
  const parsedDate = new Date(event.date);
  const isValidDate = !isNaN(parsedDate.getTime());
  const monthName = isValidDate
    ? parsedDate.toLocaleString('default', { month: 'short' }).toUpperCase()
    : 'DEC';
  const dayNumber = isValidDate ? parsedDate.getUTCDate() : '10';
  const fullDateFormatted = isValidDate
    ? parsedDate.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : event.date;

  const sessionCount = event.sessions?.length || 0;
  const speakers = Array.from(
    new Set(event.sessions?.map((s) => s.speaker).filter(Boolean) || [])
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/#event-${event.id}: ${event.title}`
      );
      addToast('success', 'Link Copied', `Sharable link for "${event.title}" copied!`);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        className="group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Date Badge */}
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-700 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <span className="text-[10px] font-extrabold tracking-wider uppercase">
              {monthName}
            </span>
            <span className="text-xl font-bold leading-tight">{dayNumber}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                <Building className="w-3 h-3 text-slate-400" />
                {event.organizer}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                <MapPin className="w-3 h-3 text-indigo-500" />
                {event.location}
              </span>
              {sessionCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                  <Clock className="w-3 h-3 text-emerald-500" />
                  {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
                </span>
              )}
            </div>

            <h3
              onClick={() => openDetails(event)}
              className="text-base font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer truncate transition-colors"
            >
              {event.title}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {event.description}
            </p>

            {speakers.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600">
                <User className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">Speakers:</span>
                <span className="text-[11px] text-slate-700 truncate">
                  {speakers.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
            title="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => openEdit(event)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
            title="Edit event"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => openDeleteConfirm(event)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => openDetails(event)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all ml-1"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid View (Default)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden"
    >
      {/* Card Header Banner with Accent Gradient */}
      <div className="relative bg-gradient-to-tr from-indigo-50 via-slate-50 to-sky-50 p-5 border-b border-slate-100 flex items-start justify-between">
        {/* Date Box */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-100 shadow-sm flex flex-col items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <span className="text-[10px] font-extrabold tracking-wider uppercase">
              {monthName}
            </span>
            <span className="text-lg font-bold leading-none">{dayNumber}</span>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>{fullDateFormatted}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[200px]">{event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Share Quick Button */}
        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-white/80 text-slate-400 hover:text-slate-700 hover:bg-white shadow-xs transition-all"
          title="Share event"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-medium mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate">{event.location}</span>
          </div>

          <h3
            onClick={() => openDetails(event)}
            className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors leading-snug line-clamp-2 mb-2"
          >
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Sessions Preview */}
          {sessionCount > 0 ? (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span className="flex items-center gap-1 text-indigo-600">
                  <Clock className="w-3.5 h-3.5" />
                  {sessionCount} {sessionCount === 1 ? 'Session' : 'Sessions'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {event.sessions[0].startTime} - {event.sessions[sessionCount - 1].endTime}
                </span>
              </div>

              {/* First session snippet */}
              <div className="text-xs text-slate-600 truncate font-medium">
                1. {event.sessions[0].title}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3 text-slate-400" />
                <span>{event.sessions[0].speaker}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/60 rounded-2xl p-2.5 border border-dashed border-slate-200 text-center text-xs text-slate-400 mb-4">
              General event (no detailed sessions)
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => openEdit(event)}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit Event"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => openDeleteConfirm(event)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => openDetails(event)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition-all"
          >
            <span>View Agenda</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
