document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Mobile dropdown toggle (tap to expand Solutions on small screens)
  document.querySelectorAll('.nav-links > li.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // Contact form: delivered to info@adlea.org via FormSubmit
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.querySelector('#form-status');
      const btn = form.querySelector('button[type="submit"]');
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();
      if (!name || !email || !message) {
        note.className = 'form-note form-status-error';
        note.textContent = 'Please add your name, email, and message.';
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sending…';
      note.className = 'form-note';
      note.textContent = '';
      fetch('https://formsubmit.co/ajax/info@adlea.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: 'New message from adlea.org',
          _template: 'table'
        })
      })
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then(() => {
          form.reset();
          btn.textContent = 'Message Sent';
          note.className = 'form-note form-status-success';
          note.textContent = 'Thank you for reaching out. We will be in touch soon.';
          note.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(() => {
          btn.disabled = false;
          btn.textContent = 'Send Message';
          note.className = 'form-note form-status-error';
          note.textContent = 'Your message could not be sent from this page. Please email info@adlea.org directly.';
        });
    });
  }
});
