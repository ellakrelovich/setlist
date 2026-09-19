import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { svg } from '../components/icons.js';

export function AboutPage() {
  const hero = h('section', { class: 'hero', style: { paddingBottom: '48px' } }, [
    h('div', { class: 'container inner' }, [
      h('div', { class: 'eyebrow' }, 'OUR MISSION'),
      h('h1', { class: 'display' }, 'Connecting Rising Talent With Community Venues'),
    ]),
  ]);

  function block(kind, eyebrowText, title, paragraphs, reverse = false) {
    const text = h('div', {}, [
      h('h2', {}, title),
      ...paragraphs.map((p, i) => h('p', { style: { marginBottom: i === paragraphs.length - 1 ? 0 : '14px', fontWeight: i === paragraphs.length - 1 ? 700 : 400 } }, p)),
    ]);
    const art = h('div', { class: 'art', html: svg(kind === 'dark' ? 'music' : 'building') });
    return h('section', { class: `about-block ${kind}` }, [
      h('div', { class: 'container two-col' }, reverse ? [art, text] : [text, art]),
    ]);
  }

  const b1 = block('light', '', 'Booking Shouldn’t Be This Complicated', [
    'Endless DMs, lost emails, spreadsheets, and half-finished conversations across three different apps. We’ve been there.',
    'Setlist brings discovery, booking, and communication into one place so everyone can spend less time chasing down details and more time putting together great shows. Clear profiles, straightforward booking, and tools designed around how independent artists and venues actually work.',
  ]);

  const b2 = block('dark', '', 'Built for the Local Scene', [
    'Some of the best artists aren’t the ones with the biggest following. They’re the ones playing packed basements, opening weeknight bills, building a name one show at a time, and giving people a reason to come back.',
    'Artists can show venues who they are, what they sound like, and where they fit. Venues get a better way to find new talent beyond the same names and the same circles.',
  ], true);

  const b3 = block('light', '', 'Good Shows Start With the Right Connection', [
    'Setlist is a booking platform built for the people who make live music happen. Artists looking for the right rooms, venues looking for the right acts, and the communities that form around them.',
    'We’re here to make those connections easier.',
  ]);

  return Page(hero, b1, b2, b3);
}
