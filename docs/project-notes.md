# YachtUpholstery Sardinia - Project Notes

## Obiettivo
Creare una landing premium verticale per yacht upholstery, carpet e mattress cleaning in Sardinia.

Dominio principale previsto:
yachtupholsterysardinia.com

Dominio secondario possibile:
yachtcarpetsardinia.com

## Posizionamento
Servizio premium per yacht interiors in Sardinia.

Target:
- yacht captains
- chief stewardesses
- yacht managers
- charter teams
- owner representatives
- villa/property managers premium

Aree principali:
- Porto Cervo
- Olbia
- Portisco
- Costa Smeralda
- Cagliari
- Poltu Quatu

## Servizi principali
- yacht upholstery cleaning
- yacht carpet cleaning
- yacht mattress cleaning
- stain treatment
- odour-related textile care
- mould-related textile care
- pre-charter interior refresh
- guest-ready interiors

## Stile grafico
Premium, sobrio, nautico.

Palette indicativa:
- deep navy
- warm white
- soft gold
- muted teal
- light sand

Elementi visual:
- linee curve leggere
- richiami a oblò/circoli
- molto spazio bianco
- no stile impresa pulizie generica
- no effetto volantino locale

Nota:
Non mettere curve/oblò nella hero. Usarle in sezioni interne o blocchi decorativi.

## Regole contenuto
Non promettere:
- flame retardant treatment
- steam cleaning
- certificazioni marine non esistenti
- trattamenti specialistici non verificati

Usare linguaggio:
- specialist textile care
- yacht interiors
- guest-ready
- pre-charter
- upholstery, carpets, mattresses
- photo-based WhatsApp assessment

## Tracking
Tracking modulare tramite:
assets/data/tracking.config.json
assets/js/tracking.js

Eventi minimi:
- whatsapp_click
- phone_click
- form_submit eventuale
- email_click eventuale

## Footer
Footer separato.

File:
partials/footer.html
assets/data/footer.links.json
assets/js/footer-loader.js

Obiettivo:
Gestire link footer senza modificare manualmente ogni pagina. Perché impazzire a mano nel 2026 sarebbe coerente con la specie, ma evitabile.

## SEO structure

Homepage:
index.html

Money pages:
services/yacht-upholstery-cleaning-sardinia.html
services/yacht-carpet-cleaning-sardinia.html
services/yacht-mattress-cleaning-sardinia.html

Guide:
guides/pre-charter-yacht-interior-cleaning-sardinia.html
guides/yacht-upholstery-cleaning-porto-cervo.html
guides/yacht-carpet-cleaning-costa-smeralda.html

Legal:
pages/legal/privacy.html
pages/legal/cookie-policy.html
pages/legal/terms.html
pages/legal/contact.html

## Regole operative
- Un passo alla volta.
- No patch confuse.
- No duplicazione inutile CSS.
- CSS unico: assets/css/yacht-premium.css
- JS separati per tracking/footer/main.
- Footer centralizzato.
- Sitemap generata da script.
- Test mobile prima del deploy.
