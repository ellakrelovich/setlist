import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { ArtistCard, VenueCard } from '../components/cards.js';
import { store } from '../data/store.js';

export function HomePage() {
  const artists = store.listArtists().slice(0, 3);
  const venues = store.listVenues().slice(0, 3);

  const hero = h('section', { class: 'hero' }, [
    h('div', { class: 'container inner' }, [
      h('div', { class: 'eyebrow' }, ['MORE MUSIC', h('br'), 'STRONGER COMMUNITIES']),
      h('h1', { class: 'display' }, ['Connecting New Talent ', h('span', { class: 'accent' }, 'With Local Venues')]),
      h('p', { class: 'lead' }, 'Book gigs. Discover talent. Build your local music scene.'),
      h('div', { class: 'actions' }, [
        h('a', { href: '#/talent', class: 'btn btn-primary' }, 'Get Started'),
      ]),
    ]),
  ]);

  const splitHero = h('section', { class: 'split-hero', style: { borderBottom: '1px solid var(--border-dark)' } }, [
    h('div', { class: 'panel' }, [
      h('div', { class: 'eyebrow' }, 'FOR ARTISTS'),
      h('h3', { class: 'display' }, 'Find Your Next Gig'),
      h('p', {}, 'Create a profile, showcase your sound, and get booked at local venues.'),
      h('a', { href: '#/talent', class: 'btn btn-outline' }, 'Join as an Artist'),
    ]),
    h('div', { class: 'panel' }, [
      h('div', { class: 'eyebrow' }, 'FOR VENUES'),
      h('h3', { class: 'display' }, 'Fill Your Stage'),
      h('p', {}, 'Discover local talent, view availability, and book with ease.'),
      h('a', { href: '#/venues', class: 'btn btn-outline' }, 'Join as a Venue'),
    ]),
  ]);

  const howItWorks = h('section', { class: 'section light' }, [
    h('div', { class: 'container' }, [
      h('div', { class: 'eyebrow on-light', style: { textAlign: 'center', alignItems: 'center' } }, 'HOW IT WORKS'),
      h('div', { class: 'steps', style: { marginTop: '32px' } }, [
        h('div', {}, [h('div', { class: 'step-icon' }, '⌕'), h('h4', {}, '1. Discover'), h('p', {}, 'Find local artists or venues that fit your style.')]),
        h('div', {}, [h('div', { class: 'step-icon' }, '▣'), h('h4', {}, '2. Book'), h('p', {}, 'View availability and reserve a date.')]),
        h('div', {}, [h('div', { class: 'step-icon' }, '♫'), h('h4', {}, '3. Make It Happen'), h('p', {}, 'Get on stage and keep local music alive.')]),
      ]),
    ]),
  ]);

  const discoverArtists = h('section', { class: 'section dark' }, [
    h('div', { class: 'container' }, [
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' } }, [
        h('div', {}, [
          h('div', { class: 'eyebrow' }, 'TALENT DISCOVERY'),
          h('h2', { class: 'display', style: { fontSize: '2.2rem' } }, 'Fresh Acts Booking Now'),
        ]),
        h('a', { href: '#/talent', class: 'btn btn-outline' }, 'See All Artists'),
      ]),
      h('div', { class: 'card-grid' }, artists.map(ArtistCard)),
    ]),
  ]);

  const discoverVenues = h('section', { class: 'section alt' }, [
    h('div', { class: 'container' }, [
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' } }, [
        h('div', {}, [
          h('div', { class: 'eyebrow' }, 'VENUE DISCOVERY'),
          h('h2', { class: 'display', style: { fontSize: '2.2rem' } }, 'Stages Looking For Talent'),
        ]),
        h('a', { href: '#/venues', class: 'btn btn-outline' }, 'See All Venues'),
      ]),
      h('div', { class: 'card-grid' }, venues.map(VenueCard)),
    ]),
  ]);

  const community = h('section', { class: 'section light' }, [
    h('div', { class: 'container', style: { textAlign: 'center', maxWidth: '760px' } }, [
      h('div', { class: 'eyebrow on-light', style: { alignItems: 'center' } }, 'COMMUNITY'),
      h('h2', { class: 'display', style: { fontSize: '2rem', color: 'var(--ink)' } }, 'Local Music Doesn’t Book Itself'),
      h('p', { class: 'body-copy', style: { color: 'var(--body-copy)', fontSize: '1.1rem', marginTop: '12px' } }, 'Every gig booked on Setlist keeps a venue’s stage full and an artist’s calendar moving — and keeps the local scene alive.'),
    ]),
  ]);

  return Page(hero, splitHero, howItWorks, discoverArtists, discoverVenues, community);
}
