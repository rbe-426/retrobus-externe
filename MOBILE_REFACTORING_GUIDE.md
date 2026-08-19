# 📱 Guide de Refactorisation Mobile - Site Externe RBE

## ✅ Stratégie Adoptée : Show/Hide

### Principe
**Ne PAS modifier le design desktop** - Garder intact le code original avec ses marges négatives et débordements.  
**Créer des versions mobiles séparées** avec `<Show below="md">` et `<Hide below="md">`.

### Exemple de Pattern Utilisé

```jsx
{/* Version Desktop - Design original INTACT */}
<Hide below="md">
  <VStack ml={-48} w="calc(100% + 96px)">
    {/* Code desktop original avec débordements */}
  </VStack>
</Hide>

{/* Version Mobile - Alternative simplifiée */}
<Show below="md">
  <VStack spacing={6}>
    {/* Version mobile sans débordements */}
  </VStack>
</Show>
```

---

## ✅ Modifications Appliquées

### 1. **Page Home.jsx - Approche Dual Layout**

#### Hero Section
- ✅ **Desktop** : Design original avec classes CSS `.full-bleed .hero`
- ✅ **Mobile** : Version séparée avec layout centré, boutons full-width
- Breakpoint de switch : `md` (768px)

#### Collection & Discord Section
- ✅ **Desktop** : `ml={-48}` et `w="calc(100% + 96px)"` conservés
- ✅ **Desktop** : Discord widget `w="135%"` conservé
- ✅ **Mobile** : Layout vertical sans débordements, widget 100% width
- Breakpoint : `lg` (992px) pour cette section

#### Autres Sections
- ✅ Toutes restaurées au design desktop original
- ✅ Responsive props Chakra supprimées
- ✅ `py={16}`, `size="xl"`, `p={8}` fixes conservés

---

## 🎯 Breakpoints Chakra UI

```javascript
{
  base: "0px",      // Mobile (0-767px)
  md: "768px",      // Desktop (768px+)
  lg: "992px",      // Large desktop
}
```

**Règle** : Utiliser `<Hide below="md">` pour desktop, `<Show below="md">` pour mobile.

---

## 📋 Checklist pour Autres Pages

### Pattern à Appliquer

```jsx
import { Show, Hide } from "@chakra-ui/react";

{/* Desktop - Code original */}
<Hide below="md">
  {/* Garder EXACTEMENT le code original */}
</Hide>

{/* Mobile - Version adaptée */}
<Show below="md">
  {/* Layout mobile simplifié */}
</Show>
```

### ❌ NE PAS FAIRE
- ❌ Ajouter des props responsive `{{ base: "x", md: "y" }}`
- ❌ Modifier le design desktop existant
- ❌ Supprimer les marges négatives desktop
- ❌ Toucher aux largeurs en pourcentage > 100%

### ✅ FAIRE
- ✅ Dupliquer le bloc avec Show/Hide
- ✅ Garder le code desktop intact
- ✅ Créer une version mobile indépendante
- ✅ Tester sur vraie device mobile

---

## 🚀 Prochaines Pages

### Priorité Haute
1. **Vehicles.jsx** 
   - Desktop : Grid existante
   - Mobile : Cards verticales

2. **Events.jsx**
   - Desktop : Layout existant
   - Mobile : Liste simplifiée

3. **Contact.jsx**
   - Desktop : Formulaire existant
   - Mobile : Champs full-width

---

## 🛠️ Commandes

```bash
# Build
cd externe
npm run build

# Dev
npm run dev
```
