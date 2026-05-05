# Projet Hagra - Plateforme de Preinscription Universitaire

Application React/Vite avec un backend Node.js/Express pour l'envoi et la verification des codes OTP.

## Prerequis

- Node.js 20 ou plus recent
- npm
- Un navigateur moderne
- Un compte SMTP/Gmail si vous voulez envoyer les codes OTP par email
- Docker Desktop (optionnel, recommande pour eviter les problemes d'environnement)

## Structure

```text
projet-hagra-main/
  src/                 Frontend React
  public/              Images et fichiers publics
  server/              Backend Express pour les OTP
  docker-compose.yml   Lancement Docker du frontend + backend
  package.json         Scripts du frontend
```

## Lancement rapide avec Docker

Si vous voulez eviter les problemes d'installation locale, utilisez Docker.

### 1. Configurer l'email OTP

Creer `server/.env` a partir de `server/.env.example` si ce n'est pas deja fait :

```powershell
Copy-Item server/.env.example server/.env
```

Exemple :

```env
PORT=3001
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application-google
```

Important : `SMTP_PASS` doit etre un mot de passe d'application Google si vous utilisez Gmail.

### 2. Construire et lancer les conteneurs

Dans la racine du projet :

```powershell
docker compose up --build
```

### 3. Ouvrir l'application

```text
http://localhost:8080
```

Dans ce mode :

- le frontend React est servi par Nginx ;
- le backend OTP tourne dans un conteneur Node ;
- les appels `/api/*` du frontend sont automatiquement rediriges vers le backend.

### Commandes Docker utiles

Arreter les conteneurs :

```powershell
docker compose down
```

Relancer en arriere-plan :

```powershell
docker compose up --build -d
```

Voir les logs :

```powershell
docker compose logs -f
```

Voir seulement le backend OTP :

```powershell
docker compose logs -f backend
```

## 1. Installer le frontend

Dans le dossier racine du projet :

```powershell
npm install
```

## 2. Configurer le backend OTP

Aller dans le dossier `server` :

```powershell
cd server
```

Creer un fichier `.env` a partir de l'exemple :

```powershell
Copy-Item .env.example .env
```

Exemple de configuration :

```env
PORT=3001
NODE_ENV=development

# Gmail / Google Workspace
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application-google
```

Important : avec Gmail ou Google Workspace, utilisez un mot de passe d'application Google pour `SMTP_PASS`. Le mot de passe normal du compte est souvent refuse.

Si `SMTP_USER` ou `SMTP_PASS` est vide, le serveur demarre mais l'envoi OTP echoue avec une erreur de configuration. Le code OTP n'est pas affiche dans l'interface.

Dans cette version, le code OTP ne doit pas etre affiche dans l'interface. Pour envoyer les codes par email, configurez obligatoirement :

```env
SMTP_USER=contact.hassan2.univ@gmail.com
SMTP_PASS=mot-de-passe-application-google
```

## 3. Installer le backend

Toujours dans `server/` :

```powershell
npm install
```

## 4. Lancer le backend

Dans `server/` :

```powershell
npm start
```

Le serveur doit afficher :

```text
Server running on http://localhost:3001
```

## 5. Lancer le frontend

Ouvrir un deuxieme terminal dans le dossier racine du projet :

```powershell
npm run dev
```

Ouvrir ensuite :

```text
http://127.0.0.1:5173/
```

## Ports deja utilises

Si le port `3001` est deja utilise, changez le port du backend dans `server/.env`, par exemple :

```env
PORT=3002
```

Puis creer un fichier `.env.local` dans la racine du projet :

```env
VITE_API_URL=http://localhost:3002
```

Si le port `5173` est deja utilise, lancez le frontend sur un autre port :

```powershell
npm run dev -- --host 127.0.0.1 --port 5174
```

Ouvrir alors :

```text
http://127.0.0.1:5174/
```

## Comptes de test

```text
Super Admin : admin@univh2c.ma / admin123
Manager     : manager@univh2c.ma / manager123
Etudiant    : ahmed@student.ma / student123
```

## Flux OTP

1. L'utilisateur cree un compte etudiant.
2. Le frontend appelle le backend sur `/api/send-otp`.
3. Le backend genere un code OTP valable 5 minutes.
4. Si SMTP est configure, le code est envoye par email.
5. Si SMTP est absent ou refuse, l'inscription affiche une erreur et le code n'est pas revele dans l'interface.
6. L'utilisateur saisit le code dans la page de verification OTP.

## Google Maps

La page Recherche utilise Google Maps via une iframe. Aucune cle API n'est necessaire, mais une connexion internet est requise pour afficher la carte.

## Scripts utiles

Dans le dossier racine :

```powershell
npm run dev       # lancer le frontend
npm run build     # compiler pour production
npm run preview   # previsualiser le build
npm run lint      # verifier le code avec ESLint
```

Dans `server/` :

```powershell
npm start         # lancer le serveur OTP
npm run dev       # lancer le serveur avec watch mode
```

## Verification rapide

Frontend :

```powershell
Invoke-WebRequest http://127.0.0.1:5173/
```

Backend :

```powershell
Invoke-WebRequest http://localhost:3001/api/verify-otp -Method POST -ContentType 'application/json' -Body '{}'
```

Une reponse `400 Bad Request` du backend est normale avec un body vide : elle confirme que l'API est accessible.

## Debug et validation

Avant de livrer ou lancer en production :

```powershell
npm run lint
npm run build
```

Dans `server/` :

```powershell
npm audit
node --check server.js
```

## Depannage

### Erreur SMTP Gmail

Verifier :

- l'adresse email ;
- le mot de passe d'application Google ;
- `SMTP_USER=contact.hassan2.univ@gmail.com` si vous utilisez le compte officiel configure pour ce projet ;
- `SMTP_HOST=smtp.gmail.com` ;
- `SMTP_PORT=587` ;
- `SMTP_SECURE=false`.

### Erreur de connexion au serveur OTP

Verifier que le backend est lance et que `VITE_API_URL` pointe vers le bon port.

### Page blanche frontend

Relancer :

```powershell
npm install
npm run dev
```

Puis ouvrir l'URL affichee par Vite.

## Securite

Ne jamais envoyer ni versionner le fichier `server/.env`. Il contient les identifiants SMTP. Le `.gitignore` du projet l'exclut deja.
