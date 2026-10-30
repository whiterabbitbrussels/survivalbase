# SurvivalBase · Setup guide: Google Merchant, Amazon, Reddit, lingue e valute

Stato al 30 ottobre 2026. Email del progetto: **survivalbasenet@gmail.com**.

## 1. Cosa è già fatto

- **Sito in 6 lingue**: EN su survivalbase.net, poi /fr /nl /it /es /de. Ogni zona e ogni prodotto ha un indirizzo vero (es. survivalbase.net/it/product/water-0/).
- **468 pagine statiche** leggibili da Google e dagli assistenti AI: titolo, descrizione, canonical, hreflang, Open Graph, dati strutturati Product con prezzo, spedizione e resi.
- **sitemap.xml** e **robots.txt**: survivalbase.net/sitemap.xml
- **Feed Google Merchant**, uno per lingua, con 55 prodotti vendibili:
  - survivalbase.net/feeds/google-en.xml
  - survivalbase.net/feeds/google-fr.xml
  - survivalbase.net/feeds/google-nl.xml
  - survivalbase.net/feeds/google-it.xml
  - survivalbase.net/feeds/google-es.xml
  - survivalbase.net/feeds/google-de.xml
- **Footer** con link a spedizioni, resi, privacy, condizioni, note legali, contatti, e selettore lingua.
- **Il carrello resta salvato** anche se chiudi la pagina.
- **Checkout Shopify** in EN, FR, NL, IT, ES, DE.
- **Nuovo tema "SurvivalBase · redirect v2"** caricato su Shopify, non ancora pubblicato. Rispetto a quello attivo:
  - mostra le pagine delle policy invece di rimandare alla home;
  - manda ogni prodotto alla sua pagina sul sito.

## 2. Da fare tu in Shopify (10 minuti)

1. **Online Store → Themes**: su "SurvivalBase · redirect v2" premi **Publish**. Senza questo passo i link legali del footer rimandano alla home.
2. **Settings → Policies**: incolla i testi della sezione 7 al posto di quelli Kimowi. Io non ho il permesso API per scriverli.
3. **Settings → Store details**:
   - sender/contact email: contact@survivalbase.net (oggi è info@kimowi.com);
   - aggiungi il **numero di partita IVA**, obbligatorio in Belgio sul sito e nelle fatture.
4. **Settings → Checkout → Customize → Branding**: logo survivalbase-logo.png.
5. **Settings → Shipping**: oggi c'è €4,90 ovunque, anche Resto del mondo. Proposta:
   - UE €4,90, gratis sopra €79;
   - Regno Unito/Svizzera €12,90;
   - Resto del mondo disattivato finché non conosci i costi reali del fornitore.
   Se cambi le tariffe, dimmelo e aggiorno feed e dati strutturati, che oggi dichiarano €4,90 e 5–12 giorni lavorativi.

## 3. Google Merchant Center (con survivalbasenet@gmail.com)

1. Vai su merchants.google.com e accedi con survivalbasenet@gmail.com. Crea l'account:
   - nome negozio: SurvivalBase;
   - sito: https://survivalbase.net;
   - paese dell'attività: Belgio.
2. **Verifica il sito.** Scegli il metodo "tag HTML" e mandami il codice `google-site-verification`: lo metto io nel sito. In alternativa usa il record DNS TXT su Infomaniak.
3. **Informazioni attività**: indirizzo White Rabbit, telefono, email assistenza contact@survivalbase.net.
4. **Spedizioni**: crea un servizio "UE":
   - paesi BE NL LU FR DE AT IT ES PT IE;
   - €4,90;
   - lavorazione 1–3 giorni, transito 5–12 giorni.
   Deve coincidere con il checkout.
5. **Resi**: 14 giorni, reso per posta, spese a carico del cliente. Link: https://shop.survivalbase.net/policies/refund-policy
6. **Prodotti → Origini dati → Aggiungi → File da URL (fetch programmato)**. Crea una origine per ogni coppia paese/lingua, con recupero giornaliero:
   - Belgio + francese → google-fr.xml
   - Belgio + olandese → google-nl.xml
   - Paesi Bassi + olandese → google-nl.xml
   - Francia + francese → google-fr.xml
   - Germania e Austria + tedesco → google-de.xml
   - Italia + italiano → google-it.xml
   - Spagna + spagnolo → google-es.xml
   - Irlanda + inglese → google-en.xml
7. **Canali**: attiva le schede senza costi (free listings) e Shopping. Per Google Ads collega poi un account Ads creato con la stessa email.
8. **Non usare anche il canale "Google & YouTube" di Shopify**: duplicherebbe i prodotti e i link porterebbero al dominio shop.survivalbase.net, che rimanda al sito.

**Attenzione al rischio Merchant.** Google rifiuta spesso negozi nuovi per "misrepresentation". Per evitarlo:
- pagina contatti con indirizzo fisico;
- policy pubblicate (punto 2.1 e 2.2);
- prezzi uguali sito/checkout/feed (già fatto);
- nessuna promessa assoluta ("protegge da radiazioni" ecc.).

I prodotti "Faraday" e "perimetro" vanno descritti in modo sobrio.

## 4. Google Search Console

- search.google.com/search-console, con la stessa email. Aggiungi la proprietà di dominio survivalbase.net (record TXT su Infomaniak).
- Invia la sitemap: https://survivalbase.net/sitemap.xml
- Bing Webmaster Tools: importa da Search Console in un clic. Serve anche a ChatGPT/Copilot search.

