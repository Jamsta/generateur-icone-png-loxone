# 🟢 Loxone Icon Generator

> Générateur d'icônes PNG optimisé pour **Loxone Config** — 615 icônes officielles + 275 000+ icônes via Iconify.

🌐 **Application en ligne** : [jamsta.github.io/generateur-icone-png-loxone](https://jamsta.github.io/generateur-icone-png-loxone/)

---

## ✨ Fonctionnalités

### 📚 Sources d'icônes
- **Bibliothèque Loxone officielle** — 615 icônes SVG (v20260217), recherche en temps réel
- **Iconify** — accès à 275 000+ icônes open-source via l'API publique (Material Design, Phosphor, Tabler, Heroicons, Carbon, Bootstrap Icons, Feather, Remix Icons, Font Awesome…) avec filtrage par collection et pagination
- **URL directe** — chargement depuis n'importe quelle URL SVG (avec proxy CORS automatique)
- **Import fichier** — glisser-déposer ou parcourir un SVG local
- **Code SVG** — coller directement du code SVG brut

### 🎨 Couleurs
- **Palette Loxone Config officielle** — les 9 couleurs exactes du sélecteur Loxone Config, affichées sur fond sombre comme dans l'interface Loxone
- **21 couleurs supplémentaires** — blanc, gris, verts Loxone, oranges, rouges, bleus, violets…
- **Couleur personnalisée** — sélecteur de couleur + saisie hexadécimale
- **Opacité de l'icône** — de 0 à 100%
- **Fond optionnel** — couleur + opacité + arrondi des coins

> 💡 La colorisation affecte uniquement les `fill` des paths (les traits/formes).  
> Les `fill="none"` sont préservés pour garder les découpes internes intactes — fidèle aux specs Loxone (`fill-rule: evenodd`, `clip-rule: evenodd`).

### ⚙️ Options d'export
- **8 tailles disponibles** : 24, 36, 48, 64, 96, 128, 256, 512 px
- **Tailles recommandées Loxone** : 48×48 et 128×128 px (présélectionnées)
- **Marge intérieure** (padding) : 0 à 40%
- **Arrondi du fond** : 0 à 50%
- **Rotation** : 0 à 360°
- **Nommage Loxone** : `icon_48x48.png`, `icon_128x128.png`
- **Export SVG colorisé** en option dans le ZIP

### 📦 Export
- **PNG individuel** — taille la plus grande sélectionnée
- **ZIP multi-tailles** — toutes les tailles cochées en un seul téléchargement
- **Fond transparent** par défaut (PNG 32-bit)
- **Historique** des 24 dernières icônes générées avec re-téléchargement

### 🖥️ Prévisualisation
- Canvas haute résolution 256px
- Mini-aperçu en 48, 64 et 128px
- 4 fonds de prévisualisation : clair, sombre, vert Loxone, damier transparent

---

## 🏗️ Specs techniques Loxone respectées

| Propriété | Valeur |
|-----------|--------|
| ViewBox | `0 0 24 24` |
| Fill icône | `black` → remplacé par la couleur choisie |
| Fill découpes | `none` → **préservé** |
| fill-rule | `evenodd` |
| clip-rule | `evenodd` |
| Fond | transparent par défaut |
| Format | PNG 32-bit |
| Tailles cibles | 48×48 et 128×128 px |

---

## 🛠️ Stack technique

- **HTML / CSS / JavaScript** — vanilla, aucun framework
- **Canvas API** — rendu PNG natif
- **JSZip** — génération de ZIP côté client
- **Iconify API** — `https://api.iconify.design` (public, sans clé)
- **GitHub Pages** — hébergement statique

---

## 📁 Structure

```
/
├── index.html          # Interface principale
├── app.js              # Logique applicative (Iconify, colorisation, export)
├── style.css           # Styles
├── icons-data.js       # Liste des 615 icônes Loxone officielles
├── icons/              # 615 fichiers SVG Loxone (v20260217)
├── jszip.min.js        # Bibliothèque ZIP locale
└── docs/               # Copie pour GitHub Pages
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

## 📄 Licence

Icônes Loxone : © Loxone Electronics GmbH  
Icônes Iconify : licences variées selon la collection (Apache 2.0, MIT…)  
Code : MIT
