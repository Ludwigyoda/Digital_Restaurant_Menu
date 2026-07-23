import { ITEM_IMAGES } from "@/data/itemImages";

// Les photos ne sont PAS dans le précache du service worker (voir globIgnores
// dans vite.config) : le précache resterait bloqué sur ~16 Mo à installer avant
// de pouvoir s'activer, ce qui n'aboutissait jamais sur la connexion du kiosk.
// Contrepartie : elles n'arrivent dans le cache "menu-images" qu'au premier
// AFFICHAGE de chaque carte. Un kiosk qui perd le réseau avant d'avoir parcouru
// tout le menu affiche donc l'app entière (précachée) et aucune photo.
//
// Ce module comble le trou : une fois en ligne, il demande les 141 photos en
// tâche de fond. La route CacheFirst "menu-images" (src/sw.ts) les stocke au
// passage. Après une seule session connectée, le kiosk est réellement autonome.
//
// En série et espacé : sur le WebView du kiosk, lancer 141 requêtes d'un coup
// vole de la bande passante et du temps de décodage à la page que le client est
// en train de regarder.
const DELAY_BETWEEN_MS = 150;
const START_DELAY_MS = 4000;

let started = false;

export function warmImageCache() {
  if (started || typeof window === "undefined") return;
  started = true;

  const urls = Object.values(ITEM_IMAGES);
  let i = 0;

  const next = () => {
    if (i >= urls.length) return;
    const url = urls[i++];
    // `fetch` plutôt qu'un `new Image()` : on veut que la requête passe par le
    // service worker pour atterrir dans le cache, pas dans le cache mémoire du
    // décodeur. Un échec (hors ligne) est sans conséquence : on réessaiera au
    // prochain démarrage.
    fetch(url, { cache: "force-cache" })
      .catch(() => {})
      .then(() => {
        window.setTimeout(next, DELAY_BETWEEN_MS);
      });
  };

  // On laisse d'abord la première page se peindre et se mettre en cache.
  window.setTimeout(() => {
    if (navigator.onLine) next();
  }, START_DELAY_MS);
}
