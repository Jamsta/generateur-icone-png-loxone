# Loxone Icon Generator

> Générateur d'icônes PNG optimisé pour **Loxone Config** — 615 icônes officielles + 275 000+ icônes via Iconify.

🌐 **Application** : [jamsta.github.io/generateur-icone-png-loxone](https://jamsta.github.io/generateur-icone-png-loxone/)  
📦 **GitHub** : [github.com/Jamsta/generateur-icone-png-loxone](https://github.com/Jamsta/generateur-icone-png-loxone)

---

## Fonctionnalités

### 1. Sources SVG

#### Bibliothèque Loxone officielle
- **615 icônes SVG** officielles Loxone
- Recherche en temps réel

#### Iconify — 275 000+ icônes
Deux groupes de collections :

**Fill **

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

**Stroke — Style trait**

| Collection | Icônes |
|---|---|
| Tabler Icons | 5 000+ |
| Lucide | 1 500+ |
| Iconoir | 1 300+ |
| Heroicons | 900+ |
| Majesticons | 900+ |
| Feather | 300+ |
| Radix Icons | 300+ |
| Mynaui | 400+ |

- Chargement automatique à la sélection
- Recherche par mot-clé
- Chargement par lots de 80 avec scroll infini (IntersectionObserver)
- Cache des collections pour rechargement instantané

#### Autres sources
- **URL directe** — n'importe quelle URL SVG (proxy CORS automatique)
- **Fichier local** — glisser-déposer ou sélection
- **Code SVG** — coller du code SVG brut

> 💡 **Astuce** : Pour générer un SVG personnalisé, utilisez un outil IA (ChatGPT, Gemini, Claude…) en lui demandant de créer un SVG `viewBox="0 0 24 24"` fill-only. Copiez ensuite le code SVG dans l'onglet **Code** du générateur.

---

### 2. Couleurs

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
- Contrôle d'opacité (0–100%)

---

### 3. Prévisualisation

- Icône affichée en **noir** au chargement (état neutre)
- La couleur apparaît dans la prévisualisation **dès qu'une couleur est sélectionnée**
- Canvas haute résolution 256px
- Mini-aperçus en 48, 64 et 128px
- 4 fonds : sombre, clair, vert Loxone, damier (transparent)
- Colorisation correcte des icônes **fill ET stroke** (y compris héritage depuis la racine SVG)

---

### 4. Options d'export

| Option | Détail |
|---|---|
| Tailles PNG | 24, 36, 48, 64, 96, 128, 256, 512 px |
| Présélection Loxone | 48×48 et 128×128 px |
| Marge intérieure | 0–40% |
| Arrondi fond | 0–50% |
| Rotation | 0–360° |
| Épaisseur du trait | Dropdown style Iconify : `Auto` (origine) à 5 px, pas de 0.25 px |
| Nommage | Format Loxone : `icon_48x48.png` |

#### Export
- **PNG individuel** — taille la plus grande sélectionnée (affichée dans le bouton)
- **ZIP multi-tailles** — toutes les tailles en un téléchargement
- **Fond transparent** par défaut (PNG 32-bit)
- **SVG colorisé** optionnel dans le ZIP
- **Historique** des 24 dernières icônes générées
- Message d'erreur explicite si aucune taille sélectionnée

---

## Qualité des PNG

Le rendu repose sur le moteur SVG natif du navigateur via Canvas API :

- Le SVG est un format **vectoriel** rastérisé à la taille exacte demandée
- Un PNG 128×128 = **128×128 pixels parfaits**, sans interpolation ni compression avec perte
- La qualité est identique à 48px ou 512px — seule la résolution change

---

## Specs techniques Loxone

| Propriété | Valeur |
|---|---|
| ViewBox | `0 0 24 24` |
| Fill paths | `black` → remplacé par la couleur choisie |
| Fill découpes | `none` → préservé (trous internes) |
| Stroke | colorisé comme le fill, héritage racine SVG géré |
| `currentColor` | normalisé en `black` avant traitement |
| Fond export | transparent par défaut |
| Format | PNG 32-bit |
| Tailles cibles Loxone | 48×48 et 128×128 px |

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
