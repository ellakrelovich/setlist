import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';

export function NotFoundPage() {
  return Page(h('section', { class: 'section', style: { textAlign: 'center' } }, [
    h('div', { class: 'container' }, [
      h('h1', { class: 'display', style: { fontSize: '4rem' } }, '404'),
      h('p', { style: { color: 'var(--dim)', marginBottom: '24px' } }, 'That page doesn’t exist.'),
      h('a', { href: '#/', class: 'btn btn-primary' }, 'Back Home'),
    ]),
  ]));
}
