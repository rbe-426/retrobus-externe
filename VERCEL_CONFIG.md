# Configuration Vercel pour EXTERNE

## ⚙️ Variables d'environnement à configurer

### Sur Vercel Dashboard

1. Aller sur : https://vercel.com/[votre-projet]/settings/environment-variables

2. Ajouter les variables suivantes :

#### **VITE_API_URL**
- **Name:** `VITE_API_URL`
- **Value:** `https://attractive-kindness-rbe-serveurs.up.railway.app`
- **Environments:** ✅ Production, ✅ Preview, ⚠️ Development (optionnel)

#### **VITE_EMAILJS_SERVICE_ID**
- **Name:** `VITE_EMAILJS_SERVICE_ID`
- **Value:** `service_3io7x5o`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### **VITE_EMAILJS_TEMPLATE_ID**
- **Name:** `VITE_EMAILJS_TEMPLATE_ID`
- **Value:** `template_j40smwl`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### **VITE_EMAILJS_PUBLIC_KEY**
- **Name:** `VITE_EMAILJS_PUBLIC_KEY`
- **Value:** `GhgeaI8LyQGYubsHDmHmc`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

---

## 🔄 Après configuration

1. **Redéployer** : Vercel → Deployments → Redeploy

2. **Vérifier** : 
   - Ouvrir la console du site en production (F12)
   - Chercher les logs qui contiennent l'URL de l'API
   - Doit voir : `https://attractive-kindness-rbe-serveurs.up.railway.app`
   - NE DOIT PAS voir : `localhost:8080` ou `localhost:4000`

---

## 🏠 Développement local

Pour le développement local, utilisez `.env.local` :

```env
VITE_API_URL=http://localhost:8080
PUBLIC_API_BASE=http://localhost:8080
```

Le fichier `.env.local` est prioritaire sur `.env` en local et n'est jamais commité (dans `.gitignore`).

---

## 📋 Fallback

Si `VITE_API_URL` n'est PAS défini sur Vercel, le code utilise automatiquement :
- **Fallback :** `https://attractive-kindness-rbe-serveurs.up.railway.app`

**⚠️ Important :** Même avec le fallback, il est recommandé de définir `VITE_API_URL` sur Vercel pour un contrôle explicite.

---

## ✅ Checklist

- [ ] Variables ajoutées sur Vercel Dashboard
- [ ] Redéploiement effectué
- [ ] Test en production (pas de localhost dans les logs)
- [ ] `.env.local` configuré pour le dev local
- [ ] `.env.local` dans `.gitignore`
