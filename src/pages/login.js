import { h } from '../lib/dom.js';
import { Page } from '../components/layout.js';
import { Field, Banner, validateRequired } from '../components/form.js';
import { store } from '../data/store.js';
import { navigate } from '../lib/router.js';
import { toast } from '../lib/dom.js';

export function LoginPage() {
  let mode = 'login'; // 'login' | 'signup'
  let accountType = 'artist';
  const formHost = h('div');

  function render() {
    formHost.innerHTML = '';
    formHost.appendChild(mode === 'login' ? loginForm() : signupForm());
  }

  function loginForm() {
    const bannerHost = h('div');
    const email = Field({ label: 'Email', type: 'email', name: 'email', required: true, placeholder: 'you@example.com' });
    const password = Field({ label: 'Password', type: 'password', name: 'password', required: true, placeholder: '••••••••' });
    const submitBtn = h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, 'Log In');

    const form = h('form', {
      onSubmit: (e) => {
        e.preventDefault();
        bannerHost.innerHTML = '';
        if (!validateRequired([email, password])) return;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '';
        submitBtn.append(h('span', { class: 'spinner' }), ' Logging in…');
        setTimeout(() => {
          const result = store.login(email.getValue(), password.getValue());
          submitBtn.disabled = false;
          submitBtn.textContent = 'Log In';
          if (!result.ok) {
            bannerHost.appendChild(Banner(result.error, 'error'));
            return;
          }
          toast(`Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
          navigate('/');
        }, 500);
      },
    }, [
      bannerHost,
      email.el,
      password.el,
      h('div', { style: { textAlign: 'right', marginBottom: '18px' } }, h('a', { href: '#', onClick: (e) => { e.preventDefault(); toast('Password reset instructions sent (prototype).'); } }, 'Forgot password?')),
      submitBtn,
    ]);

    return h('div', {}, [
      h('h1', {}, 'Log In'),
      h('p', { class: 'sub' }, 'Access your Setlist account.'),
      h('div', { class: 'banner', style: { background: 'rgba(255,255,255,0.06)', color: 'var(--dim)', border: '1px solid var(--border-dark)' } }, 'Demo accounts — artist@demo.com / venue@demo.com, password: password'),
      form,
      h('p', { class: 'form-footnote' }, ['New to Setlist? ', h('a', { href: '#', onClick: (e) => { e.preventDefault(); mode = 'signup'; render(); } }, 'Create an account')]),
    ]);
  }

  function signupForm() {
    const bannerHost = h('div');
    const name = Field({ label: 'Full Name', name: 'name', required: true });
    const email = Field({ label: 'Email', type: 'email', name: 'email', required: true });
    const password = Field({ label: 'Password', type: 'password', name: 'password', required: true });

    const artistBtn = h('button', { type: 'button', class: 'active' }, 'Artist / Band');
    const venueBtn = h('button', { type: 'button' }, 'Venue');
    artistBtn.onclick = () => { accountType = 'artist'; artistBtn.classList.add('active'); venueBtn.classList.remove('active'); };
    venueBtn.onclick = () => { accountType = 'venue'; venueBtn.classList.add('active'); artistBtn.classList.remove('active'); };
    const typeToggle = h('div', { class: 'type-toggle' }, [artistBtn, venueBtn]);

    const submitBtn = h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, 'Create Account');

    const form = h('form', {
      onSubmit: (e) => {
        e.preventDefault();
        bannerHost.innerHTML = '';
        if (!validateRequired([name, email, password])) return;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '';
        submitBtn.append(h('span', { class: 'spinner' }), ' Creating account…');
        setTimeout(() => {
          const result = store.registerUser({ name: name.getValue(), email: email.getValue(), password: password.getValue(), type: accountType });
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
          if (!result.ok) {
            bannerHost.appendChild(Banner(result.error, 'error'));
            return;
          }
          toast('Account created!', 'success');
          navigate(accountType === 'artist' ? '/create/artist' : '/create/venue');
        }, 500);
      },
    }, [bannerHost, typeToggle, name.el, email.el, password.el, submitBtn]);

    return h('div', {}, [
      h('h1', {}, 'Create Account'),
      h('p', { class: 'sub' }, 'Set up your Setlist account as an artist or a venue.'),
      form,
      h('p', { class: 'form-footnote' }, ['Already have an account? ', h('a', { href: '#', onClick: (e) => { e.preventDefault(); mode = 'login'; render(); } }, 'Log in')]),
    ]);
  }

  render();

  const body = h('section', { class: 'form-page' }, [
    h('div', { class: 'container' }, h('div', { class: 'form-card' }, formHost)),
  ]);

  return Page(body);
}
