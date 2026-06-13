# 📢 Guide Google AdSense - Site Externe RétroBus Essonne

## ✅ Configuration terminée

Le code Google AdSense a été intégré avec succès sur le site public **association-rbe.fr**.

### 📍 Emplacements des publicités

1. **Bannière horizontale avant le footer** (toutes les pages)
   - Visible sur chaque page du site
   - Emplacement : juste avant le footer noir
   - Type : Bannière responsive horizontale

2. **Annonce dans la page d'accueil**
   - Entre la section Discord/Collection et "Nos Activités"
   - Type : Annonce in-article (intégrée au contenu)

### 📄 Fichier ads.txt configuré

Le fichier `ads.txt` a été créé et sera accessible à : `https://association-rbe.fr/ads.txt`

**Contenu du fichier** :
```
google.com, pub-2311147456651142, DIRECT, f08c47fec0942fa0
```

Ce fichier est **obligatoire** pour Google AdSense. Il indique aux annonceurs que vous êtes le propriétaire légitime du compte AdSense sur ce domaine.

### 🔧 Fichiers modifiés

- `externe/index.html` : Script AdSense ajouté dans le `<head>`
- `externe/src/components/AdSense.jsx` : Composant React créé
- `externe/src/components/Footer.jsx` : Bannière avant le footer
- `externe/src/pages/Home.jsx` : Annonce sur la page d'accueil

---

## 🎯 Comment utiliser le composant AdSense

### Importer le composant

```jsx
import AdSense, { 
  AdSenseHorizontal,    // Bannière horizontale
  AdSenseRectangle,     // Rectangle (sidebar)
  AdSenseInArticle,     // Dans un article
  AdSenseInFeed         // Dans une liste
} from "./components/AdSense";
```

### Exemples d'utilisation

#### 1. Bannière horizontale (header/footer)
```jsx
<AdSenseHorizontal />
```

#### 2. Rectangle dans une sidebar
```jsx
<AdSenseRectangle />
```

#### 3. Annonce dans un article/contenu
```jsx
<AdSenseInArticle />
```

#### 4. Annonce dans un flux/liste
```jsx
<AdSenseInFeed />
```

#### 5. Personnalisée avec options
```jsx
<AdSense 
  slot="1234567890"        // Optionnel : ID du slot spécifique
  format="auto"            // auto, horizontal, rectangle, vertical
  responsive={true}        // true/false
  type="display"           // display, in-article, in-feed
  style={{ margin: "20px 0" }}
/>
```

---

## 🚀 Activation en production

### Étapes importantes :

1. **Vérifier l'approbation Google AdSense**
   - Connectez-vous sur : https://adsense.google.com
   - Vérifiez que votre compte est approuvé
   - Vérifiez que le site `association-rbe.fr` est ajouté et vérifié

2. **Créer des emplacements publicitaires (optionnel)**
   - Dans AdSense > Annonces > Vue d'ensemble
   - Créer des blocs d'annonces avec des ID de slot spécifiques
   - Remplacer `slot="auto"` par vos ID de slot

3. **Tester en production**
   - Déployez sur Railway : `git push`
   - Les annonces n'apparaissent PAS en développement (localhost)
   - Elles apparaîtront uniquement sur `https://association-rbe.fr`

4. **Délai d'activation**
   - Peut prendre 24-48h après le premier déploiement
   - Google doit valider que le code est bien présent

---

## 💡 Bonnes pratiques

### ✅ À faire
- **Placer les annonces de manière naturelle** dans le contenu
- **Ne pas surcharger** : 2-3 annonces par page maximum
- **Tester différents emplacements** pour optimiser les revenus
- **Respecter les règles AdSense** (pas de clics frauduleux)

### ❌ À éviter
- **Ne jamais cliquer** sur vos propres annonces
- **Ne pas demander** aux visiteurs de cliquer
- **Ne pas placer trop d'annonces** (risque de bannissement)
- **Ne pas masquer** les annonces avec du CSS

---

## 📊 Suivi des performances

### Tableau de bord AdSense
- Accédez à : https://adsense.google.com
- Consultez les statistiques :
  - Nombre d'impressions
  - Taux de clics (CTR)
  - Revenus estimés
  - Performances par page

---

## 🆘 Dépannage

### Les annonces n'apparaissent pas

1. **En développement (localhost)** : **C'EST NORMAL** ✅
   - Les annonces montrent un placeholder gris
   - Elles n'apparaissent qu'en production

2. **En production** :
   - Vérifiez que votre compte AdSense est approuvé
   - Attendez 24-48h après le premier déploiement
   - Vérifiez la console navigateur (F12) pour les erreurs
   - Vérifiez que le site est ajouté dans AdSense

3. **Erreurs courantes** :
   - `adsbygoogle.push() error: No slot size` → Slot ID invalide
   - Annonces vides → Compte non approuvé ou site non vérifié
   - Annonces bloquées → Extension de blocage de pub active

---

## 🔄 Ajouter des annonces sur d'autres pages

### Exemple : Ajouter une annonce sur la page Véhicules

1. Ouvrir `externe/src/pages/Vehicles.jsx`
2. Importer le composant :
   ```jsx
   import { AdSenseInArticle } from "../components/AdSense";
   ```
3. Ajouter dans le JSX :
   ```jsx
   <Container maxW="7xl" py={8}>
     <AdSenseInArticle />
   </Container>
   ```

### Recommandations d'emplacements

| Page | Emplacement recommandé | Type |
|------|------------------------|------|
| Accueil | Entre sections | In-Article |
| Véhicules | Après la liste | Horizontal |
| Événements | Entre les événements | In-Feed |
| Articles/Blog | Milieu de l'article | In-Article |
| Contact | Bas de page | Rectangle |

---

## 📝 Informations du compte

- **ID Client** : `ca-pub-2311147456651142`
- **Site** : `association-rbe.fr`
- **Type de contenu** : Association, Patrimoine, Transport

---

## 🎓 Ressources

- [Centre d'aide AdSense](https://support.google.com/adsense)
- [Règles du programme AdSense](https://support.google.com/adsense/answer/48182)
- [Optimiser les performances](https://support.google.com/adsense/answer/9274025)

---

**✅ Configuration complète !** Vos publicités Google AdSense sont prêtes à générer des revenus dès que Google aura validé votre site.
