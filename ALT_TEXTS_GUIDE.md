# Guide des Alt Texts - RétroBus Essonne

Ce document liste les bonnes pratiques et exemples d'alt texts pour améliorer l'accessibilité et le SEO.

## 🎯 Principes de base

### ✅ Bons alt texts
- **Descriptifs:** Décrivent précisément le contenu de l'image
- **Concis:** 125 caractères maximum (idéal)
- **Contextuels:** Adaptés au contexte de la page
- **Sans redondance:** Éviter "image de", "photo de"
- **Mots-clés naturels:** Intégrer des mots-clés pertinents sans forcer

### ❌ Mauvais alt texts
- ❌ `alt="IMG_1234.jpg"` - Nom de fichier
- ❌ `alt="image"` - Trop vague
- ❌ `alt=""` - Vide (sauf images décoratives)
- ❌ `alt="Photo de notre magnifique superbe incroyable bus..."` - Spam de mots-clés
- ❌ `alt="Cliquez ici pour voir"` - Description d'action

---

## 📸 Alt texts par type d'image

### Véhicules

#### Vue d'ensemble
```jsx
alt="Mercedes Citaro 920 RétroBus Essonne - Bus historique de 2001"
alt="Autocar Renault PR100 vintage - Collection RétroBus Essonne"
alt="Bus RATP Saviem SC10 restauré - Patrimoine transport francilien"
```

#### Détails techniques
```jsx
alt="Tableau de bord Mercedes Citaro 920 d'époque"
alt="Moteur restauré d'autobus Renault PR100"
alt="Plaque constructeur Saviem SC10 - 1976"
```

#### Extérieur
```jsx
alt="Façade avant Mercedes Citaro 920 - Livrée RATP authentique"
alt="Vue latérale complète autobus Renault PR100 vert"
alt="Arrière bus Saviem SC10 avec plaque d'immatriculation historique"
```

#### Intérieur
```jsx
alt="Sièges vintage d'époque à l'intérieur du bus Saviem SC10"
alt="Poste de conduite authentique Mercedes Citaro 920"
alt="Bouton poussoir d'arrêt d'origine - Bus RATP vintage"
```

### Événements

#### Sorties et expositions
```jsx
alt="Exposition bus historiques RétroBus Essonne - Journées du Patrimoine 2026"
alt="Sortie en Mercedes Citaro 920 - Balade patrimoine Essonne"
alt="Stand RétroBus Essonne lors du Rétro meeting d'Évry"
```

#### Visiteurs et participants
```jsx
alt="Visiteurs admirant la collection de bus anciens RétroBus Essonne"
alt="Enfants découvrant l'intérieur d'un bus historique lors d'une sortie"
alt="Passionnés d'automobile autour du Mercedes Citaro 920"
```

### Équipe

#### Portraits membres
```jsx
alt="Waiyl Belaidi - Président de l'association RétroBus Essonne"
alt="Méthusan Ravichandran - Vice-Président RétroBus Essonne"
alt="Jaffer Camaroudine - Membre du Conseil d'Administration RBE"
```

#### Actions équipe
```jsx
alt="Équipe RétroBus Essonne travaillant sur la restauration d'un bus"
alt="Mécaniciens bénévoles réparant le moteur d'un autocar ancien"
alt="Membres de l'association lors d'une sortie en bus historique"
```

### Galerie photos

#### Événements passés
```jsx
alt="RétroBus Essonne aux Journées du Patrimoine 2025 - Corbeil-Essonnes"
alt="Mercedes Citaro 920 en exposition au Musée des Transports"
alt="Balade en bus vintage dans les rues de l'Essonne"
```

#### Restaurations
```jsx
alt="Avant/après restauration du Renault PR100 par RétroBus Essonne"
alt="Travaux de peinture sur la carrosserie du Saviem SC10"
alt="Démontage moteur pour restauration complète - Atelier RBE"
```

### Logo et branding

```jsx
alt="Logo RétroBus Essonne - Association patrimoine automobile"
alt="Logo RBE avec silhouette de bus vintage"
alt=""  // Si logo décoratif déjà décrit dans le texte
```

### Illustrations et graphiques

```jsx
alt="Schéma technique Mercedes Citaro 920 avec annotations"
alt="Graphique évolution de la collection RétroBus Essonne 2020-2026"
alt="Carte des sorties en bus historiques en Île-de-France"
```

