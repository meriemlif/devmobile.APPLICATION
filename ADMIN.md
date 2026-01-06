# 🔐 Compte Admin

## Informations de Connexion

**Email** : `admin@admin.com`  
**Mot de passe** : `admin123`

## Fonctionnalités Admin

Lorsque vous vous connectez avec le compte admin, vous aurez accès à :

### Onglet Admin (🛡️)
- **Créer de nouvelles salles** de formation
- Formulaire complet avec :
  - Nom de la salle *
  - Description
  - Capacité (nombre de personnes) *
  - Équipements (séparés par virgules)
  - Image (sélection depuis la galerie du téléphone ou image par défaut)

### Badge Admin
- Affichage du badge "Administrateur" sur votre profil
- Icône spéciale dans l'onglet Profile

## Comment Utiliser

### 1. Se Connecter en Admin

```
Email: admin@admin.com
Mot de passe: admin123
```

### 2. Créer une Salle

1. Allez dans l'onglet **Admin** (icône bouclier)
2. Remplissez le formulaire :
   - **Nom** : Salle Epsilon
   - **Description** : Salle de créativité avec équipements multimédias
   - **Capacité** : 12
   - **Équipements** : Tableau interactif, WiFi, Caméra 4K, Micros
   - **Image** : Cliquez sur "Choisir une image depuis le téléphone" pour sélectionner une photo, ou laissez vide pour l'image par défaut
3. Cliquez sur **"Créer la salle"**
4. ✅ La salle apparaît immédiatement dans la liste !

### 3. Gérer les Salles Existantes

Dans l'onglet Admin, vous verrez la liste de toutes les salles créées :

- **Voir les salles** : Liste complète avec nom et capacité
- **Rafraîchir** : Icône de rafraîchissement en haut à droite
- **Supprimer** : Bouton poubelle (🗑️) à côté de chaque salle
  - Confirmation requise avant suppression
  - La salle est supprimée définitivement

## Comparaison Utilisateur vs Admin

| Fonctionnalité | Utilisateur Normal | Admin |
|----------------|-------------------|-------|
| Voir les salles | ✅ | ✅ |
| Réserver | ✅ | ✅ |
| Annuler réservation | ✅ | ✅ |
| **Créer des salles** | ❌ | ✅ |
| **Supprimer des salles** | ❌ | ✅ |
| **Onglet Admin** | ❌ | ✅ |
| Badge spécial | ❌ | ✅ |

## Créer d'Autres Admins

Pour créer d'autres comptes admin, modifiez `localStorageService.js` et ajoutez des utilisateurs avec `role: 'admin'` dans `initializeWithDemoData()`.

## Notes

- Le compte admin est créé automatiquement au premier lancement
- Les salles créées sont stockées localement sur l'appareil
- Les modifications sont visibles immédiatement pour tous les utilisateurs de l'appareil
