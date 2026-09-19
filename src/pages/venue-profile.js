import { h, formatMoney } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { SocialLinks, EmptyState } from '../components/cards.js';
import { svg } from '../components/icons.js';
import { store } from '../data/store.js';

export function VenueProfilePage({ params }) {
  const venue = store.getVenue(params.id);
  if (!venue) {
    return Page(h('section', { class: 'section' }, h('div', { class: 'container' }, EmptyState('Venue not found', 'This listing may have been removed.'))));
  }

  const amenityLabels = [
    ['soundSystem', 'Sound System'], ['stage', 'Stage'], ['backline', 'Backline'],
    ['foodBeverage', 'Food & Beverage'], ['accessibility', 'Accessible'],
  ].filter(([key]) => venue[key]).map(([, label]) => label);

  const hero = h('section', { class: 'profile-hero' }, [
    h('div', { class: 'container grid' }, [
      h('div', { class: 'photo', html: svg('building') }),
      h('div', {}, [
        h('div', { class: 'eyebrow' }, `${venue.type.toUpperCase()} · ${venue.location.toUpperCase()}`),
        h('h1', { class: 'display' }, venue.name),
        h('div', { class: 'rate' }, `${formatMoney(venue.budgetMin)}–${formatMoney(venue.budgetMax)} budget`),
        h('p', { class: 'tagline' }, venue.description),
        h('a', { href: `#/talent`, class: 'btn btn-primary btn-block' }, 'Find an Artist for This Venue'),
      ]),
    ]),
  ]);

  const details = h('section', { class: 'info-section section light' }, [
    h('div', { class: 'container two-col' }, [
      h('div', {}, [
        h('h2', { class: 'display' }, 'Venue Details'),
        h('p', { class: 'body-copy' }, venue.address),
        h('p', { class: 'body-copy' }, `Capacity: ${venue.capacity} · ${venue.indoorOutdoor} · ${venue.ageRestriction}`),
        h('p', { class: 'body-copy' }, `Preferred genres: ${(venue.genres || []).join(', ') || 'Open to all'}`),
        h('h2', { class: 'display', style: { marginTop: '32px' } }, 'Amenities'),
        h('div', { class: 'tags', style: { marginTop: '8px' } }, amenityLabels.length ? amenityLabels.map((a) => h('span', { class: 'tag' }, a)) : [h('span', { class: 'meta' }, 'None listed')]),
      ]),
      h('div', { class: 'image-block', html: svg('building') }),
    ]),
  ]);

  const contactSection = h('section', { class: 'info-section section light' }, [
    h('div', { class: 'container', style: { maxWidth: '760px' } }, [
      h('h2', { class: 'display' }, 'Contact & Links'),
      h('p', { class: 'body-copy' }, venue.contact?.email || ''),
      h('p', { class: 'body-copy' }, venue.contact?.phone || ''),
      SocialLinks({ ...venue.social, website: venue.website }),
    ]),
  ]);

  return Page(hero, details, contactSection);
}