---

## 🗂️ Alt texts par page

### Page d'accueil (Home.jsx)

```jsx
// Hero image
alt="Mercedes Citaro 920 RétroBus Essonne - Plus ancien Citaro préservé en France"

// Cards véhicules
alt="Mercedes Citaro 920 - Bus urbain historique de l'association"
alt="Renault PR100 - Autocar interurbain vintage collection RBE"
alt="Saviem SC10 - Bus RATP des années 70 restauré"

// Galerie photos
alt="Bus historiques lors des Journées Européennes du Patrimoine"
alt="Sortie en Mercedes Citaro dans les rues de Corbeil-Essonnes"
alt="Intérieur authentique d'un bus RATP des années 2000"
```

### Page Véhicules (Vehicles.jsx)

```jsx
// Card principale
alt="{marque} {modele} - Bus {type} de {année} - Collection RétroBus Essonne"

// Exemple concret
alt="Mercedes Citaro 920 - Bus urbain de 2001 - Collection RétroBus Essonne"
alt="Renault PR100 - Autocar interurbain de 1985 - Patrimoine RBE"

// Background image
alt="Vue panoramique {marque} {modele} sur route historique"

// Thumbnail
alt="Miniature {marque} {modele} {parc}"
```

### Page Détails Véhicule (VehicleDetails.jsx)

```jsx
// Galerie principale
images.map(img => ({
  alt: `${vehicule.marque} ${vehicule.modele} - Vue ${index + 1} - ${description}`
}))

// Exemple
alt="Mercedes Citaro 920 - Vue façade avant avec livrée RATP"
alt="Mercedes Citaro 920 - Vue intérieur sièges passagers"
alt="Mercedes Citaro 920 - Poste de conduite avec tableau de bord"
```

### Page Événements (Events.jsx)

```jsx
// Card événement
alt="{titre événement} - RétroBus Essonne le {date} à {lieu}"

// Exemple
alt="Journées du Patrimoine 2026 - RétroBus Essonne le 20 septembre à Corbeil"
alt="Balade en bus vintage - Sortie RBE du 15 juillet en Essonne"

// Sans image spécifique
alt="" // Si image purement décorative
```

### Page Équipe (Team.jsx)

```jsx
// Photo membre
alt="{nom complet} - {rôle} de l'association RétroBus Essonne"

// Exemples
alt="Waiyl Belaidi - Président de l'association RétroBus Essonne"
alt="Méthusan Ravichandran - Vice-Président RétroBus Essonne"
alt="Jaffer Camaroudine - Membre du Conseil d'Administration RBE"

// Sans photo
alt="{initiales} - {nom}" // Placeholder avec initiales
```

### Page Photos (Photos.jsx)

```jsx
// Images galerie
alt="Photo {numéro} - {description courte de l'événement/véhicule}"

// Exemples
alt="Photo 1 - Mercedes Citaro 920 en exposition patrimoine"
alt="Photo 2 - Sortie bus vintage en Essonne"
alt="Photo 3 - Restauration d'un autocar Renault PR100"
alt="Photo 4 - Équipe RétroBus lors des Journées du Patrimoine"
```

### Page Contact (Contact.jsx)

```jsx
// Image hero/background
alt="Contactez RétroBus Essonne - Bureau de l'association"
alt="Siège social RétroBus Essonne en Essonne"

// Illustration formulaire
alt="" // Si purement décorative
```

### Page À propos (About.jsx)

```jsx
// Photo d'équipe
alt="Équipe complète de l'association RétroBus Essonne - Membres et bénévoles"

// Historique
alt="Fondation de RétroBus Essonne en 2025 - Photo historique"

// Atelier/garage
alt="Atelier de restauration RétroBus Essonne - Garage patrimoine automobile"
```

### Page RétroMerch (RetroMerch.jsx)

```jsx
// Produits
alt="{Nom produit} - Goodies RétroBus Essonne"

// Exemples
alt="T-shirt logo RétroBus Essonne - Vêtement officiel RBE"
alt="Mug collection Mercedes Citaro 920 - Goodies association"
alt="Casquette RétroBus vintage - Accessoire patrimoine automobile"

// Bannière boutique
alt="Boutique officielle RétroMerch - Goodies RétroBus Essonne"
```

