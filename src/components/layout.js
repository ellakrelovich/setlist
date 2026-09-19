import { h } from '../lib/dom.js';
import { store } from '../data/store.js';
import { currentPath, navigate } from '../lib/router.js';

const NAV = [
  { label: 'Artists', path: '/talent' },
  { label: 'Venues', path: '/venues' },
  { label: 'About', path: '/about' },
];

export function Header() {
  const path = currentPath();
  const user = store.currentUser();

  const linkEls = NAV.map((item) => h('a', {
    href: `#${item.path}`,
    class: path.startsWith(item.path) ? 'active' : '',
  }, item.label));

  const mobileMenu = h('div', { class: 'mobile-menu' }, [
    ...NAV.map((item) => h('a', { href: `#${item.path}`, onClick: () => mobileMenu.classList.remove('open') }, item.label)),
    user
      ? h('button', { onClick: () => { store.logout(); navigate('/'); } }, 'Log Out')
      : h('a', { href: '#/login', onClick: () => mobileMenu.classList.remove('open') }, 'Log In / Sign Up'),
  ]);

  const rightSide = user
    ? h('div', { class: 'nav-right' }, [
      h('span', { class: 'nav-user' }, `Hi, ${user.name.split(' ')[0]}`),
      h('button', { class: 'btn btn-outline btn-sm', onClick: () => { store.logout(); navigate('/'); } }, 'Log Out'),
    ])
    : h('div', { class: 'nav-right' }, [
      h('a', { href: '#/login', class: 'btn btn-primary btn-sm' }, 'Sign Up'),
    ]);

  const burger = h('button', {
    class: 'hamburger', 'aria-label': 'Toggle menu',
    onClick: () => mobileMenu.classList.toggle('open'),
  }, [h('span'), h('span'), h('span')]);

  return h('header', { class: 'site-header', style: { position: 'sticky' } }, [
    h('div', { class: 'container' }, [
      h('a', { href: '#/', class: 'logo' }, ['Set', h('span', { class: 'dot' }, 'list')]),
      h('nav', { class: 'nav-links', 'aria-label': 'Primary' }, linkEls),
      rightSide,
      burger,
    ]),
    mobileMenu,
  ]);
}

export function CtaBand() {
  return h('div', { class: 'cta-band' }, [
    h('div', {}, [
      h('div', { class: 'eyebrow' }, ['MORE MUSIC.', h('br'), 'STRONGER COMMUNITIES.']),
      h('h2', { class: 'display' }, 'It Starts Locally.'),
    ]),
    h('a', { href: '#/login', class: 'btn btn-primary' }, 'Get Started'),
  ]);
}

export function Footer() {
  return h('footer', { class: 'site-footer' }, [
    h('div', { class: 'container' }, [
      h('span', { class: 'logo' }, 'Setlist'),
      h('nav', { class: 'footer-links', 'aria-label': 'Footer' }, [
        h('a', { href: '#/talent' }, 'Artists'),
        h('a', { href: '#/venues' }, 'Venues'),
        h('a', { href: '#/about' }, 'About'),
      ]),
      h('span', { class: 'footer-copy' }, `© ${new Date().getFullYear()} Setlist`),
    ]),
  ]);
}

export function Page(...sections) {
  const wrap = h('div', { class: 'page' }, [
    h('a', { href: '#main', class: 'skip-link' }, 'Skip to content'),
    Header(),
    h('main', { id: 'main' }, sections),
    CtaBand(),
    Footer(),
  ]);
  return wrap;
}
