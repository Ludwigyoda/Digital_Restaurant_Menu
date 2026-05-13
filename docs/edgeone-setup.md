# Hébergement du menu en ligne via Tencent EdgeOne 🇨🇳

> Document à envoyer au gérant du restaurant. Explique pourquoi et comment mettre le menu en ligne sur un service accessible depuis la Chine.

---

## Pourquoi pas Cloudflare ?

Cloudflare est le standard mondial pour héberger des sites/apps statiques, mais en **Chine continentale**, son réseau est :
- Soit **bloqué** (selon les FAI et les périodes)
- Soit **dégradé** (latence élevée, timeouts)

C'est pour ça que la première version du menu ne marchait pas correctement en Chine.

---

## La solution : **Tencent EdgeOne** (腾讯云 EdgeOne)

C'est l'équivalent **direct de Cloudflare** mais développé par Tencent, le géant chinois (qui édite WeChat, QQ, etc.).

### Pourquoi EdgeOne ?

| Critère | EdgeOne | Cloudflare |
|---|---|---|
| Performance en Chine | ⭐⭐⭐⭐⭐ Excellente | ❌ Variable / bloqué |
| Hong Kong + Singapour | ✅ | ✅ |
| Licence ICP requise ? | ❌ Non (si on utilise nodes HK/Singapour) | — |
| HTTPS automatique | ✅ | ✅ |
| Protection DDoS | ✅ | ✅ |
| Free tier | ✅ Oui | ✅ |
| Console en chinois | ✅ (anglais dispo) | ❌ Anglais only |
| Support depuis Chine | ✅ 24/7 chinois | ❌ |

### Coût estimé pour le restaurant

Pour un menu consulté par les clients du resto :
- **0 € à 5 €/mois** pour ce niveau de trafic
- EdgeOne a un **plan gratuit** suffisant pour démarrer (1 To/mois de bande passante)
- Si le trafic dépasse → ~30 RMB/mois maxi pour un resto

---

## Comment ça marche ?

```
┌──────────────────┐       ┌─────────────────┐       ┌──────────────┐
│  Toi (dev)       │       │  EdgeOne (HK)   │       │  Tablettes   │
│                  │       │                 │       │  resto       │
│  Modifie menu    │ ───→  │  Stocke les     │ ←───  │  Pull menu   │
│  bun deploy      │       │  fichiers       │       │  au démarrage│
└──────────────────┘       └─────────────────┘       └──────────────┘
```

1. Tu héberges le menu (le code + les données) sur EdgeOne
2. Les tablettes du resto se connectent à EdgeOne au démarrage **OU** quand le gérant appuie sur "Mise à jour"
3. EdgeOne livre les fichiers depuis ses **serveurs à Hong Kong** (proche de Shenzhen, donc rapide)
4. Si la tablette est offline → elle utilise la version cachée localement (toujours fonctionnelle)

---

## Mise en route : étapes côté gérant

### 1. Créer un compte Tencent Cloud (5 min)

1. Aller sur https://www.tencentcloud.com (version internationale en anglais)
2. Sign up avec email + numéro de tél chinois (recommandé) ou international
3. Vérification d'identité (photo de la carte d'identité ou business license)

### 2. Activer EdgeOne (5 min)

1. Console Tencent Cloud → chercher "EdgeOne" dans les services
2. Activer le service (free tier)
3. Choisir le plan "Personal" (gratuit) ou "Basic" (5 USD/mois)

### 3. Ajouter un site (10 min)

1. EdgeOne → "Sites" → "Add site"
2. Entrer le nom de domaine (ex: `menu.lalupita-revo.com`) ou utiliser un sous-domaine gratuit fourni par EdgeOne (ex: `lalupita-revo.eo.dnse.com`)
3. Choisir le mode "DNS proxy" — EdgeOne devient ton DNS + CDN
4. Suivre les instructions pour pointer ton domaine vers EdgeOne

### 4. Upload du menu (5 min, à chaque mise à jour)

Côté dev (chez moi) :
```powershell
bun run build:static       # génère le dossier dist/
bun run deploy:edgeone      # upload sur EdgeOne (à scripter)
```

OU manuel via console EdgeOne :
1. EdgeOne console → ton site → "Files" → "Upload"
2. Drag-and-drop le dossier `dist/`
3. Click "Publish"

---

## Workflow long-terme — Mise à jour du menu

**Sans EdgeOne** (Phase 1 actuelle) :
- Le dev modifie le menu sur son PC
- Génère un nouveau APK
- Re-installe l'APK sur les 5 tablettes via clé USB
- Temps : 25 min pour 5 tablettes à chaque changement

**Avec EdgeOne** (Phase 2 recommandée) :
- Le dev modifie le menu sur son PC
- Push sur EdgeOne (1 commande, 30 secondes)
- Les tablettes pullent le nouveau menu au prochain démarrage OU au prochain clic sur "Update"
- Temps : 30 secondes, automatique sur les tablettes

**ROI** : à partir de 3-4 changements de menu par an, EdgeOne devient rentable en temps de gérant.

---

## Sécurité

EdgeOne fournit en standard :
- ✅ **HTTPS automatique** (certificat SSL géré par Tencent, gratuit, renouvelé tout seul)
- ✅ **Protection DDoS** (anti-attaques par déni de service)
- ✅ **WAF** (Web Application Firewall, anti-injections SQL/XSS)
- ✅ **Géo-blocage** : possibilité de bloquer l'accès depuis certains pays si besoin (rare)
- ✅ **Audit log** : toutes les requêtes loguées avec IP + timestamp

Pour un menu de restaurant, c'est **largement au-dessus** des besoins en sécurité.

---

## Alternative si EdgeOne semble trop complexe

**Plan B : Vercel** (https://vercel.com)
- Plus simple à utiliser (interface anglaise très claire)
- Connecte directement à GitHub
- Push code → déploie automatiquement
- **Mais** : pas de node Chine continentale, latence variable depuis Shenzhen
- Acceptable pour 5 tablettes en local, déconseillé pour un site grand public

**Plan C : on garde l'APK pur, pas d'hébergement**
- Aucun coût mensuel
- Aucune setup
- Mais à chaque changement de menu → réinstaller APK manuellement sur chaque tablette

---

## Recommandation finale

1. **Démarrer** avec l'APK pur (zéro hébergement)
2. **Après 3-6 mois d'usage**, évaluer si on change souvent le menu
3. **Si oui** → migrer vers EdgeOne (1 jour de boulot dev pour câbler le système)

---

## Pour aller plus loin

- Documentation EdgeOne : https://www.tencentcloud.com/products/teo
- Tarifs : https://www.tencentcloud.com/pricing/teo
- Support Tencent : 7j/7 en chinois (très réactif)

---

*Document préparé pour le projet menu tablettes La Lupita × Revolucion.*