### Page OMSI Addon (OmsiAddon.jsx)

```jsx
// Screenshots addon
alt="Addon OMSI 2 Réseau TICE - Capture d'écran gameplay"
alt="Bus virtuel Mercedes Citaro dans OMSI 2 - Mod RétroBus Essonne"
alt="Carte réseau TICE pour OMSI 2 - DLC en développement"

// Hero image
alt="Logo Addon OMSI 2 Réseau TICE par RétroBus Essonne"
```

---

## 🔧 Implémentation

### React/JSX

```jsx
// Basique
<img 
  src="/assets/photo.jpg" 
  alt="Mercedes Citaro 920 - Bus historique RétroBus Essonne"
/>

// Avec Chakra UI
<Image 
  src={vehicle.image}
  alt={`${vehicle.marque} ${vehicle.modele} - ${vehicle.description}`}
/>

// Dynamique
<img
  src={member.image}
  alt={`${member.name} - ${member.role} de l'association RétroBus Essonne`}
/>

// Background image (CSS) - Utiliser aria-label
<Box
  backgroundImage={heroImg}
  aria-label="Mercedes Citaro 920 sur route historique d'Essonne"
>
  {children}
</Box>
```

### Images décoratives

Pour les images purement décoratives (bordures, séparateurs, motifs):
```jsx
<img src="/decorative.svg" alt="" role="presentation" />
```

---

## 📏 Longueur idéale

- **Minimum:** 10 caractères (trop court manque de contexte)
- **Idéal:** 50-125 caractères (équilibre description/longueur)
- **Maximum:** 125 caractères (limite screen readers)
- **Absolu:** 250 caractères (limite technique HTML)

### Exemples par longueur

**50 caractères:**
```
alt="Bus Citaro 920 - Collection RétroBus Essonne"
```

**100 caractères:**
```
alt="Mercedes Citaro 920 de 2001 - Plus ancien Citaro préservé en France - RétroBus Essonne"
```

**125 caractères (limite):**
```
alt="Mercedes Citaro 920 livrée RATP lors des Journées du Patrimoine 2026 à Corbeil-Essonnes - Collection RétroBus Essonne"
```

---

## ✅ Checklist validation

Avant de publier, vérifier que chaque alt text:

- [ ] Décrit précisément le contenu visuel
- [ ] Contient 50-125 caractères
- [ ] Inclut le nom du véhicule/événement si pertinent
- [ ] Mentionne "RétroBus Essonne" ou "RBE" quand approprié
- [ ] Intègre naturellement des mots-clés SEO
- [ ] N'utilise pas de formules génériques ("image", "photo de")
- [ ] Est unique (pas de copier-coller)
- [ ] Apporte une valeur pour l'accessibilité
- [ ] Fait sens hors contexte visuel

---

## 🛠️ Outils de test

### Validation accessibilité
- **WAVE** (WebAIM) - Extension navigateur
- **axe DevTools** - Extension Chrome/Firefox
- **Lighthouse** - Audit Chrome DevTools

### Test screen reader
- **NVDA** (Windows) - Gratuit
- **JAWS** (Windows) - Payant
- **VoiceOver** (Mac) - Intégré

---

## 📊 Impact SEO des alt texts

### Bénéfices directs
- ✅ **Google Images:** Meilleur référencement dans la recherche d'images
- ✅ **Mots-clés:** Renforce la pertinence thématique de la page
- ✅ **Contexte:** Aide Google à comprendre le contenu
- ✅ **Accessibilité:** Améliore le score qualité global

### Bonnes pratiques SEO
- Varier les formulations (éviter répétitions)
- Inclure des synonymes naturels
- Mentionner la localisation si pertinente
- Décrire l'action/contexte visible

### À éviter (pénalités)
- ❌ Bourrage de mots-clés (keyword stuffing)
- ❌ Alt texts identiques sur toutes les images
- ❌ Descriptions non pertinentes
- ❌ Texte caché pour les moteurs uniquement

---

## 📞 Support

Questions sur les alt texts:
- **Documentation:** Ce fichier
- **Référence W3C:** https://www.w3.org/WAI/tutorials/images/
- **Contact:** contact@association-rbe.fr

---

**Dernière mise à jour:** 2026-06-16  
**Version:** 1.0  
**Auteur:** Équipe technique RétroBus Essonne
