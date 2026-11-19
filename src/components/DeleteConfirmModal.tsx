import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useEventsStore, useModalStore, useToastStore } from '../store';

export const DeleteConfirmModal: React.FC = () => {
  const { deleteModalEvent, closeDeleteConfirm, isDeleting, setIsDeleting } = useModalStore();
  const deleteEvent = useEventsStore((state) => state.deleteEvent);
  const addToast = useToastStore((state) => state.addToast);

  if (!deleteModalEvent) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(deleteModalEvent.id);
      closeDeleteConfirm();
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDeleteConfirm}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Delete Campus Event?
          </h3>

          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-slate-900">"{deleteModalEvent.title}"</strong>?
            This will also remove all {deleteModalEvent.sessions?.length || 0} associated session schedules. This action cannot be undone.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={closeDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Event</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
