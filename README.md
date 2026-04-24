# Loxone Icon Generator

> Générateur d'icônes PNG optimisé pour **Loxone Config** — 615 icônes officielles + 275 000+ icônes via Iconify.

🌐 **Application** : [jamsta.github.io/generateur-icone-png-loxone](https://jamsta.github.io/generateur-icone-png-loxone/)  
📦 **GitHub** : [github.com/Jamsta/generateur-icone-png-loxone](https://github.com/Jamsta/generateur-icone-png-loxone)

---

## Fonctionnalités

### Sources d'icônes

#### 1. Bibliothèque Loxone officielle
- **615 icônes SVG** officielles Loxone (v20260217)
- Recherche en temps réel parmi les 615 icônes
- Grille 5 colonnes avec scroll vertical

#### 2. Iconify — 275 000+ icônes
Accès à toutes les collections Iconify, organisées en deux groupes :

**Fill — Compatibles Loxone** (recommandé)

| Collection | Icônes |
|---|---|
| Material Symbols | 9 000+ |
| Material Design Icons | 7 000+ |
| Phosphor | 6 000+ |
| Fluent UI | 5 000+ |
| Remix Icons | 2 800+ |
| Bootstrap Icons | 2 000+ |
| Carbon | 2 000+ |
| Google Icons | 2 000+ |
| Font Awesome Solid | 1 400+ |
| Ionicons | 1 300+ |
| Clarity | 1 100+ |
| Unicons | 1 200+ |
| Jam Icons | 940+ |
| BoxIcons Solid | 800+ |
| css.gg | 700+ |

**Stroke — Style trait** (Iconoir, Tabler, Lucide, Feather, Heroicons…)

- Chargement automatique à la sélection de la collection
- Recherche par mot-clé dans la collection
- Chargement par lots de 80 avec scroll infini (IntersectionObserver)
- Cache des collections pour rechargement instantané

#### 3. Autres sources
- **URL directe** — n'importe quelle URL SVG (proxy CORS automatique)
- **Fichier local** — glisser-déposer ou sélection
- **Code SVG** — coller du code SVG brut

> 💡 **Tip IA** : Pour générer un SVG personnalisé, utilisez un outil IA (ChatGPT, Gemini, Claude…) en lui demandant de créer un SVG `viewBox="0 0 24 24"` fill-only. Copiez ensuite le code SVG dans l'onglet **Code** du générateur.

---

### Couleurs

#### Palette Loxone Config officielle
Les **9 couleurs exactes** du sélecteur Loxone Config :

| Couleur | Hex |
|---|---|
| Vert Loxone | `#85FF66` |
| Rose vif | `#FF1B66` |
| Orange | `#FF6E33` |
| Jaune | `#FFD93A` |
| Cyan | `#6EDFFF` |
| Magenta | `#FF5AD6` |
| Violet | `#9B6CFF` |
| Bleu | `#2D8BFF` |
| Gris | `#888888` |

#### Autres couleurs
- 21 couleurs supplémentaires (blancs, gris, verts, rouges, bleus, violets…)
- Sélecteur de couleur personnalisé + saisie hexadécimale
- Opacité de l'icône (0–100%)

---

### Prévisualisation

- Icône affichée en **noir** au chargement (état neutre)
- Couleur visible dans la prévisualisation **dès qu'une couleur est sélectionnée**
- Canvas haute résolution 256px
- Mini-aperçus en 48, 64 et 128px
- 4 fonds : clair, sombre, vert Loxone, damier (transparent)
- Colorisation correcte des icônes **fill ET stroke** (Iconify fill et stroke-only)

---

### Options d'export

| Option | Valeurs |
|---|---|
| Tailles PNG | 24, 36, 48, 64, 96, 128, 256, 512 px |
| Présélection Loxone | 48×48 et 128×128 |
| Marge intérieure | 0–40% |
| Arrondi fond | 0–50% |
| Rotation | 0–360° |
| Épaisseur du trait | 0 (auto) à 5px — pour les icônes stroke |
| Nommage | `icon_48x48.png` (format Loxone) |

### Export

- **PNG individuel** — taille la plus grande sélectionnée (affichée dans le bouton)
- **ZIP multi-tailles** — toutes les tailles en un téléchargement
- **Fond transparent** par défaut (PNG 32-bit)
- **SVG colorisé** optionnel dans le ZIP
- **Historique** des 24 dernières icônes générées avec re-téléchargement
- Message d'erreur explicite si aucune taille sélectionnée

---

## Specs techniques Loxone

| Propriété | Valeur |
|---|---|
| ViewBox | `0 0 24 24` |
| Fill paths | `black` → remplacé par la couleur choisie |
| Fill découpes | `none` → préservé (trous internes) |
| Stroke | colorisé comme le fill |
| `currentColor` | normalisé en `black` avant traitement |
| Fond export | transparent par défaut |
| Format | PNG 32-bit |
| Tailles cibles | 48×48 et 128×128 px |

---

## Stack technique

- **HTML / CSS / JavaScript** — vanilla, aucun framework
- **Canvas API** — rendu PNG natif haute qualité
- **JSZip** — génération ZIP côté client
- **Iconify API** — `https://api.iconify.design` (public, sans clé)
- **GitHub Pages** — hébergement statique

---

## Structure du projet

```
/
├── index.html        # Interface principale
├── app.js            # Logique (Iconify, colorisation, export PNG)
├── style.css         # Styles (thème clair pastel)
├── icons-data.js     # Liste des 615 noms d'icônes Loxone
├── icons/            # 615 fichiers SVG Loxone officiels
├── jszip.min.js      # Bibliothèque ZIP (offline)
└── docs/             # Copie miroir pour GitHub Pages
```

---

## Utilisation locale

```bash
git clone https://github.com/Jamsta/generateur-icone-png-loxone.git
cd generateur-icone-png-loxone
python3 -m http.server 3000
# Ouvrir http://localhost:3000
```

---

## Licences

- **Icônes Loxone** : © Loxone Electronics GmbH
- **Icônes Iconify** : licences variées selon la collection (Apache 2.0, MIT, OFL…)
- **Code source** : MIT
