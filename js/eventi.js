/* ==========================================================
   CALENDARIO WORKSHOP & EVENTI — Il Risveglio
   ----------------------------------------------------------
   Un oggetto per evento:

   {
     data: '2026-12-06',                 // AAAA-MM-GG (obbligatoria)
     titolo: 'Titolo dell\'evento',       // obbligatorio
     tipo: 'Workshop',                    // facoltativo (Corso, Conferenza…)
     ora: '20:30',                        // facoltativa
     descrizione: 'Breve descrizione.',   // facoltativa
     conduce: 'Nome del professionista',  // facoltativo
     posti: 'Posti limitati'              // facoltativo
   },

   Gli eventi con data passata restano visibili nel calendario
   come "conclusi", senza possibilità di prenotazione.
   Anteprima con eventi di esempio: index.html?demo-eventi
   ========================================================== */

window.EVENTI = [
  // ---- Novembre 2026 ----
  { data: '2026-11-06', titolo: 'Oltre il visibile', tipo: 'Workshop · 1ª serata',
    descrizione: 'Workshop di 2 serate (6 e 13 novembre): energia, intuito, canale.' },
  { data: '2026-11-07', titolo: 'Il potere di amare senza sacrificarsi', tipo: 'Cerchio di donne' },
  { data: '2026-11-08', titolo: 'Costellazioni familiari', tipo: 'Incontro di gruppo' },
  { data: '2026-11-13', titolo: 'Oltre il visibile', tipo: 'Workshop · 2ª serata',
    descrizione: 'Workshop di 2 serate (6 e 13 novembre): energia, intuito, canale.' },
  { data: '2026-11-14', titolo: 'Campane tibetane', tipo: 'Corso base' },
  { data: '2026-11-15', titolo: 'Il potere delle parole', tipo: 'Workshop' },
  { data: '2026-11-20', titolo: 'La morte non esiste', tipo: 'Conferenza gratuita' },
  { data: '2026-11-21', titolo: 'Lettura anima e/o protezione energetica', tipo: 'Incontro individuale' },
  { data: '2026-11-22', titolo: 'Viaggi astrali', tipo: 'Corso' },
  { data: '2026-11-24', titolo: 'Luna piena', tipo: 'Bagno di suoni' },
  { data: '2026-11-28', titolo: 'Handpan', tipo: 'Corso base' }
];
