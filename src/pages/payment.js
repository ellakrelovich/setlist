import { h, formatMoney, formatDate } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { Field, validateRequired } from '../components/form.js';
import { EmptyState } from '../components/cards.js';
import { svg } from '../components/icons.js';
import { store } from '../data/store.js';
import { getDraftBooking, clearDraftBooking } from '../data/draft.js';
import { navigate } from '../lib/router.js';

export function PaymentPage() {
  const draft = getDraftBooking();
  if (!draft) {
    return Page(h('section', { class: 'section' }, h('div', { class: 'container' }, EmptyState('No booking in progress', 'Start a booking from an artist’s profile first.'))));
  }
  const artist = store.getArtist(draft.artistId);

  const nameField = Field({ label: 'Name on Card', name: 'cardName', required: true });
  const cardField = Field({ label: 'Card Number', name: 'card', required: true, placeholder: '4242 4242 4242 4242' });
  const expField = Field({ label: 'Expiration (MM/YY)', name: 'exp', required: true, placeholder: '12/28' });
  const cvcField = Field({ label: 'CVC', name: 'cvc', required: true, placeholder: '123' });
  const billingField = Field({ label: 'Billing Address', name: 'billing', required: true, placeholder: '123 Main St, Denver, CO' });

  const submitBtn = h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, 'Confirm Payment & Booking');
  const resultHost = h('div');

  const form = h('form', {
    onSubmit: (e) => {
      e.preventDefault();
      if (!validateRequired([nameField, cardField, expField, cvcField, billingField])) return;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '';
      submitBtn.append(h('span', { class: 'spinner' }), ' Processing payment…');
      // Mock/local payment flow — structured so a real provider (Stripe, etc.)
      // could later replace this block without touching the surrounding UI.
      setTimeout(() => {
        const booking = store.createBooking({
          artistId: draft.artistId,
          venueName: draft.venueName,
          date: draft.date,
          eventDetails: draft.eventDetails,
          notes: draft.notes,
          price: draft.price,
          status: 'paid',
        });
        clearDraftBooking();
        showConfirmation(booking);
      }, 700);
    },
  }, [
    h('h1', {}, 'Payment & Checkout'),
    h('p', { class: 'sub' }, 'This is a mock checkout for the prototype — no real payment is processed.'),
    nameField.el,
    h('div', { class: 'field-row' }, [cardField.el, expField.el]),
    cvcField.el,
    billingField.el,
    submitBtn,
  ]);

  const summary = h('div', { class: 'summary-card' }, [
    h('div', { class: 'summary-artist' }, [
      h('div', { class: 'thumb-sm', html: svg('music') }),
      h('div', {}, [h('div', { style: { fontWeight: 700 } }, artist?.name || 'Artist'), h('div', { class: 'meta', style: { color: 'var(--muted)' } }, draft.venueName)]),
    ]),
    h('div', { class: 'summary-row' }, [h('span', {}, 'Event Date'), h('span', {}, formatDate(draft.date))]),
    h('div', { class: 'summary-row' }, [h('span', {}, 'Rate'), h('span', {}, formatMoney(draft.basePrice))]),
    h('div', { class: 'summary-row' }, [h('span', {}, 'Service Fee'), h('span', {}, formatMoney(draft.fee))]),
    h('div', { class: 'summary-row total' }, [h('span', {}, 'Total Due'), h('span', {}, formatMoney(draft.price))]),
  ]);

  const layout = h('div', { class: 'container booking-layout' }, [
    h('div', { class: 'form-card wide' }, form),
    summary,
  ]);
  const body = h('section', { class: 'section', style: { paddingTop: '40px' } }, layout);
  const page = Page(body);

  function showConfirmation(booking) {
    const main = page.querySelector('#main');
    main.innerHTML = '';
    main.appendChild(h('div', { class: 'confirmation' }, [
      h('div', { class: 'badge', html: svg('check') }),
      h('h1', {}, 'Booking Confirmed!'),
      h('p', {}, `Your booking with ${artist?.name || 'the artist'} for ${formatDate(booking.date)} is confirmed and paid. A confirmation has been sent to your email (prototype).`),
      h('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' } }, [
        h('a', { href: `#/artist/${artist?.id || ''}`, class: 'btn btn-outline' }, 'Back to Artist Profile'),
        h('a', { href: '#/talent', class: 'btn btn-primary' }, 'Find More Talent'),
      ]),
    ]));
  }

  return page;
}
