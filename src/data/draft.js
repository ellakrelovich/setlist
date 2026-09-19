// Holds the in-progress booking between the Booking page and the Payment
// page. Persisted to sessionStorage so a reload mid-flow doesn't lose it.
const KEY = 'setlist:draftBooking';

export function setDraftBooking(data) {
  sessionStorage.setItem(KEY, JSON.stringify(data));
}
export function getDraftBooking() {
  try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
}
export function clearDraftBooking() {
  sessionStorage.removeItem(KEY);
}
