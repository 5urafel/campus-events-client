import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useEventsStore } from '../store';

export const BackendStatusPill: React.FC = () => {
  const { isBackendOnline, isCheckingBackend, loadEvents } = useEventsStore();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
          isBackendOnline === true
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : isBackendOnline === false
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}
        title={
          isBackendOnline === true
            ? 'Backend connected on http://localhost:3000'
            : 'Backend not detected on :3000 (Showing preview mode)'
        }
      >
        <span className="relative flex h-2 w-2">
          {isBackendOnline === true && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isBackendOnline === true
                ? 'bg-emerald-500'
                : isBackendOnline === false
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`}
          />
        </span>
        <span className="hidden sm:inline">
          {isBackendOnline === true
            ? 'Backend Connected'
            : isBackendOnline === false
            ? 'Backend Offline'
            : 'Checking Backend'}
        </span>
        <span className="sm:hidden">
          {isBackendOnline === true ? 'Live' : 'Offline'}
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => loadEvents(true)}
        disabled={isCheckingBackend}
        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
        title="Check backend connection"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isCheckingBackend ? 'animate-spin' : ''}`} />
      </motion.button>
    </div>
  );
};
