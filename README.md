# Il Risveglio — sito one-page

Sito statico (HTML + CSS + JS vanilla, nessuna libreria).

```
index.html        pagina principale
privacy.html      Privacy & Cookie Policy — SEGNAPOSTO da completare
css/style.css     stile (colori, bifont, responsive, animazioni)
js/eventi.js      ELENCO EVENTI del calendario (da compilare)
js/main.js        menu, FAQ, calendario eventi, prenotazioni, moduli, animazioni
assets/logo-il-risveglio.webp   logo originale fornito (non modificato)
assets/img/       foto illustrative WebP in più larghezze (srcset)
```

Ordine sezioni: Header · Hero · Chi siamo · A chi ci rivolgiamo · Filosofia · Servizi ·
Workshop & Eventi · Come funziona · Dove siamo · FAQ · Contatti · Footer.

Sfondi sezione alternati: #FFFFFF → #CCB5A3 → #FFF5EC (a partire da Chi siamo).
Accenti e CTA: #5D463C.

## Calendario Workshop & Eventi
- Gli eventi si inseriscono in `js/eventi.js` (data, ora, titolo, descrizione, conduce, posti).
- Gli eventi passati non vengono mostrati.
- Anteprima con eventi di esempio: aprire `index.html?demo-eventi`.
- La richiesta di prenotazione usa il modulo `#booking-form`: impostare `data-endpoint`.

## Da completare prima della pubblicazione
1. **Moduli** — impostare `data-endpoint` su `#contact-form` e `#booking-form`
   (es. Formspree `https://formspree.io/f/XXXX` o script sul proprio hosting).
   Finché è vuoto, i moduli validano i campi ma **non simulano l'invio**: propongono telefono
   ed email precompilata.
2. **Privacy/Cookie Policy** — testo definitivo con titolare, dati fiscali e fornitore dei moduli.
3. **Dominio** — sostituire `https://www.example.com/` nel `<link rel="canonical">`.
4. **Font** — per conformità GDPR scaricare Cormorant Garamond e Manrope e servirli in locale.
5. **Fotografie** — immagini illustrative Unsplash (licenza gratuita), senza volti; non
   rappresentano la sede. Sostituibili mantenendo nomi file e proporzioni.
6. **Dati fiscali** nel footer — solo dopo verifica.
