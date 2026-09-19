import { h } from '../lib/dom.js';
import { svg } from './icons.js';

// A checkbox group filter block: renders a heading + grid of checkboxes.
// `state` is a Set of selected values, mutated in place; onChange fires after each toggle.
export function CheckboxGroup(title, options, state, onChange) {
  const grid = h('div', { class: 'check-grid' }, options.map((opt) => {
    const id = `cb_${title}_${opt}`.replace(/\s+/g, '_');
    const input = h('input', {
      type: 'checkbox', id, checked: state.has(opt),
      onChange: (e) => {
        if (e.target.checked) state.add(opt); else state.delete(opt);
        onChange();
      },
    });
    return h('div', { class: 'checkbox-row' }, [input, h('label', { for: id }, opt)]);
  }));
  return h('div', { class: 'filter-group' }, [h('h4', {}, title), grid]);
}

export function RangeFilter(title, min, max, valueRef, onChange) {
  const label = h('div', { class: 'range-row' }, [h('span', {}, title), h('span', { class: 'val' }, `$${valueRef.value}`)]);
  const input = h('input', {
    type: 'range', min, max, value: valueRef.value, class: 'btn-block',
    onInput: (e) => {
      valueRef.value = Number(e.target.value);
      label.querySelector('.val').textContent = `$${valueRef.value}`;
      onChange();
    },
  });
  return h('div', { class: 'filter-group' }, [label, input]);
}

export function SearchBar(placeholder, valueRef, onChange) {
  const input = h('input', {
    type: 'text', placeholder, value: valueRef.value || '',
    onInput: (e) => { valueRef.value = e.target.value; onChange(); },
  });
  return h('div', { class: 'searchbar' }, [h('span', { html: svg('search') }), input]);
}

export function SortSelect(options, valueRef, onChange) {
  const select = h('select', {
    class: 'sort-select',
    onChange: (e) => { valueRef.value = e.target.value; onChange(); },
  }, options.map((o) => h('option', { value: o.value, selected: o.value === valueRef.value }, o.label)));
  return select;
}

export function FilterToggleButton(panelEl) {
  return h('button', {
    class: 'btn btn-outline btn-sm filter-toggle-btn',
    onClick: () => panelEl.classList.toggle('open'),
  }, [h('span', { html: svg('filter') }), ' Filters']);
}
