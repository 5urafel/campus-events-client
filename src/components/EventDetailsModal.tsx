import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  Building,
  User,
  Clock,
  Share2,
  CalendarPlus,
} from 'lucide-react';
import { useModalStore, useToastStore } from '../store';

export const EventDetailsModal: React.FC = () => {
  const { detailsEvent, closeDetails, openEdit } = useModalStore();
  const addToast = useToastStore((state) => state.addToast);

  const [copiedShare, setCopiedShare] = useState(false);

  if (!detailsEvent) return null;

  const event = detailsEvent;
  const parsedDate = new Date(event.date);
  const formattedDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : event.date;

  const downloadIcs = () => {
    const cleanDate = event.date.replace(/-/g, '');
    const startTime = event.sessions?.[0]?.startTime?.replace(':', '') || '0900';
    const endTime =
      event.sessions?.[event.sessions.length - 1]?.endTime?.replace(':', '') ||
      '1700';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Campus Events Hub//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      `DTSTART:${cleanDate}T${startTime}00`,
      `DTEND:${cleanDate}T${endTime}00`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Calendar Exported', 'Downloaded .ics file for your calendar.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#event-${event.id}: ${event.title} on ${event.date}`
    );
    setCopiedShare(true);
    addToast('success', 'Link Copied', 'Event link copied to clipboard.');
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDetails}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white p-6 sm:p-8">
            <button
              onClick={closeDetails}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-indigo-100">
                <Calendar className="w-3.5 h-3.5 text-indigo-200" />
                {formattedDate}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-indigo-100">
                <MapPin className="w-3.5 h-3.5 text-indigo-200" />
                {event.location}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              {event.title}
            </h2>

            <div className="flex items-center gap-2 text-indigo-100 text-sm">
              <Building className="w-4 h-4 text-indigo-200" />
              <span>
                Organized by{' '}
                <strong className="text-white font-semibold">{event.organizer}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="px-6 sm:px-8 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={downloadIcs}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all shadow-xs"
                title="Download .ics for Google / Outlook / Apple Calendar"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Add to Calendar</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                closeDetails();
                openEdit(event);
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Edit this event
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About the Event
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {event.description}
              </p>
            </div>

            {/* Session Timeline */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Event Schedule & Sessions ({event.sessions?.length || 0})
                </h4>
                {event.sessions?.length > 0 && (
                  <span className="text-xs text-indigo-600 font-medium">
                    All times local campus time
                  </span>
                )}
              </div>

              {event.sessions && event.sessions.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                  {event.sessions.map((session, index) => (
                    <motion.div
                      key={session.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="relative bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-indigo-200 transition-all"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-[27px] top-4.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-600 shadow-xs" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          {session.startTime} - {session.endTime}
                        </span>

                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            Speaker: <strong>{session.speaker}</strong>
                          </span>
                        </div>
                      </div>

                      <h5 className="text-base font-bold text-slate-900 mb-1">
                        {session.title}
                      </h5>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {session.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                  No breakdown sessions defined for this event.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end">
            <button
              onClick={closeDetails}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
