import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { Field, validateRequired, Banner } from '../components/form.js';
import { store } from '../data/store.js';
import { VENUE_TYPES, GENRES } from '../data/seed.js';
import { navigate } from '../lib/router.js';
import { toast } from '../lib/dom.js';

export function CreateVenuePage() {
  const nameField = Field({ label: 'Venue Name', name: 'name', required: true });
  const typeField = Field({ label: 'Venue Type', name: 'type', required: true, options: VENUE_TYPES });
  const locationField = Field({ label: 'Location', name: 'location', required: true, placeholder: 'City, State' });
  const addressField = Field({ label: 'Address', name: 'address', required: true });
  const capacityField = Field({ label: 'Capacity', type: 'number', name: 'capacity', required: true, placeholder: '200' });
  const budgetMinField = Field({ label: 'Budget Min ($)', type: 'number', name: 'budgetMin', required: true, placeholder: '100' });
  const budgetMaxField = Field({ label: 'Budget Max ($)', type: 'number', name: 'budgetMax', required: true, placeholder: '500' });
  const descriptionField = Field({ label: 'Description', name: 'description', textarea: true, required: true });
  const indoorOutdoorField = Field({ label: 'Indoor / Outdoor', name: 'io', required: true, options: ['Indoor', 'Outdoor', 'Both'] });
  const ageField = Field({ label: 'Age Restriction', name: 'age', required: true, options: ['All ages', '18+', '21+'] });
  const availabilityField = Field({ label: 'Available Dates (comma separated, YYYY-MM-DD)', name: 'availability', placeholder: '2026-11-01, 2026-11-08' });
  const emailField = Field({ label: 'Contact Email', type: 'email', name: 'email', required: true });
  const phoneField = Field({ label: 'Contact Phone', name: 'phone' });
  const websiteField = Field({ label: 'Website', name: 'website', placeholder: 'https://' });

  const genreState = new Set();
  const genreGrid = h('div', { class: 'check-grid' }, GENRES.map((g) => {
    const id = `vgenre_${g}`;
    const input = h('input', { type: 'checkbox', id, onChange: (e) => { if (e.target.checked) genreState.add(g); else genreState.delete(g); } });
    return h('div', { class: 'checkbox-row' }, [input, h('label', { for: id }, g)]);
  }));

  const amenityFields = [
    ['accessibility', 'Accessible'], ['soundSystem', 'Sound System'], ['stage', 'Stage'],
    ['backline', 'Backline'], ['foodBeverage', 'Food / Beverage'],
  ];
  const amenityState = {};
  const amenityGrid = h('div', { class: 'check-grid' }, amenityFields.map(([key, label]) => {
    const id = `amenity_${key}`;
    const input = h('input', { type: 'checkbox', id, onChange: (e) => { amenityState[key] = e.target.checked; } });
    return h('div', { class: 'checkbox-row' }, [input, h('label', { for: id }, label)]);
  }));

  const bannerHost = h('div');
  const submitBtn = h('button', { type: 'submit', class: 'btn btn-primary' }, 'Create Venue Listing');

  const form = h('form', {
    onSubmit: (e) => {
      e.preventDefault();
      bannerHost.innerHTML = '';
      const required = [nameField, typeField, locationField, addressField, capacityField, budgetMinField, budgetMaxField, descriptionField, indoorOutdoorField, ageField, emailField];
      if (!validateRequired(required)) {
        bannerHost.appendChild(Banner('Please fill in all required fields.', 'error'));
        return;
      }
      const venue = store.createVenue({
        name: nameField.getValue(),
        type: typeField.getValue(),
        location: locationField.getValue(),
        address: addressField.getValue(),
        capacity: Number(capacityField.getValue()) || 0,
        budgetMin: Number(budgetMinField.getValue()) || 0,
        budgetMax: Number(budgetMaxField.getValue()) || 0,
        description: descriptionField.getValue(),
        indoorOutdoor: indoorOutdoorField.getValue(),
        ageRestriction: ageField.getValue(),
        genres: [...genreState],
        ...amenityState,
        availability: availabilityField.getValue() ? availabilityField.getValue().split(',').map((s) => s.trim()) : ['2026-11-01'],
        contact: { email: emailField.getValue(), phone: phoneField.getValue() },
        website: websiteField.getValue() || undefined,
        social: {},
      });
      toast('Venue listing created!', 'success');
      navigate(`/venue/${venue.id}`);
    },
  }, [
    bannerHost,
    h('div', { class: 'field-row' }, [nameField.el, typeField.el]),
    h('div', { class: 'field-row' }, [locationField.el, addressField.el]),
    h('div', { class: 'field-row' }, [capacityField.el, indoorOutdoorField.el]),
    h('div', { class: 'field-row' }, [budgetMinField.el, budgetMaxField.el]),
    descriptionField.el,
    ageField.el,
    h('div', { class: 'field' }, [h('label', {}, 'Preferred Genres'), genreGrid]),
    h('div', { class: 'field' }, [h('label', {}, 'Amenities'), amenityGrid]),
    availabilityField.el,
    h('div', { class: 'field-row' }, [emailField.el, phoneField.el]),
    websiteField.el,
    h('div', { class: 'form-actions' }, [submitBtn, h('a', { href: '#/venues', class: 'btn btn-ghost' }, 'Cancel')]),
  ]);

  const body = h('section', { class: 'form-page' }, [
    h('div', { class: 'container' }, h('div', { class: 'form-card wide' }, [
      h('h1', {}, 'Create Venue Listing'),
      h('p', { class: 'sub' }, 'Add your venue to Setlist so artists can find and book with you.'),
      form,
    ])),
  ]);

  return Page(body);
}
