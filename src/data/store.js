// Centralized mock data / app state — a simple localStorage-backed store.
// Frontend-only prototype: no backend, but a single source of truth so
// search, profiles and creation pages all read/write the same data.

import { seedArtists, seedVenues, seedReviews } from './seed.js';

const KEY = 'setlist:v1';

function loadRaw() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupt storage, fall through to reseed */ }
  return null;
}

function seedState() {
  return {
    artists: seedArtists,
    venues: seedVenues,
    reviews: seedReviews,
    users: [
      { id: 'u1', email: 'artist@demo.com', password: 'password', name: 'Demo Artist Account', type: 'artist', linkedId: 'a1' },
      { id: 'u2', email: 'venue@demo.com', password: 'password', name: 'Demo Venue Account', type: 'venue', linkedId: 'v1' },
    ],
    bookings: [],
    session: null, // logged-in user id
  };
}

let state = loadRaw() || seedState();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable — continue in-memory */ }
}
persist();

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function notify() { listeners.forEach((fn) => fn(state)); }

function uid(prefix) { return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`; }

export const store = {
  getState() { return state; },

  // ---------- Artists ----------
  listArtists() { return state.artists; },
  getArtist(id) { return state.artists.find((a) => a.id === id) || null; },
  createArtist(data) {
    const artist = {
      id: uid('a'),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      ...data,
    };
    state.artists = [artist, ...state.artists];
    persist(); notify();
    return artist;
  },

  // ---------- Venues ----------
  listVenues() { return state.venues; },
  getVenue(id) { return state.venues.find((v) => v.id === id) || null; },
  createVenue(data) {
    const venue = { id: uid('v'), createdAt: new Date().toISOString(), ...data };
    state.venues = [venue, ...state.venues];
    persist(); notify();
    return venue;
  },

  // ---------- Reviews ----------
  listReviewsForArtist(artistId) { return state.reviews.filter((r) => r.artistId === artistId); },

  // ---------- Bookings ----------
  listBookings() { return state.bookings; },
  getBooking(id) { return state.bookings.find((b) => b.id === id) || null; },
  createBooking(data) {
    const booking = { id: uid('bk'), status: 'pending', createdAt: new Date().toISOString(), ...data };
    state.bookings = [booking, ...state.bookings];
    persist(); notify();
    return booking;
  },
  updateBooking(id, patch) {
    state.bookings = state.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b));
    persist(); notify();
    return store.getBooking(id);
  },

  // ---------- Auth (mock/local) ----------
  login(email, password) {
    const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    state.session = user.id;
    persist(); notify();
    return { ok: true, user };
  },
  logout() { state.session = null; persist(); notify(); },
  currentUser() { return state.users.find((u) => u.id === state.session) || null; },
  registerUser({ email, password, name, type }) {
    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    const user = { id: uid('u'), email, password, name, type, linkedId: null };
    state.users = [...state.users, user];
    state.session = user.id;
    persist(); notify();
    return { ok: true, user };
  },
};

export function resetDemoData() {
  state = seedState();
  persist(); notify();
}