## 5. Valute

- **Oggi**: tutto in EUR (sito, feed, checkout). È corretto per i paesi euro, che sono tutti i mercati del feed.
- **Regno Unito / Svizzera / USA, quando vorrai**:
  - Shopify → Settings → Markets → crea il mercato e attiva la valuta locale (Shopify Payments converte al checkout);
  - sul sito aggiungo un selettore valuta e un feed per paese con il prezzo convertito, perché Google rifiuta prodotti con prezzo diverso tra feed e checkout.
- **Il Regno Unito non entra prima di**:
  - aver sistemato le spedizioni (dogana e IVA UK: sotto £135 Shopify deve raccogliere l'IVA UK, serve registrazione HMRC);
  - aver adattato i testi UK (raccomandazione della sessione SEO: "Torch" invece di "Flashlight"; niente toni allarmistici su radiazioni/Faraday, rischio ASA).

## 6. Amazon e Reddit

### Amazon (Seller Central Europe)
- **Registrazione**: sellercentral-europe.amazon.com con survivalbasenet@gmail.com. Servono:
  - documenti societari White Rabbit e partita IVA;
  - carta di credito, conto bancario;
  - documento d'identità del legale rappresentante;
  - videochiamata di verifica.
  Costo: €39/mese (piano Professional).
- **Il dropshipping da AliExpress è vietato su Amazon.** Le regole: devi essere venditore registrato su fattura, imballi e documenti col tuo nome, nessun riferimento al fornitore. Due strade sicure:
  1. **Vendi solo il libro "Survival Base · The Guide"**. Puoi farlo anche via **KDP**: kdp.amazon.com, con l'account di White Rabbit, carta + ISBN gratuito. È l'ingresso più semplice su Amazon e porta traffico al sito.
  2. **Kit a marchio SurvivalBase con FBA**: compri lo stock, registri il marchio (EUIPO ~€850) e iscrivi Brand Registry. Così hai pagine protette, A+ content e niente concorrenza sulla stessa scheda.
- Prodotti come power station e filtri acqua richiedono marcatura CE e documenti di conformità del produttore. Chiedili al fornitore prima di pubblicare.

### Reddit
- **Account**: crea u/SurvivalBase con survivalbasenet@gmail.com. Per i primi 30 giorni partecipa senza link:
  - r/preppers, r/BugOutBags, r/Survival, r/camping, r/vanlife, r/solar, r/flashlight;
  - le versioni locali: r/belgium, r/thenetherlands, r/de, r/italy.
  Rispondi a domande su blackout, kit 72 ore, acqua (la Commissione UE raccomanda scorte per 72 ore).
- Le regole dei subreddit vietano l'autopromozione. Il sito si condivide solo quando qualcuno chiede, dichiarando che è il tuo negozio.
- **Contenuti che funzionano**:
  - la checklist "kit 72 ore UE" con i consigli ufficiali (Belgio: risk.be / Centre de Crise; Paesi Bassi: "Denk vooruit");
  - il test reale di un prodotto con foto vere.
- **Reddit Ads** (ads.reddit.com): budget minimo €5/giorno. Targeting per community (preppers, camping, solar) in BE/NL/DE/FR. Installa il **Reddit Pixel**: mandami l'ID e lo aggiungo al sito.
- **Perché conta**: Google mostra sempre più discussioni Reddit, e gli assistenti AI citano Reddit spesso. Le menzioni spontanee valgono più degli annunci.

## 7. Policy pronte da incollare (Shopify → Settings → Policies)

Sono nel file policies.json in questa cartella, in HTML.

**Da completare**: numero di partita IVA nelle note legali.

Contenuto:
- **Contatti e note legali**: White Rabbit Integrated Communication, Square de Meeûs 35, 1000 Bruxelles, contact@survivalbase.net, +32 2 646 31 90.
- **Spedizioni**: UE; spedizione da magazzini partner in 1–3 giorni lavorativi, consegna in 5–12 giorni; tracking; dogana fuori UE.
- **Resi**: recesso di 14 giorni (UE), reso a carico del cliente salvo difetti, rimborso entro 14 giorni, garanzia legale di 2 anni. Esclusi gli articoli igienici o medici aperti e i consumabili aperti.
- **Privacy (GDPR)**: titolare, dati raccolti, basi giuridiche, destinatari, conservazione per 7 anni, diritti, Autorità belga.
- **Condizioni**: venditore, contratto, prezzi IVA inclusa, foto AI come illustrazioni, legge belga e tutela del consumatore, ODR.

## 8. Prossimi passi consigliati, in ordine

1. Pubblica il tema v2, incolla le policy, metti la partita IVA e l'email (punto 2).
2. Crea Merchant Center e Search Console, e mandami il codice di verifica (punti 3–4).
3. Genera le foto AI per i prodotti che non le hanno ancora (sessione White Rabbit con BytePlus). Google Shopping premia immagini di prodotto chiare: per ogni prodotto la prima immagine del feed dovrebbe essere il packshot su fondo neutro, e le foto ambientate quelle aggiuntive.
4. Il libro su KDP e l'account Reddit, che si avviano subito e costano poco.
5. Recensioni: installa un'app di recensioni (Judge.me, gratuita) dopo i primi ordini. Così le stelle compaiono su Google.
