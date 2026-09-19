import { h, formatMoney } from '../lib/dom.js';
import { svg } from './icons.js';

export function ArtistCard(artist) {
  return h('a', { href: `#/artist/${artist.id}`, class: 'card', 'data-testid': 'artist-card' }, [
    h('div', { class: 'thumb', html: svg('music') }),
    h('div', { class: 'body' }, [
      h('div', { class: 'name' }, artist.name),
      h('div', { class: 'meta' }, `${artist.type} · ${artist.location}`),
      h('div', { class: 'price' }, `${formatMoney(artist.priceRate)}/${artist.rateUnit || 'hr'}`),
      h('div', { class: 'desc' }, artist.description),
      h('div', { class: 'tags' }, (artist.genres || []).slice(0, 3).map((g) => h('span', { class: 'tag' }, g))),
    ]),
  ]);
}

export function VenueCard(venue) {
  return h('a', { href: `#/venue/${venue.id}`, class: 'card', 'data-testid': 'venue-card' }, [
    h('div', { class: 'thumb', html: svg('building') }),
    h('div', { class: 'body' }, [
      h('div', { class: 'name' }, venue.name),
      h('div', { class: 'meta' }, `${venue.type} · ${venue.location}`),
      h('div', { class: 'meta' }, `Capacity ${venue.capacity} · ${formatMoney(venue.budgetMin)}–${formatMoney(venue.budgetMax)}`),
      h('div', { class: 'desc' }, venue.description),
      h('div', { class: 'tags' }, (venue.genres || []).slice(0, 3).map((g) => h('span', { class: 'tag' }, g))),
    ]),
  ]);
}

export function EmptyState(message, sub = '') {
  return h('div', { class: 'empty-state' }, [
    h('div', { class: 'icon' }, '♪'),
    h('h3', {}, message),
    sub ? h('p', {}, sub) : null,
  ]);
}

export function Pagination(page, totalPages, onChange) {
  if (totalPages <= 1) return h('div');
  return h('div', { class: 'pagination' }, [
    h('button', { disabled: page <= 1, onClick: () => onChange(page - 1) }, '← Prev'),
    h('span', {}, `Page ${page} of ${totalPages}`),
    h('button', { disabled: page >= totalPages, onClick: () => onChange(page + 1) }, 'Next →'),
  ]);
}

export function RatingStars(rating = 0) {
  const full = Math.round(rating);
  return h('span', { class: 'stars', 'aria-label': `${rating} out of 5 stars` }, '★'.repeat(full) + '☆'.repeat(5 - full));
}

export function SocialLinks(social = {}) {
  const map = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube', spotify: 'Spotify', website: 'Website' };
  const entries = Object.entries(social).filter(([, url]) => url);
  if (!entries.length) return h('div');
  return h('div', { class: 'social-links' }, entries.map(([key, url]) => h('a', {
    href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': map[key] || key,
  }, [h('span', { html: svg(key) }), map[key] || key])));
}
