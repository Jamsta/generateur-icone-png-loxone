# 🟢 Loxone Icon Generator

> Générateur d'icônes PNG optimisé pour **Loxone Config** — 615 icônes officielles + collections fill-only via Iconify.

🌐 **Application en ligne** : [jamsta.github.io/generateur-icone-png-loxone](https://jamsta.github.io/generateur-icone-png-loxone/)  
📦 **Dépôt GitHub** : [github.com/Jamsta/generateur-icone-png-loxone](https://github.com/Jamsta/generateur-icone-png-loxone)

---

## ✨ Fonctionnalités

### 📚 Sources d'icônes

#### 🏠 Bibliothèque Loxone officielle
- **615 icônes SVG** officielles Loxone (v20260217)
- Recherche en temps réel
- Scroll vertical fluide, 5 icônes par ligne
- Icônes affichées en **noir** dans la grille

#### 🌐 Iconify — Collections fill-only
Accès aux collections **uniquement fill** (conformes aux specs Loxone) :

| Collection | Icônes |
|---|---|
| Material Symbols Filled | 9 000+ |
| Material Design Icons | 7 000+ |
| Fluent UI Filled | 5 000+ |
| Remix Icons Filled | 2 800+ |
| Bootstrap Icons Filled | 2 000+ |
| Carbon | 2 000+ |
| Ionicons Filled | 1 300+ |
| Font Awesome Solid | 1 400+ |
| Clarity Solid | 1 100+ |
| Unicons | 1 200+ |
| Jam Icons | 940+ |
| BoxIcons Solid | 800+ |

> ⚠️ Les collections **stroke** (Tabler, Feather, Lucide…) sont volontairement exclues car non conformes au format Loxone (`fill` uniquement, pas de `stroke`).

- Recherche par terme dans la collection choisie
- Résultats affichés en **noir** dans la grille (fill forcé via l'API)
- Tous les résultats affichés à la suite avec scroll vertical (pas de pagination)
- Compteur de résultats

#### 🔗 URL directe
- Chargement depuis n'importe quelle URL SVG
- Proxy CORS automatique si nécessaire
- Compatible avec les URLs Iconify : `https://api.iconify.design/{prefix}/{name}.svg`

#### 📁 Import fichier
- Glisser-déposer ou sélection fichier SVG local

#### ✏️ Code SVG
- Coller directement du code SVG brut

---

### 🎨 Couleurs

#### Palette Loxone Config officielle
Les **9 couleurs exactes** du sélecteur Loxone Config, affichées sur fond sombre comme dans l'interface Loxone :

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

#### 21 couleurs supplémentaires
Blanc, gris, verts Loxone, oranges, rouges, bleus, violets, brun…

#### Couleur personnalisée
- Sélecteur de couleur natif
- Saisie hexadécimale directe
- Opacité de l'icône (0–100%)

#### Fond optionnel
- Couleur + opacité + arrondi des coins

---

### 🖼️ Prévisualisation
- **Icône toujours affichée en noir** dans la prévisualisation
- La couleur choisie s'applique **uniquement à l'export PNG**
- Canvas haute résolution 256px
- Mini-aperçus en 48, 64 et 128px
- 4 fonds : clair ☀️, sombre 🌙, vert Loxone 🟢, damier transparent ⬜

---

### ⚙️ Options d'export
| Option | Valeurs |
|---|---|
| Tailles PNG | 24, 36, 48, 64, 96, 128, 256, 512 px |
| Tailles Loxone | **48×48** et **128×128** (présélectionnées) |
| Marge intérieure | 0–40% |
| Arrondi fond | 0–50% |
| Rotation | 0–360° |
| Nommage | `icon_48x48.png` (format Loxone) |

---

### 📦 Export
- **PNG individuel** — taille la plus grande sélectionnée
- **ZIP multi-tailles** — toutes les tailles en un téléchargement
- **Fond transparent** par défaut (PNG 32-bit)
- **SVG colorisé** optionnel dans le ZIP
- **Historique** des 24 dernières icônes générées avec re-téléchargement

---

## 🏗️ Specs techniques Loxone respectées

| Propriété | Valeur |
|---|---|
| ViewBox | `0 0 24 24` |
| Fill paths | `black` → remplacé par la couleur à l'export |
| Fill découpes | `none` → **préservé** (trous internes) |
| Fill blanc | → **préservé** (découpes visuelles) |
| currentColor | → normalisé en `black` avant traitement |
| fill-rule | `evenodd` |
| clip-rule | `evenodd` |
| Fond export | transparent par défaut |
| Format | PNG 32-bit |
| Tailles cibles | 48×48 et 128×128 px |

---

## 🛠️ Stack technique

- **HTML / CSS / JavaScript** — vanilla, aucun framework
- **Canvas API** — rendu PNG natif haute qualité
- **JSZip** — génération ZIP côté client (offline)
- **Iconify API** — `https://api.iconify.design` (public, sans clé API)
- **GitHub Pages** — hébergement statique gratuit

---

## 📁 Structure du projet

```
/
├── index.html          # Interface principale
├── app.js              # Logique (Iconify, colorisation, export PNG)
├── style.css           # Styles
├── icons-data.js       # Liste des 615 noms d'icônes Loxone
├── icons/              # 615 fichiers SVG Loxone officiels (v20260217)
├── jszip.min.js        # Bibliothèque ZIP (locale, offline)
└── docs/               # Copie miroir pour GitHub Pages
```

---

## 🚀 Utilisation locale

```bash
git clone https://github.com/Jamsta/generateur-icone-png-loxone.git
cd generateur-icone-png-loxone
python3 -m http.server 3000
# Ouvrir http://localhost:3000
```

---

## 📄 Licences

- **Icônes Loxone** : © Loxone Electronics GmbH
- **Icônes Iconify** : licences variées selon la collection (Apache 2.0, MIT, OFL…)
- **Code source** : MIT
