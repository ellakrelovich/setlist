import { h, formatMoney } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { RatingStars, SocialLinks, EmptyState } from '../components/cards.js';
import { svg } from '../components/icons.js';
import { store } from '../data/store.js';
import { navigate } from '../lib/router.js';

export function ArtistProfilePage({ params }) {
  const artist = store.getArtist(params.id);
  if (!artist) {
    return Page(h('section', { class: 'section' }, h('div', { class: 'container' }, EmptyState('Artist not found', 'This profile may have been removed.'))));
  }
  const reviews = store.listReviewsForArtist(artist.id);

  let selectedDate = artist.availability?.[0] || '';

  const hero = h('section', { class: 'profile-hero' }, [
    h('div', { class: 'container grid' }, [
      h('div', { class: 'photo', html: svg('music') }),
      h('div', {}, [
        h('div', { class: 'eyebrow' }, `${artist.type.toUpperCase()} · ${artist.location.toUpperCase()}`),
        h('h1', { class: 'display' }, artist.name),
        h('div', { class: 'rate' }, `${formatMoney(artist.priceRate)}/${artist.rateUnit || 'hr'}`),
        h('p', { class: 'tagline' }, artist.description),
        h('label', { class: 'small-label' }, 'Choose Booking Date'),
        (() => {
          const select = h('select', {}, (artist.availability || []).map((d) => h('option', { value: d }, d)));
          select.onchange = (e) => { selectedDate = e.target.value; };
          return select;
        })(),
        h('a', {
          href: `#/booking/${artist.id}`,
          class: 'btn btn-primary btn-block',
        }, `Book ${artist.name.split(' ')[0] === artist.name ? artist.name : artist.type}`),
      ]),
    ]),
  ]);

  const aboutSection = h('section', { class: 'info-section section light' }, [
    h('div', { class: 'container two-col' }, [
      h('div', {}, [
        h('h2', { class: 'display' }, 'About the Act'),
        h('p', { class: 'body-copy' }, artist.description),
        h('h2', { class: 'display', style: { marginTop: '32px' } }, 'Members'),
        h('div', { class: 'members-list' }, (artist.members || []).map((m) => h('p', { class: 'body-copy' }, m))),
      ]),
      h('div', { class: 'image-block', html: svg('music') }),
    ]),
  ]);

  const ratingAvg = artist.reviewCount ? artist.rating : 0;
  const ratingsSection = h('section', { class: 'info-section section light' }, [
    h('div', { class: 'container', style: { maxWidth: '760px' } }, [
      h('h2', { class: 'display' }, 'Ratings & Reviews'),
      h('div', { class: 'rating-summary' }, [
        h('div', { class: 'score' }, ratingAvg ? ratingAvg.toFixed(1) : '—'),
        h('div', {}, [RatingStars(ratingAvg), h('div', { style: { color: '#666', fontSize: '0.9rem' } }, `${artist.reviewCount || 0} review${artist.reviewCount === 1 ? '' : 's'}`)]),
      ]),
      reviews.length
        ? h('div', {}, reviews.map((r) => h('div', { class: 'review-card' }, [
          h('div', { class: 'head' }, [
            h('span', {}, [h('span', { class: 'reviewer' }, r.reviewerName), h('span', { class: 'rtype' }, ` · ${r.reviewerType}`)]),
            h('span', { class: 'date' }, r.date),
          ]),
          RatingStars(r.rating),
          h('p', { class: 'body-copy', style: { marginTop: '6px' } }, r.text),
        ])))
        : EmptyState('No reviews yet', 'Be the first venue to leave a review after booking.'),
    ]),
  ]);

  const socialSection = h('section', { class: 'info-section section light' }, [
    h('div', { class: 'container', style: { maxWidth: '760px' } }, [
      h('h2', { class: 'display' }, 'Follow & Listen'),
      SocialLinks(artist.social),
    ]),
  ]);

  return Page(hero, aboutSection, ratingsSection, socialSection);
}
