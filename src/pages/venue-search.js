import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { VenueCard, EmptyState, Pagination } from '../components/cards.js';
import { CheckboxGroup, RangeFilter, SearchBar, SortSelect, FilterToggleButton } from '../components/filters.js';
import { store } from '../data/store.js';
import { VENUE_TYPES, GENRES } from '../data/seed.js';

const PAGE_SIZE = 6;
const AMENITY_FIELDS = [
  ['accessibility', 'Accessible'],
  ['soundSystem', 'Sound System'],
  ['stage', 'Stage'],
  ['backline', 'Backline'],
  ['foodBeverage', 'Food / Beverage'],
];

export function VenueSearchPage() {
  const all = store.listVenues();
  const maxBudget = Math.max(...all.map((v) => v.budgetMax), 1000);
  const locations = [...new Set(all.map((v) => v.location))];

  const state = {
    query: { value: '' },
    types: new Set(),
    genres: new Set(),
    budget: { value: maxBudget },
    location: { value: '' },
    indoorOutdoor: { value: '' },
    ageRestriction: { value: '' },
    amenities: new Set(),
    minCapacity: { value: 0 },
    sort: { value: 'recommended' },
    page: 1,
  };

  const resultsEl = h('div');
  const toolbarCountEl = h('span', { class: 'count' });

  function applyFilters() {
    let list = all.filter((v) => {
      if (state.query.value) {
        const q = state.query.value.toLowerCase();
        if (!v.name.toLowerCase().includes(q) && !v.location.toLowerCase().includes(q)) return false;
      }
      if (state.types.size && !state.types.has(v.type)) return false;
      if (state.genres.size && !(v.genres || []).some((g) => state.genres.has(g))) return false;
      if (v.budgetMin > state.budget.value) return false;
      if (state.location.value && v.location !== state.location.value) return false;
      if (state.indoorOutdoor.value && v.indoorOutdoor !== state.indoorOutdoor.value) return false;
      if (state.ageRestriction.value && v.ageRestriction !== state.ageRestriction.value) return false;
      if (v.capacity < state.minCapacity.value) return false;
      for (const amenity of state.amenities) { if (!v[amenity]) return false; }
      return true;
    });
    if (state.sort.value === 'budget-asc') list = [...list].sort((a, b) => a.budgetMin - b.budgetMin);
    else if (state.sort.value === 'budget-desc') list = [...list].sort((a, b) => b.budgetMax - a.budgetMax);
    else if (state.sort.value === 'capacity') list = [...list].sort((a, b) => b.capacity - a.capacity);
    return list;
  }

  function renderResults() {
    const list = applyFilters();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    const pageItems = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

    toolbarCountEl.innerHTML = '';
    toolbarCountEl.append('Recommended Venues — ', h('strong', {}, `${list.length} result${list.length === 1 ? '' : 's'}`));

    resultsEl.innerHTML = '';
    if (!pageItems.length) {
      resultsEl.appendChild(EmptyState('No venues match your filters', 'Try widening your budget or clearing a filter.'));
      return;
    }
    resultsEl.appendChild(h('div', { class: 'card-grid' }, pageItems.map(VenueCard)));
    resultsEl.appendChild(Pagination(state.page, totalPages, (p) => { state.page = p; renderResults(); }));
  }

  const filtersPanel = h('div', { class: 'filters-panel' }, [
    h('h3', {}, 'Filters'),
    SearchBar('Search for a venue', state.query, () => { state.page = 1; renderResults(); }),
    RangeFilter('Budget (max)', 0, maxBudget, state.budget, () => { state.page = 1; renderResults(); }),
    CheckboxGroup('Venue Type', VENUE_TYPES, state.types, () => { state.page = 1; renderResults(); }),
    CheckboxGroup('Preferred Genres', GENRES, state.genres, () => { state.page = 1; renderResults(); }),
    h('div', { class: 'filter-group' }, [
      h('h4', {}, 'Location'),
      h('select', { onChange: (e) => { state.location.value = e.target.value; state.page = 1; renderResults(); } },
        [h('option', { value: '' }, 'All locations'), ...locations.map((l) => h('option', { value: l }, l))]),
    ]),
    h('div', { class: 'filter-group' }, [
      h('h4', {}, 'Indoor / Outdoor'),
      h('select', { onChange: (e) => { state.indoorOutdoor.value = e.target.value; state.page = 1; renderResults(); } },
        [h('option', { value: '' }, 'Any'), h('option', { value: 'Indoor' }, 'Indoor'), h('option', { value: 'Outdoor' }, 'Outdoor'), h('option', { value: 'Both' }, 'Both')]),
    ]),
    h('div', { class: 'filter-group' }, [
      h('h4', {}, 'Age Restriction'),
      h('select', { onChange: (e) => { state.ageRestriction.value = e.target.value; state.page = 1; renderResults(); } },
        [h('option', { value: '' }, 'Any'), h('option', { value: 'All ages' }, 'All ages'), h('option', { value: '18+' }, '18+'), h('option', { value: '21+' }, '21+')]),
    ]),
    h('div', { class: 'filter-group' }, [
      h('h4', {}, 'Minimum Capacity'),
      h('select', { onChange: (e) => { state.minCapacity.value = Number(e.target.value); state.page = 1; renderResults(); } },
        [0, 100, 250, 500, 1000].map((c) => h('option', { value: c }, c === 0 ? 'Any size' : `${c}+`))),
    ]),
    CheckboxGroup('Amenities', AMENITY_FIELDS.map(([, label]) => label), state.amenities, () => { }),
  ]);

  // Rewire amenity checkboxes to store field keys instead of labels, since venue objects use field keys.
  const amenityInputs = filtersPanel.querySelectorAll('.filter-group:last-child input[type=checkbox]');
  amenityInputs.forEach((input, i) => {
    const [field] = AMENITY_FIELDS[i];
    input.onchange = (e) => {
      if (e.target.checked) state.amenities.add(field); else state.amenities.delete(field);
      state.page = 1; renderResults();
    };
  });

  const toggleBtn = FilterToggleButton(filtersPanel);

  const toolbar = h('div', { class: 'results-toolbar' }, [
    toolbarCountEl,
    h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, [
      toggleBtn,
      SortSelect([
        { value: 'recommended', label: 'Recommended' },
        { value: 'budget-asc', label: 'Budget: Low to High' },
        { value: 'budget-desc', label: 'Budget: High to Low' },
        { value: 'capacity', label: 'Largest Capacity' },
      ], state.sort, () => renderResults()),
    ]),
  ]);

  renderResults();

  const heroSection = h('section', { class: 'search-hero' }, [
    h('div', { class: 'container' }, [
      h('div', { class: 'eyebrow' }, 'FIND YOUR NEXT STAGE'),
      h('h1', { class: 'display' }, 'Venue Search'),
    ]),
  ]);

  const body = h('section', {}, [
    h('div', { class: 'container search-layout' }, [
      filtersPanel,
      h('div', {}, [toolbar, resultsEl]),
    ]),
  ]);

  return Page(heroSection, body);
}
