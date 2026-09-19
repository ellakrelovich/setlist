import { h, formatMoney } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { Field, validateRequired } from '../components/form.js';
import { EmptyState } from '../components/cards.js';
import { svg } from '../components/icons.js';
import { store } from '../data/store.js';
import { setDraftBooking } from '../data/draft.js';
import { navigate } from '../lib/router.js';

export function BookingPage({ params }) {
  const artist = store.getArtist(params.id);
  if (!artist) {
    return Page(h('section', { class: 'section' }, h('div', { class: 'container' }, EmptyState('Artist not found'))));
  }

  const dateField = Field({ label: 'Event Date', name: 'date', required: true, options: artist.availability || [] });
  const venueField = Field({ label: 'Venue / Event Name', name: 'venue', required: true, placeholder: 'e.g. The Copper Room — Friday Night Live' });
  const detailsField = Field({ label: 'Event Details', name: 'details', textarea: true, required: true, placeholder: 'Set length, load-in time, expected audience size…' });
  const notesField = Field({ label: 'Message / Notes to the Artist', name: 'notes', textarea: true, placeholder: 'Anything else the artist should know?' });

  const estimatedHours = 2;
  const price = artist.rateUnit === 'hr' ? artist.priceRate * estimatedHours : artist.priceRate;

  const summary = h('div', { class: 'summary-card' }, [
    h('div', { class: 'summary-artist' }, [
      h('div', { class: 'thumb-sm', html: svg('music') }),
      h('div', {}, [h('div', { style: { fontWeight: 700 } }, artist.name), h('div', { class: 'meta', style: { color: 'var(--muted)' } }, `${artist.type} · ${artist.location}`)]),
    ]),
    h('div', { class: 'summary-row' }, [h('span', {}, artist.rateUnit === 'hr' ? `Rate (${estimatedHours} hrs est.)` : 'Flat rate'), h('span', {}, formatMoney(price))]),
    h('div', { class: 'summary-row' }, [h('span', {}, 'Service Fee'), h('span', {}, formatMoney(Math.round(price * 0.05)))]),
    h('div', { class: 'summary-row total' }, [h('span', {}, 'Estimated Total'), h('span', {}, formatMoney(price + Math.round(price * 0.05)))]),
  ]);

  const submitBtn = h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, 'Continue to Payment');
  const form = h('form', {
    onSubmit: (e) => {
      e.preventDefault();
      if (!validateRequired([dateField, venueField, detailsField])) return;
      setDraftBooking({
        artistId: artist.id,
        date: dateField.getValue(),
        venueName: venueField.getValue(),
        eventDetails: detailsField.getValue(),
        notes: notesField.getValue(),
        price: price + Math.round(price * 0.05),
        basePrice: price,
        fee: Math.round(price * 0.05),
      });
      navigate('/payment');
    },
  }, [
    h('h1', {}, `Book ${artist.name}`),
    h('p', { class: 'sub' }, 'Tell us about the event — we’ll take you to payment next.'),
    dateField.el,
    venueField.el,
    detailsField.el,
    notesField.el,
    submitBtn,
  ]);

  const body = h('section', { class: 'section', style: { paddingTop: '40px' } }, [
    h('div', { class: 'container booking-layout' }, [
      h('div', { class: 'form-card wide' }, form),
      summary,
    ]),
  ]);

  return Page(body);
}
