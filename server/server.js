import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const otpStore = new Map();
const PORT = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === 'production';

let transporter = null;
let mailerMode = 'uninitialized';
const USER_VISIBLE_EMAIL_ERROR = "Le service email est indisponible pour le moment. Veuillez contacter l'administrateur.";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const buildOtpTemplate = (name, otp, introText) => `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937; background: #ffffff; border: 1px solid #d1d5db;">
    <div style="padding: 24px 24px 8px;">
      <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">Universite Hassan II de Casablanca</p>
      <p style="margin: 0; font-size: 14px; color: #4b5563;">Plateforme de preinscription</p>
    </div>
    <div style="padding: 24px;">
      <p style="margin: 0 0 16px; font-size: 15px;">Bonjour <strong>${name || 'Etudiant(e)'}</strong>,</p>
      <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6;">
        ${introText}
      </p>
      <div style="margin: 0 0 20px; padding: 16px; border: 1px solid #1a1f5e; background: #f8fafc; text-align: center;">
        <span style="display: block; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1a1f5e;">${otp}</span>
      </div>
      <p style="margin: 0 0 20px; font-size: 14px;">
        Ce code expire dans <strong>5 minutes</strong>.
      </p>
      <p style="margin: 0; font-size: 13px; color: #6b7280;">
        Si vous n'avez pas demande ce code, vous pouvez ignorer cet email.
      </p>
    </div>
  </div>
`;

const buildOtpText = (name, otp, introText) => `
Universite Hassan II de Casablanca
Plateforme de preinscription

Bonjour ${name || 'Etudiant(e)'},

${introText}

Code de verification: ${otp}

Ce code expire dans 5 minutes.

Si vous n'avez pas demande ce code, vous pouvez ignorer cet email.
`.trim();

const createSmtpTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const formatMailerError = (error) => {
  if (error?.message?.includes('Configuration SMTP')) {
    return error.message;
  }

  if (error?.code === 'EAUTH' || error?.responseCode === 535) {
    return "Connexion Gmail refusee. Utilisez un mot de passe d'application Google dans server/.env.";
  }

  if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNECTION') {
    return "Connexion SMTP impossible. Verifiez votre connexion internet et les parametres Gmail.";
  }

  return "Le serveur email n'a pas pu envoyer le code OTP.";
};

const createOtpResponse = (message) => {
  return {
    success: true,
    message,
    deliveryMode: 'email',
  };
};

async function initEmailService() {
  const hasSmtpCredentials = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasSmtpCredentials) {
    transporter = null;
    mailerMode = 'disabled';
    console.warn("EMAIL_MODE=disabled: Configuration SMTP manquante. Ajoutez SMTP_USER et SMTP_PASS dans server/.env.");
    return;
  }

  const gmailTransport = createSmtpTransport();

  try {
    await gmailTransport.verify();
    transporter = gmailTransport;
    mailerMode = 'gmail';
    console.log(`EMAIL_MODE=${mailerMode}: Gmail SMTP pret.`);
  } catch (error) {
    const readableError = formatMailerError(error);

    if (isProduction) {
      throw new Error(readableError);
    }

    transporter = null;
    mailerMode = 'disabled';
    console.warn(`EMAIL_MODE=${mailerMode}: ${readableError}`);
  }
}

async function sendOtpEmail({ email, name, otp, subject, introText }) {
  if (!transporter) {
    throw new Error("Configuration SMTP manquante ou refusee. Ajoutez un mot de passe d'application Gmail valide dans server/.env.");
  }

  const html = buildOtpTemplate(name, otp, introText);
  const text = buildOtpText(name, otp, introText);

  const info = await transporter.sendMail({
    from: `"UH2C Preinscription" <${process.env.SMTP_USER || 'no-reply@uh2c.ma'}>`,
    replyTo: process.env.SMTP_USER || 'no-reply@uh2c.ma',
    to: email,
    subject,
    text,
    html,
  });

  console.log(`OTP envoye a ${email}`);
  console.log(`SMTP accepted=${info.accepted.join(',')} rejected=${info.rejected.join(',') || 'none'} messageId=${info.messageId}`);

  return createOtpResponse('Code envoye avec succes.');
}

setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 60000);

app.post('/api/send-otp', async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email requis.' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });

  try {
    const response = await sendOtpEmail({
      email,
      name,
      otp,
      subject: 'Votre code de verification UH2C',
      introText: "Voici votre code de verification pour activer votre compte sur la plateforme de preinscription :",
    });

    return res.json(response);
  } catch (error) {
    otpStore.delete(email);
    const readableError = formatMailerError(error);
    console.error('Erreur envoi email:', error.message);
    console.error('Detail SMTP:', readableError);
    return res.status(500).json({ error: USER_VISIBLE_EMAIL_ERROR });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email et code requis.' });
  }

  const stored = otpStore.get(email);
  if (!stored) {
    return res.status(400).json({ error: 'Aucun code trouve. Demandez un nouveau code.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'Code expire. Demandez un nouveau code.' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Code incorrect.' });
  }

  otpStore.delete(email);
  console.log(`OTP verifie pour ${email}`);
  return res.json({ success: true, message: 'Compte verifie avec succes.' });
});

app.post('/api/resend-otp', async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email requis.' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });

  try {
    const response = await sendOtpEmail({
      email,
      name,
      otp,
      subject: 'Votre nouveau code de verification UH2C',
      introText: 'Voici votre nouveau code de verification :',
    });

    return res.json({
      ...response,
      message: 'Nouveau code envoye.',
    });
  } catch (error) {
    otpStore.delete(email);
    const readableError = formatMailerError(error);
    console.error('Erreur renvoi email:', error.message);
    console.error('Detail SMTP:', readableError);
    return res.status(500).json({ error: USER_VISIBLE_EMAIL_ERROR });
  }
});

async function startServer() {
  try {
    await initEmailService();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de demarrer le serveur OTP:', error.message);
    process.exit(1);
  }
}

startServer();
