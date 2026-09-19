import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { Field, validateRequired, Banner } from '../components/form.js';
import { store } from '../data/store.js';
import { ARTIST_TYPES, GENRES } from '../data/seed.js';
import { navigate } from '../lib/router.js';
import { toast } from '../lib/dom.js';

export function CreateArtistPage() {
  const nameField = Field({ label: 'Band / Artist Name', name: 'name', required: true });
  const typeField = Field({ label: 'Artist Type', name: 'type', required: true, options: ARTIST_TYPES });
  const locationField = Field({ label: 'Location', name: 'location', required: true, placeholder: 'City, State' });
  const priceField = Field({ label: 'Starting Rate ($)', type: 'number', name: 'price', required: true, placeholder: '150' });
  const rateUnitField = Field({ label: 'Rate Unit', name: 'rateUnit', required: true, options: [{ value: 'hr', label: 'Per Hour' }, { value: 'show', label: 'Per Show' }] });
  const descriptionField = Field({ label: 'Description', name: 'description', textarea: true, required: true, placeholder: 'Tell venues about your sound and style.' });
  const membersField = Field({ label: 'Members (comma separated)', name: 'members', placeholder: 'Alex — Vocals, Jamie — Guitar' });
  const availabilityField = Field({ label: 'Available Dates (comma separated, YYYY-MM-DD)', name: 'availability', placeholder: '2026-11-01, 2026-11-08' });
  const websiteField = Field({ label: 'Website', name: 'website', placeholder: 'https://' });
  const instagramField = Field({ label: 'Instagram', name: 'instagram', placeholder: 'https://instagram.com/…' });
  const spotifyField = Field({ label: 'Spotify', name: 'spotify', placeholder: 'https://open.spotify.com/…' });

  const genreState = new Set();
  const genreGrid = h('div', { class: 'check-grid' }, GENRES.map((g) => {
    const id = `genre_${g}`;
    const input = h('input', { type: 'checkbox', id, onChange: (e) => { if (e.target.checked) genreState.add(g); else genreState.delete(g); } });
    return h('div', { class: 'checkbox-row' }, [input, h('label', { for: id }, g)]);
  }));

  const bannerHost = h('div');
  const submitBtn = h('button', { type: 'submit', class: 'btn btn-primary' }, 'Create Artist Profile');

  const form = h('form', {
    onSubmit: (e) => {
      e.preventDefault();
      bannerHost.innerHTML = '';
      const required = [nameField, typeField, locationField, priceField, rateUnitField, descriptionField];
      if (!validateRequired(required)) {
        bannerHost.appendChild(Banner('Please fill in all required fields.', 'error'));
        return;
      }
      const artist = store.createArtist({
        name: nameField.getValue(),
        type: typeField.getValue(),
        location: locationField.getValue(),
        priceRate: Number(priceField.getValue()) || 0,
        rateUnit: rateUnitField.getValue(),
        description: descriptionField.getValue(),
        genres: [...genreState],
        members: membersField.getValue() ? membersField.getValue().split(',').map((s) => s.trim()) : [],
        availability: availabilityField.getValue() ? availabilityField.getValue().split(',').map((s) => s.trim()) : ['2026-11-01'],
        social: {
          website: websiteField.getValue() || undefined,
          instagram: instagramField.getValue() || undefined,
          spotify: spotifyField.getValue() || undefined,
        },
      });
      toast('Artist profile created!', 'success');
      navigate(`/artist/${artist.id}`);
    },
  }, [
    bannerHost,
    h('div', { class: 'field-row' }, [nameField.el, typeField.el]),
    h('div', { class: 'field-row' }, [locationField.el, rateUnitField.el]),
    priceField.el,
    descriptionField.el,
    h('div', { class: 'field' }, [h('label', {}, 'Genres'), genreGrid]),
    membersField.el,
    availabilityField.el,
    h('div', { class: 'field-row' }, [websiteField.el, instagramField.el]),
    spotifyField.el,
    h('div', { class: 'form-actions' }, [submitBtn, h('a', { href: '#/talent', class: 'btn btn-ghost' }, 'Cancel')]),
  ]);

  const body = h('section', { class: 'form-page' }, [
    h('div', { class: 'container' }, h('div', { class: 'form-card wide' }, [
      h('h1', {}, 'Create Artist / Band Profile'),
      h('p', { class: 'sub' }, 'Add your act to Setlist so venues can find and book you.'),
      form,
    ])),
  ]);

  return Page(body);
}
