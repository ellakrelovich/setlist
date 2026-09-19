import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { ArtistCard, EmptyState, Pagination } from '../components/cards.js';
import { CheckboxGroup, RangeFilter, SearchBar, SortSelect, FilterToggleButton } from '../components/filters.js';
import { store } from '../data/store.js';
import { ARTIST_TYPES, GENRES } from '../data/seed.js';

const PAGE_SIZE = 6;

export function TalentSearchPage() {
  const all = store.listArtists();
  const maxPrice = Math.max(...all.map((a) => a.priceRate), 400);
  const locations = [...new Set(all.map((a) => a.location))];

  const state = {
    query: { value: '' },
    types: new Set(),
    genres: new Set(),
    price: { value: maxPrice },
    location: { value: '' },
    sort: { value: 'recommended' },
    page: 1,
  };

  const resultsEl = h('div');
  const toolbarCountEl = h('span', { class: 'count' });

  function applyFilters() {
    let list = all.filter((a) => {
      if (state.query.value) {
        const q = state.query.value.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.location.toLowerCase().includes(q)) return false;
      }
      if (state.types.size && !state.types.has(a.type)) return false;
      if (state.genres.size && !(a.genres || []).some((g) => state.genres.has(g))) return false;
      if (a.priceRate > state.price.value) return false;
      if (state.location.value && a.location !== state.location.value) return false;
      return true;
    });
    if (state.sort.value === 'price-asc') list = [...list].sort((a, b) => a.priceRate - b.priceRate);
    else if (state.sort.value === 'price-desc') list = [...list].sort((a, b) => b.priceRate - a.priceRate);
    else if (state.sort.value === 'rating') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }

  function renderResults() {
    const list = applyFilters();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    const pageItems = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

    toolbarCountEl.innerHTML = '';
    toolbarCountEl.append('Recommended Artists — ', h('strong', {}, `${list.length} result${list.length === 1 ? '' : 's'}`));

    resultsEl.innerHTML = '';
    if (!pageItems.length) {
      resultsEl.appendChild(EmptyState('No artists match your filters', 'Try widening your price range or clearing a filter.'));
      return;
    }
    resultsEl.appendChild(h('div', { class: 'card-grid' }, pageItems.map(ArtistCard)));
    resultsEl.appendChild(Pagination(state.page, totalPages, (p) => { state.page = p; renderResults(); }));
  }

  const filtersPanel = h('div', { class: 'filters-panel' }, [
    h('h3', {}, 'Filters'),
    SearchBar('Search for a band or artist', state.query, () => { state.page = 1; renderResults(); }),
    RangeFilter('Price Range (max)', 0, maxPrice, state.price, () => { state.page = 1; renderResults(); }),
    CheckboxGroup('Artist Type', ARTIST_TYPES, state.types, () => { state.page = 1; renderResults(); }),
    CheckboxGroup('Genre', GENRES, state.genres, () => { state.page = 1; renderResults(); }),
    h('div', { class: 'filter-group' }, [
      h('h4', {}, 'Location'),
      h('select', {
        onChange: (e) => { state.location.value = e.target.value; state.page = 1; renderResults(); },
      }, [h('option', { value: '' }, 'All locations'), ...locations.map((l) => h('option', { value: l }, l))]),
    ]),
  ]);

  const toggleBtn = FilterToggleButton(filtersPanel);

  const toolbar = h('div', { class: 'results-toolbar' }, [
    toolbarCountEl,
    h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, [
      toggleBtn,
      SortSelect([
        { value: 'recommended', label: 'Recommended' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
      ], state.sort, () => renderResults()),
    ]),
  ]);

  renderResults();

  const heroSection = h('section', { class: 'search-hero' }, [
    h('div', { class: 'container' }, [
      h('div', { class: 'eyebrow' }, 'FIND YOUR NEXT GIG'),
      h('h1', { class: 'display' }, 'Talent Search'),
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
