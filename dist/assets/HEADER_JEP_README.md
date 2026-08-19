# Image header_jep.jpg manquante

⚠️ **Action requise** : Placez l'image du header événementiel ici.

## Emplacement
Copiez votre image de header événement (JEP ou autre) dans :
```
externe/public/assets/header_jep.jpg
```

## Spécifications recommandées
- **Format** : JPG ou WebP
- **Dimensions** : 1920x400px minimum (ratio 16:9 ou large)
- **Taille** : < 500 Ko (optimisé pour le web)
- **Contenu** : Image représentative de l'événement (véhicules, logo JEP, etc.)

## Utilisation
Cette image sera utilisée comme bannière du header quand le mode événement est actif.

## Alternative temporaire
Si vous n'avez pas encore d'image dédiée, vous pouvez :
1. Copier `header.jpg` en `header_jep.jpg`
2. Ou modifier `EventHeader.jsx` pour utiliser une autre image

## Comment tester
1. Placez l'image `header_jep.jpg` dans `externe/public/assets/`
2. Lancez `npm run dev` dans le dossier `externe`
3. Le mode événement devrait s'activer automatiquement en dev
4. Visitez `http://localhost:5173` pour voir le résultat
