/* Il Risveglio — interazioni (vanilla JS, nessuna libreria) */
(() => {
  'use strict';

  const EMAIL = 'ilrisvegliosandona@gmail.com';
  const PHONE_HTML = '<a href="tel:+393495834264">349 583 4264</a>';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header sticky ---------- */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  const toggleLabel = toggle.querySelector('.sr-only');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggleLabel.textContent = open ? 'Chiudi il menu' : 'Apri il menu';
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Voce di menu attiva ---------- */
  const links = [...document.querySelectorAll('.main-nav ul a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = sections.indexOf(entry.target);
        links.forEach((l, k) => { if (k === i) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => s && spy.observe(s));
  }

  /* ---------- Comparsa delicata ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Come funziona: percorso che si illumina con lo scroll ---------- */
  const journey = document.querySelector('[data-journey]');
  if (journey) {
    const steps = [...journey.querySelectorAll('.jstep')];
    const list = journey.querySelector('.journey-steps');
    const mqVertical = window.matchMedia('(max-width: 860px)');
    let ticking = false;
    const update = () => {
      ticking = false;
      let p;
      if (reduceMotion) p = 1;
      else {
        const r = list.getBoundingClientRect();
        const vh = window.innerHeight;
        p = mqVertical.matches
          ? (vh * 0.62 - (r.top + 36)) / Math.max(r.height - 72, 1)
          : (vh * 0.82 - r.top) / (vh * 0.42);
        p = Math.min(1, Math.max(0, p));
      }
      journey.style.setProperty('--p', p.toFixed(4));
      steps.forEach((s, i) => s.classList.toggle('is-active', p >= i / (steps.length - 1) - 0.001));
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  }

  /* ---------- Servizi: proposte nascoste dietro "Scopri di più" ---------- */
  document.querySelectorAll('.svc-toggle').forEach((btn, i) => {
    const panel = btn.nextElementSibling;
    const label = btn.querySelector('.svc-toggle-label');
    const title = btn.closest('.card-body').querySelector('h3').textContent.toLowerCase();
    panel.id = 'svc-more-' + (i + 1);
    btn.setAttribute('aria-controls', panel.id);
    btn.setAttribute('aria-label', 'Scopri di più: ' + title);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      label.textContent = open ? 'Scopri di più' : 'Mostra meno';
      btn.setAttribute('aria-label', (open ? 'Scopri di più: ' : 'Mostra meno: ') + title);
      panel.hidden = open;
      if (!open) { panel.classList.remove('is-animating'); void panel.offsetWidth; panel.classList.add('is-animating'); }
    });
  });

  /* ---------- FAQ accordion (tutte chiuse all'avvio) ---------- */
  document.querySelectorAll('.faq-item button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      if (!open) { panel.classList.remove('is-animating'); void panel.offsetWidth; panel.classList.add('is-animating'); }
    });
  });

  /* ==========================================================
     Moduli (contatti + prenotazione eventi)
     ========================================================== */
  const validators = {
    nome:     (v) => v.trim().length >= 2 || 'Inserisci il tuo nome e cognome.',
    email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Inserisci un indirizzo email valido.',
    telefono: (v, el) => (!el.required && v.trim() === '') || /^[+()\d\s.-]{6,}$/.test(v.trim()) ||
                (el.required ? 'Inserisci un numero di telefono valido.' : 'Inserisci un numero di telefono valido oppure lascia vuoto il campo.'),
    messaggio:(v) => v.trim().length >= 10 || 'Scrivi un breve messaggio (almeno 10 caratteri).',
    privacy:  (_, el) => el.checked || 'Per procedere è necessario accettare l’informativa privacy.'
  };

  const setupForm = (form, { subject, buildBody, successHtml }) => {
    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const startedAt = Date.now();

    const showError = (el, msg) => {
      const err = document.getElementById(el.id + '-err');
      if (msg === true) {
        el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby');
        if (err) { err.hidden = true; err.textContent = ''; }
        return true;
      }
      el.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = msg; err.hidden = false; el.setAttribute('aria-describedby', err.id); }
      return false;
    };
    const validateField = (el) => validators[el.name] ? showError(el, validators[el.name](el.value, el)) : true;
    const fields = () => [...form.querySelectorAll('input[name], textarea[name]')].filter((el) => validators[el.name] && el.type !== 'hidden');

    fields().forEach((el) => {
      el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') validateField(el); });
      el.addEventListener('input', () => { if (el.getAttribute('aria-invalid')) validateField(el); });
      el.addEventListener('change', () => { if (el.type === 'checkbox') validateField(el); });
    });

    const setStatus = (type, html) => {
      status.className = 'form-status is-' + type;
      status.innerHTML = html;
      status.hidden = false;
      status.focus({ preventScroll: false });
    };
    const mailto = () => 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject()) + '&body=' + encodeURIComponent(buildBody(new FormData(form)));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.hidden = true;
      const list = fields();
      const results = list.map(validateField);
      if (results.includes(false)) { list[results.indexOf(false)].focus(); return; }

      // Antispam: campo esca compilato o invio troppo rapido
      if (form.website.value || Date.now() - startedAt < 3000) {
        setStatus('error', '<strong>Non è stato possibile inviare la richiesta.</strong>Riprova tra qualche istante oppure contattaci direttamente.');
        return;
      }

      const endpoint = (form.dataset.endpoint || '').trim();
      if (!endpoint) {
        // Nessun servizio configurato: NON si simula un invio riuscito.
        setStatus('error',
          '<strong>L’invio online non è ancora attivo.</strong>' +
          'La tua richiesta non è stata inviata. Puoi chiamarci al ' + PHONE_HTML + ' oppure ' +
          '<a href="' + mailto() + '">inviarci la richiesta via email</a> (si aprirà il tuo programma di posta con il testo già compilato).');
        return;
      }

      submitBtn.disabled = true;
      const label = submitBtn.textContent;
      submitBtn.textContent = 'Invio in corso…';
      try {
        const data = new FormData(form);
        data.append('_subject', subject());
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        setStatus('success', successHtml);
      } catch (err) {
        setStatus('error', '<strong>Si è verificato un problema durante l’invio.</strong>Riprova più tardi oppure scrivici a <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }
    });
    return { reset: () => { form.reset(); status.hidden = true; fields().forEach((el) => showError(el, true)); } };
  };

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    setupForm(contactForm, {
      subject: () => 'Richiesta informazioni dal sito',
      buildBody: (d) => [
        'Nome: ' + d.get('nome'), 'Email: ' + d.get('email'),
        d.get('telefono') ? 'Telefono: ' + d.get('telefono') : null,
        d.get('attivita') ? 'Attività di interesse: ' + d.get('attivita') : null,
        '', d.get('messaggio')
      ].filter((l) => l !== null).join('\n'),
      successHtml: '<strong>Grazie, abbiamo ricevuto la tua richiesta.</strong>Ti risponderemo il prima possibile.'
    });
  }

  /* ==========================================================
     Workshop & Eventi — calendario in finestra modale
     ========================================================== */
  const dialog = document.getElementById('cal-dialog');
  const openers = document.querySelectorAll('[data-open-calendar]');
  if (dialog && openers.length) {
    const fmtMonth = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });
    const fmtDay = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const key = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // Eventi: dal file js/eventi.js, oppure di esempio con ?demo-eventi
    const demo = new URLSearchParams(location.search).has('demo-eventi');
    let events = Array.isArray(window.EVENTI) ? window.EVENTI.slice() : [];
    if (demo) {
      const at = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return key(d); };
      events = [
        { data: at(3),  ora: '18:30 – 20:00', titolo: 'Esempio · Bagno di suoni', descrizione: 'Evento di esempio per mostrare il funzionamento del calendario.', posti: 'Posti limitati' },
        { data: at(10), ora: '10:00 – 12:30', titolo: 'Esempio · Workshop di consapevolezza', descrizione: 'Evento di esempio per mostrare il funzionamento del calendario.' },
        { data: at(24), ora: '20:00 – 21:30', titolo: 'Esempio · Meditazione di gruppo', descrizione: 'Evento di esempio per mostrare il funzionamento del calendario.' }
      ];
      dialog.querySelector('.cal-demo-note').hidden = false;
    }
    events = events
      .filter((e) => e && e.data && e.titolo)
      .map((e) => Object.assign({}, e, { passato: parse(e.data) < today }))
      .sort((a, b) => (a.data + (a.ora || '')).localeCompare(b.data + (b.ora || '')));
    const upcoming = events.filter((e) => !e.passato);

    const views = { calendar: dialog.querySelector('[data-view="calendar"]'), booking: dialog.querySelector('[data-view="booking"]') };
    const grid = dialog.querySelector('.cal-grid');
    const monthLabel = dialog.querySelector('.cal-month');
    const listEl = dialog.querySelector('.cal-list');
    const prevBtn = dialog.querySelector('[data-cal-prev]');
    const nextBtn = dialog.querySelector('[data-cal-next]');
    let cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    let selected = null;

    const eventsIn = (y, m) => events.filter((e) => { const d = parse(e.data); return d.getFullYear() === y && d.getMonth() === m; });

    const renderList = () => {
      const y = cursor.getFullYear(), m = cursor.getMonth();
      const items = selected ? events.filter((e) => e.data === selected) : eventsIn(y, m);
      const title = selected ? fmtDay.format(parse(selected)) : 'Eventi di ' + fmtMonth.format(cursor);
      if (!items.length) {
        listEl.innerHTML =
          '<div class="cal-empty"><p><strong>Al momento non ci sono eventi in programma in questo mese.</strong></p>' +
          '<p>Seguici su <a href="https://www.instagram.com/ilrisveglio_sandona/" target="_blank" rel="noopener">Instagram</a> oppure ' +
          '<a href="#contatti" data-close-calendar>scrivici</a> per conoscere le prossime date.</p></div>';
        return;
      }
      const card = (e) =>
        '<article class="cal-event' + (e.passato ? ' is-past' : '') + '">' +
          '<p class="cal-event-date">' + esc(fmtDay.format(parse(e.data))) + (e.ora ? ' · ' + esc(e.ora) : '') + (e.tipo ? '<span class="cal-event-type"> · ' + esc(e.tipo) + '</span>' : '') + '</p>' +
          '<h3>' + esc(e.titolo) + '</h3>' +
          (e.descrizione ? '<p>' + esc(e.descrizione) + '</p>' : '') +
          ((e.conduce || e.posti) ? '<p class="cal-event-meta">' + [e.conduce ? 'Conduce: ' + esc(e.conduce) : '', esc(e.posti || '')].filter(Boolean).join(' · ') + '</p>' : '') +
          (e.passato
            ? '<p class="cal-event-ended">Evento concluso</p>'
            : '<button type="button" class="btn btn-primary" data-book="' + events.indexOf(e) + '">Prenota il tuo posto</button>') +
        '</article>';
      const next = items.filter((e) => !e.passato);
      const past = items.filter((e) => e.passato);
      listEl.innerHTML = '<p class="cal-list-title">' + esc(title) + '</p>' +
        (next.length ? next.map(card).join('') : (selected ? '' : '<div class="cal-empty"><p>Gli eventi di questo mese sono conclusi. Seguici su <a href="https://www.instagram.com/ilrisveglio_sandona/" target="_blank" rel="noopener">Instagram</a> per le prossime date.</p></div>')) +
        (past.length ? (next.length || !selected ? '<p class="cal-list-title cal-list-sub">Eventi conclusi</p>' : '') + past.map(card).join('') : '') +
        (selected ? '<p style="text-align:center"><button type="button" class="cal-back" data-show-month>Mostra tutti gli eventi del mese</button></p>' : '');
    };

    const render = () => {
      const y = cursor.getFullYear(), m = cursor.getMonth();
      monthLabel.textContent = fmtMonth.format(cursor);
      prevBtn.disabled = y === today.getFullYear() && m === today.getMonth();
      const lastEvent = events.length ? parse(events[events.length - 1].data) : today;
      const limit = new Date(Math.max(lastEvent, new Date(today.getFullYear(), today.getMonth() + 2, 1)));
      nextBtn.disabled = new Date(y, m + 1, 1) > limit;

      const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
      const first = (new Date(y, m, 1).getDay() + 6) % 7; // lunedì = 0
      const total = new Date(y, m + 1, 0).getDate();
      const withEvents = new Set(eventsIn(y, m).map((e) => e.data));
      let html = days.map((d) => '<span class="cal-dow" role="columnheader">' + d + '</span>').join('');
      for (let i = 0; i < first; i++) html += '<span class="cal-day is-empty" aria-hidden="true"></span>';
      for (let d = 1; d <= total; d++) {
        const date = new Date(y, m, d), k = key(date);
        const cls = ['cal-day'];
        if (date < today) cls.push('is-past');
        if (+date === +today) cls.push('is-today');
        if (withEvents.has(k)) {
          cls.push('has-event');
          if (selected === k) cls.push('is-selected');
          const n = events.filter((e) => e.data === k).length;
          html += '<button type="button" class="' + cls.join(' ') + '" data-day="' + k + '" aria-pressed="' + (selected === k) + '" aria-label="' + esc(fmtDay.format(date)) + ', ' + n + (n > 1 ? ' eventi' : ' evento') + '">' + d + '</button>';
        } else {
          html += '<span class="' + cls.join(' ') + '" role="gridcell">' + d + '</span>';
        }
      }
      grid.innerHTML = html;
      renderList();
    };

    const showView = (name) => {
      Object.entries(views).forEach(([k, v]) => { v.hidden = k !== name; });
      dialog.scrollTop = 0;
    };

    // Prenotazione
    const bookingForm = document.getElementById('booking-form');
    const bookingEventEl = dialog.querySelector('.booking-event');
    let currentEvent = null;
    const booking = setupForm(bookingForm, {
      subject: () => 'Prenotazione evento: ' + (currentEvent ? currentEvent.titolo : ''),
      buildBody: (d) => [
        'Evento: ' + d.get('evento'),
        'Nome: ' + d.get('nome'), 'Email: ' + d.get('email'), 'Telefono: ' + d.get('telefono'),
        'Partecipanti: ' + d.get('partecipanti')
      ].join('\n'),
      successHtml: '<strong>Grazie, abbiamo ricevuto la tua richiesta di prenotazione.</strong>Ti contatteremo per confermare il tuo posto.'
    });

    const openBooking = (ev) => {
      currentEvent = ev;
      booking.reset();
      const label = ev.titolo + ' — ' + fmtDay.format(parse(ev.data)) + (ev.ora ? ', ' + ev.ora : '');
      bookingForm.evento.value = label;
      bookingEventEl.innerHTML = '<strong>' + esc(ev.titolo) + '</strong><br>' + esc(fmtDay.format(parse(ev.data))) + (ev.ora ? ' · ' + esc(ev.ora) : '');
      showView('booking');
      bookingForm.querySelector('input[name="nome"]').focus();
    };

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) { dialog.close(); return; }           // clic sullo sfondo
      const t = e.target.closest('[data-day],[data-book],[data-show-month],[data-cal-prev],[data-cal-next],[data-cal-back],[data-close-calendar]');
      if (!t) return;
      if (t.matches('[data-day]')) { selected = selected === t.dataset.day ? null : t.dataset.day; render(); }
      else if (t.matches('[data-book]')) openBooking(events[Number(t.dataset.book)]);
      else if (t.matches('[data-show-month]')) { selected = null; render(); }
      else if (t.matches('[data-cal-prev]')) { cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1); selected = null; render(); }
      else if (t.matches('[data-cal-next]')) { cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1); selected = null; render(); }
      else if (t.matches('[data-cal-back]')) { showView('calendar'); }
      else if (t.matches('[data-close-calendar]')) { dialog.close(); }
    });

    let lastOpener = null;
    openers.forEach((btn) => btn.addEventListener('click', () => {
      lastOpener = btn;
      // apre sul primo mese con eventi in arrivo, altrimenti sul mese corrente
      const firstEvent = upcoming[0] ? parse(upcoming[0].data) : today;
      cursor = new Date(firstEvent.getFullYear(), firstEvent.getMonth(), 1);
      selected = null;
      showView('calendar');
      render();
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
      document.documentElement.style.overflow = 'hidden';
    }));
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      showView('calendar');
      if (lastOpener) lastOpener.focus({ preventScroll: true });
    });
  }

  /* ---------- Anno corrente ---------- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
