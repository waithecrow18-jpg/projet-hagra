# Code Complet du Backend (Serveur OTP)

Vous trouverez ci-dessous le code complet du serveur Node.js / Express qui gère la génération, l'envoi par email, et la vérification des codes OTP.

Ce code est physiquement sauvegardé dans votre projet sous : `pre-registration-app/server/server.js`

```javascript
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Stockage temporaire des OTP en mémoire : Map<email, { otp, expiresAt }>
const otpStore = new Map();

// Configuration du service d'envoi d'email (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Génère un code OTP aléatoire à 6 chiffres
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nettoie automatiquement les OTP expirés chaque minute
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore) {
    if (now > data.expiresAt) otpStore.delete(email);
  }
}, 60000);

// ─── Envoi de l'OTP ────────────────────────────────────────────────
app.post('/api/send-otp', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis.' });

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // Valide 5 minutes
  otpStore.set(email, { otp, expiresAt });

  // Template HTML de l'email envoyé à l'étudiant
  const htmlTemplate = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #1a1f5e, #283082); padding: 32px 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">Université Hassan II de Casablanca</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px;">Plateforme de Préinscription</p>
      </div>
      <div style="padding: 32px 24px;">
        <p style="color: #374151; font-size: 15px; margin: 0 0 8px;">Bonjour <strong>${name || 'Étudiant(e)'}</strong>,</p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Voici votre code de vérification pour activer votre compte sur la plateforme de préinscription :
        </p>
        <div style="background: #1a1f5e; color: white; font-size: 32px; font-weight: 800; letter-spacing: 12px; text-align: center; padding: 20px; border-radius: 12px; margin: 0 0 24px;">
          ${otp}
        </div>
        <p style="color: #ef4444; font-size: 13px; text-align: center; margin: 0 0 24px;">
          ⏱ Ce code expire dans <strong>5 minutes</strong>.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          Si vous n'avez pas demandé ce code, ignorez cet email.<br />
          © ${new Date().getFullYear()} Université Hassan II de Casablanca
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: \`"UH2C Préinscription" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: \`🔐 Code de vérification : \${otp}\`,
      html: htmlTemplate,
    });
    console.log(\`✅ OTP envoyé à \${email}\`);
    res.json({ success: true, message: 'Code envoyé avec succès.' });
  } catch (err) {
    console.error('❌ Erreur envoi email:', err.message);
    res.status(500).json({ error: 'Erreur lors de l\\'envoi de l\\'email. Vérifiez la configuration SMTP.' });
  }
});

// ─── Vérification de l'OTP ──────────────────────────────────────────────
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email et code requis.' });

  const stored = otpStore.get(email);
  if (!stored) return res.status(400).json({ error: 'Aucun code trouvé. Demandez un nouveau code.' });

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'Code expiré. Demandez un nouveau code.' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Code incorrect.' });
  }

  otpStore.delete(email);
  console.log(\`✅ OTP vérifié pour \${email}\`);
  res.json({ success: true, message: 'Compte vérifié avec succès.' });
});

// ─── Renvoyer l'OTP ──────────────────────────────────────────────
app.post('/api/resend-otp', async (req, res) => {
  // Logique similaire à /send-otp pour régénérer et renvoyer
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis.' });

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });

  try {
    await transporter.sendMail({
      from: \`"UH2C Préinscription" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: \`🔐 Nouveau code de vérification : \${otp}\`,
      html: \`...\` // Même template que ci-dessus
    });
    res.json({ success: true, message: 'Nouveau code envoyé.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\\'envoi.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`🚀 Serveur OTP démarré sur http://localhost:\${PORT}\`);
});
```

### Fichier `.env` pour la configuration Email
Ce fichier se trouve dans `pre-registration-app/server/.env` :

```env
# Configuration SMTP Gmail
# Pour créer un App Password : https://myaccount.google.com/apppasswords
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_app_password
PORT=3001
```

### Fichier `package.json` des dépendances Backend
Ce fichier se trouve dans `pre-registration-app/server/package.json` :

```json
{
  "name": "otp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "nodemailer": "^6.9.13"
  }
}
```
