import { h } from '../lib/dom.js';

// Builds a labeled field wrapper and returns { el, getValue, setError, input }.
export function Field({ label, type = 'text', name, required = false, placeholder = '', value = '', options = null, textarea = false, help = '' }) {
  const id = `f_${name}_${Math.random().toString(36).slice(2, 7)}`;
  let input;
  if (options) {
    input = h('select', { id, name }, [
      h('option', { value: '' }, placeholder || 'Select…'),
      ...options.map((o) => {
        const val = typeof o === 'string' ? o : o.value;
        const lbl = typeof o === 'string' ? o : o.label;
        return h('option', { value: val, selected: val === value }, lbl);
      }),
    ]);
    if (value) input.value = value;
  } else if (textarea) {
    input = h('textarea', { id, name, placeholder, rows: 4 });
    input.value = value || '';
  } else {
    input = h('input', { id, type, name, placeholder });
    input.value = value || '';
  }
  const errorEl = h('div', { class: 'error', style: { display: 'none' } });
  const wrap = h('div', { class: 'field' }, [
    h('label', { for: id }, [label, required ? h('span', { class: 'req' }, ' *') : null]),
    input,
    help ? h('div', { class: 'form-footnote', style: { textAlign: 'left', margin: '4px 0 0' } }, help) : null,
    errorEl,
  ]);
  return {
    el: wrap,
    input,
    getValue: () => input.value.trim(),
    setError(msg) {
      if (msg) {
        wrap.classList.add('has-error');
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
      } else {
        wrap.classList.remove('has-error');
        errorEl.style.display = 'none';
      }
    },
  };
}

export function Banner(message, kind = 'error') {
  return h('div', { class: `banner ${kind}` }, message);
}

export function validateRequired(fields) {
  let ok = true;
  fields.forEach((f) => {
    const val = f.input.type === 'checkbox' ? f.input.checked : f.getValue();
    if (!val) { f.setError('This field is required.'); ok = false; }
    else f.setError('');
  });
  return ok;
}
