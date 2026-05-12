# La Lupita × Revolución — Menu Tablette

Système d'affichage de menu pour tablettes en restaurant. **Bilingue anglais / chinois**, **100% hors-ligne**, mode kiosque Android. Conçu spécifiquement pour le marché chinois (Shenzhen).

121 plats et boissons des deux enseignes du gérant :
- **La Lupita** — cuisine mexicaine (Finger Food, Platos, Tacos, Desserts)
- **Revolución** — cocktail bar (Signature, All Star, Classic, Mocktail, Shots, Wines, Beers, Soft Drinks, Shisha)

---

## Ce que voit le client à table

- **Menu visuel complet** : photos professionnelles de chaque plat et cocktail
- **Switch de langue** en un tap : `EN` / `中` / `EN+中` (côté haut-droit)
- **Navigation tactile** : swipe horizontal entre catégories, sélection des sous-groupes via rail de gauche
- **Détails au tap** : photo plein écran + ingrédients + prix avec variantes (Glass/Bottle, ×1/×12, Pastor/Beef/Shrimps/Trio)
- **Allergens** symbolisés sur chaque carte : 🥜 cacahuètes, 🦐 crustacés, 🌾 gluten, 🥚 œufs, 🧀 lactose, 🌰 fruits à coque, 🌶️ épicé, 🌱 végétarien
- **Reset automatique** après 2 minutes d'inactivité (avec compte à rebours de 20 secondes pour annuler) — la prochaine table arrive sur un menu propre

---

## Fonctionnalités spéciales pour le gérant

### Code secret VIP

Une **section premium cachée** débloquée par une séquence de taps sur les logos :

> Tape **2× le logo La Lupita** + **2× le logo Revolución** + **1× le badge halal**

Ouvre un menu exclusif "Members Only" avec 3 cocktails ultra-premium réservés aux clients qui connaissent le code (à diffuser par bouche-à-oreille, carte de fidélité, ou lors d'événements VIP).

### Bouton de mise à jour

En bas à droite de chaque tablette, un bouton **Update** :
- Devient **Offline** quand la tablette n'a plus de Wi-Fi (visuel grisé)
- Permet de **forcer une mise à jour** quand le menu est modifié à distance (voir section Hébergement plus bas)

---

## Installation sur les tablettes

Le menu est livré sous forme d'un fichier `.apk` (application Android) installable en quelques minutes par tablette.

**Procédure d'installation** (à effectuer une fois par tablette) :

1. Activer "Sources inconnues" dans `Paramètres → Sécurité` de la tablette
2. Brancher la tablette au PC via USB en mode "Transfert de fichiers"
3. Copier le fichier `app-release.apk` sur la tablette
4. Ouvrir le gestionnaire de fichiers sur la tablette, taper l'APK, valider l'installation
5. L'icône de l'app apparaît sur l'écran d'accueil

**Mode kiosque** (empêche le client de quitter l'app) :

1. `Paramètres → Sécurité → Épinglage écran` : activer + demander un code PIN
2. Lancer l'app, faire un swipe vers le haut, appui long sur l'icône → "Épingler"
3. Le client ne peut plus sortir de l'application sans le code PIN du staff

**Démarrage automatique** au boot de la tablette : option configurable dans les paramètres Android.

---

## Tablettes recommandées

Pour une expérience optimale, choisir un modèle avec **Android 12 minimum** :

| Modèle | Prix indicatif | Recommandation |
|---|---|---|
| Lenovo Tab M9 | ~110 € | Bon entrée de gamme |
| Xiaomi Redmi Pad SE | ~140 € | Meilleur rapport qualité/prix |
| Samsung Galaxy Tab A9 | ~130 € | Robuste, qualité confirmée |

À éviter : tablettes "noname" sous 80 € (Android obsolète, rendu graphique cassé).

---

## Hébergement en ligne (option avancée)

Par défaut, le menu est intégralement contenu dans l'APK installé sur les tablettes — aucun serveur n'est requis, aucun coût mensuel.

**Limite** : pour modifier le menu (ajouter un plat, changer un prix), il faut produire un nouveau fichier APK et le réinstaller manuellement sur chaque tablette.

**Solution recommandée à long terme** : héberger le menu en ligne via **Tencent EdgeOne**, accessible depuis la Chine continentale sans licence ICP. Les tablettes récupèrent automatiquement la version la plus récente au démarrage ou quand le staff appuie sur le bouton **Update**.

📄 Guide détaillé : voir [docs/edgeone-setup.md](docs/edgeone-setup.md) — à transmettre à votre prestataire technique.

Coût estimé : 0 € à 5 €/mois selon le volume de tablettes.

---

## Niveaux de service

| Volume | Stratégie recommandée |
|---|---|
| 1-5 tablettes | Installation manuelle par USB, modifications occasionnelles |
| 5-15 tablettes | Hébergement Tencent EdgeOne pour modifications à distance |
| 15+ tablettes | EdgeOne + tableau de bord d'administration |

---

## Support

Pour toute évolution, bug ou question, contacter le prestataire technique avec :
- Une capture d'écran du problème
- Le modèle et la version Android de la tablette concernée
- L'identifiant de la tablette (si plusieurs)

Documentation technique pour la maintenance : [docs/dev.md](docs/dev.md).

---

*La Lupita × Revolución · Taqueria & Cocktail Bar · 塔可餐厅 & 鸡尾酒吧*
