import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Building,
  User,
  AlertCircle,
} from 'lucide-react';
import { CreateEventInput } from '../types';
import { useEventsStore, useModalStore } from '../store';

interface FormSession {
  id?: number;
  title: string;
  description: string;
  speaker: string;
  startTime: string;
  endTime: string;
}

export const EventFormModal: React.FC = () => {
  const { isFormOpen, editingEvent, closeForm } = useModalStore();
  const { createEvent, updateEvent } = useEventsStore();

  const isEditing = Boolean(editingEvent);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [sessions, setSessions] = useState<FormSession[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setDescription(editingEvent.description || '');
      setLocation(editingEvent.location || '');
      setDate(editingEvent.date ? editingEvent.date.split('T')[0] : '');
      setOrganizer(editingEvent.organizer || '');
      setSessions(
        editingEvent.sessions
          ? editingEvent.sessions.map((s) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              speaker: s.speaker,
              startTime: s.startTime,
              endTime: s.endTime,
            }))
          : []
      );
    } else {
      setTitle('');
      setDescription('');
      setLocation('');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setOrganizer('');
      setSessions([
        {
          title: 'Opening Remarks & Keynote',
          description: 'Welcome address and introduction.',
          speaker: '',
          startTime: '09:00',
          endTime: '10:00',
        },
      ]);
    }
    setErrors({});
  }, [editingEvent, isFormOpen]);

  if (!isFormOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Event title is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!location.trim()) errs.location = 'Location / venue is required';
    if (!date) errs.date = 'Date is required';
    if (!organizer.trim()) errs.organizer = 'Organizer is required';

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    sessions.forEach((s, idx) => {
      if (!s.title.trim()) {
        errs[`session_${idx}_title`] = 'Session title is required';
      }
      if (!s.speaker.trim()) {
        errs[`session_${idx}_speaker`] = 'Speaker is required';
      }
      if (!s.description.trim()) {
        errs[`session_${idx}_description`] = 'Session description is required';
      }
      if (!timeRegex.test(s.startTime)) {
        errs[`session_${idx}_startTime`] = 'Start time must be HH:mm (e.g. 09:30)';
      }
      if (!timeRegex.test(s.endTime)) {
        errs[`session_${idx}_endTime`] = 'End time must be HH:mm (e.g. 10:30)';
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSession = () => {
    const nextStart = sessions.length > 0 ? sessions[sessions.length - 1].endTime : '10:00';
    setSessions([
      ...sessions,
      {
        title: '',
        description: '',
        speaker: '',
        startTime: nextStart || '10:00',
        endTime: '11:00',
      },
    ]);
  };

  const handleRemoveSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const handleSessionChange = (
    index: number,
    field: keyof FormSession,
    value: string
  ) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    setSessions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateEventInput = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date,
        organizer: organizer.trim(),
        sessions: sessions.map((s, idx) => ({
          id: s.id ?? idx + 1,
          title: s.title.trim(),
          description: s.description.trim(),
          speaker: s.speaker.trim(),
          startTime: s.startTime.trim(),
          endTime: s.endTime.trim(),
        })),
      };

      if (isEditing && editingEvent) {
        await updateEvent(editingEvent.id, payload);
      } else {
        await createEvent(payload);
      }
      closeForm();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save event. Check backend.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeForm}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {isEditing ? 'Edit Campus Event' : 'Create New Campus Event'}
              </h3>
              <p className="text-xs text-indigo-100">
                {isEditing
                  ? 'Update event details and session timeline'
                  : 'Publish a new university lecture, workshop, or symposium'}
              </p>
            </div>
            <button
              onClick={closeForm}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {errors.form && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Annual AI & Robotics Summit 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white transition-all outline-none ${
                  errors.title
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                placeholder="Detail what attendees will learn, key activities, and prerequisites..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white transition-all outline-none ${
                  errors.description
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
              )}
            </div>

            {/* Location & Date & Organizer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Location / Room *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Science Auditorium"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-xs text-rose-500">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-xs text-rose-500">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Organizer *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Computer Science Dept"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
                {errors.organizer && (
                  <p className="mt-1 text-xs text-rose-500">{errors.organizer}</p>
                )}
              </div>
            </div>

            {/* Sessions Builder */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Sessions & Schedule
                  </h4>
                  <p className="text-xs text-slate-500">
                    Add breakdown sessions with speakers and HH:mm start/end times
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSession}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Session</span>
                </button>
              </div>

              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 relative group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700">
                        Session #{index + 1}
                      </span>
                      {sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(index)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                          title="Remove session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Session Title (e.g. Keynote Presentation)"
                          value={session.title}
                          onChange={(e) =>
                            handleSessionChange(index, 'title', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                        />
                        {errors[`session_${index}_title`] && (
                          <p className="text-[11px] text-rose-500 mt-0.5">
                            {errors[`session_${index}_title`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Speaker (e.g. Dr. Alex Mercer)"
                            value={session.speaker}
                            onChange={(e) =>
                              handleSessionChange(index, 'speaker', e.target.value)
                            }
                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                          />
                        </div>
                        {errors[`session_${index}_speaker`] && (
                          <p className="text-[11px] text-rose-500 mt-0.5">
                            {errors[`session_${index}_speaker`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Start Time (HH:mm)
                        </label>
                        <input
                          type="text"
                          placeholder="09:00"
                          value={session.startTime}
                          onChange={(e) =>
                            handleSessionChange(index, 'startTime', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                        />
                        {errors[`session_${index}_startTime`] && (
                          <p className="text-[10px] text-rose-500 mt-0.5">
                            {errors[`session_${index}_startTime`]}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          End Time (HH:mm)
                        </label>
                        <input
                          type="text"
                          placeholder="10:00"
                          value={session.endTime}
                          onChange={(e) =>
                            handleSessionChange(index, 'endTime', e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                        />
                        {errors[`session_${index}_endTime`] && (
                          <p className="text-[10px] text-rose-500 mt-0.5">
                            {errors[`session_${index}_endTime`]}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-1 flex items-end">
                        <span className="text-[11px] text-slate-400 pb-2">
                          Duration format 24-hr
                        </span>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Short summary of this session's topic..."
                        value={session.description}
                        onChange={(e) =>
                          handleSessionChange(index, 'description', e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                      />
                      {errors[`session_${index}_description`] && (
                        <p className="text-[11px] text-rose-500 mt-0.5">
                          {errors[`session_${index}_description`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Save Changes' : 'Create Event'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
