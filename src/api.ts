import { CampusEvent, CreateEventInput, UpdateEventInput } from './types';

// Read base URL from Vite environment variables (.env)
const RAW_ENV_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

// In development, requests to /events are reverse-proxied by Vite to the target URL
// to avoid browser CORS blocks (since the NestJS backend has no CORS headers enabled).
// In production builds, requests go directly to the configured VITE_API_BASE_URL.
export const API_BASE_URL = RAW_ENV_URL || 'http://127.0.0.1:3000';
export const API_URL = import.meta.env.DEV
  ? '/events'
  : (RAW_ENV_URL ? `${RAW_ENV_URL}/events` : '/events');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * Check backend connectivity using Native Fetch API
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await window.fetch(API_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch all campus events using Native Fetch API
 */
export async function fetchEvents(): Promise<CampusEvent[]> {
  const res = await window.fetch(API_URL, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new ApiError(errText || `Failed to fetch events (${res.status})`, res.status);
  }
  return res.json();
}

/**
 * Fetch a single event by ID using Native Fetch API
 */
export async function fetchEventById(id: number): Promise<CampusEvent> {
  const res = await window.fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(`Event ${id} not found`, res.status);
  }
  return res.json();
}

/**
 * Create a new event using Native Fetch API (POST)
 */
export async function createEvent(data: CreateEventInput): Promise<CampusEvent> {
  const res = await window.fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = Array.isArray(errorBody?.message) 
      ? errorBody.message.join(', ')
      : errorBody?.message || `Failed to create event (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return res.json();
}

/**
 * Update an existing event using Native Fetch API (PATCH)
 */
export async function updateEvent(id: number, data: UpdateEventInput): Promise<CampusEvent> {
  const res = await window.fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = Array.isArray(errorBody?.message)
      ? errorBody.message.join(', ')
      : errorBody?.message || `Failed to update event (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return res.json();
}

/**
 * Delete an event using Native Fetch API (DELETE)
 */
export async function deleteEvent(id: number): Promise<{ deleted: boolean; id: number }> {
  const res = await window.fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(`Failed to delete event ${id}`, res.status);
  }
  return res.json();
}
