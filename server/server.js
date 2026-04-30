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
let mailerWarning = '';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const buildOtpTemplate = (name, otp, introText) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #1a1f5e, #283082); padding: 32px 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">Universite Hassan II de Casablanca</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px;">Plateforme de Preinscription</p>
    </div>
    <div style="padding: 32px 24px;">
      <p style="color: #374151; font-size: 15px; margin: 0 0 8px;">Bonjour <strong>${name || 'Etudiant(e)'}</strong>,</p>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
        ${introText}
      </p>
      <div style="background: #1a1f5e; color: white; font-size: 32px; font-weight: 800; letter-spacing: 12px; text-align: center; padding: 20px; border-radius: 12px; margin: 0 0 24px;">
        ${otp}
      </div>
      <p style="color: #ef4444; font-size: 13px; text-align: center; margin: 0 0 24px;">
        Ce code expire dans <strong>5 minutes</strong>.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
        Si vous n'avez pas demande ce code, ignorez cet email.<br />
        &copy; ${new Date().getFullYear()} Universite Hassan II de Casablanca
      </p>
    </div>
  </div>
`;

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

const createDevTransport = () => nodemailer.createTransport({
  jsonTransport: true,
});

const formatMailerError = (error) => {
  if (error?.code === 'EAUTH' || error?.responseCode === 535) {
    return "Connexion Gmail refusee. Utilisez un mot de passe d'application Google dans server/.env.";
  }

  if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNECTION') {
    return "Connexion SMTP impossible. Verifiez votre connexion internet et les parametres Gmail.";
  }

  return "Le serveur email n'a pas pu envoyer le code OTP.";
};

const createOtpResponse = (message, otp) => {
  if (mailerMode !== 'development') {
    return {
      success: true,
      message,
      deliveryMode: 'email',
    };
  }

  return {
    success: true,
    message: `${message} (mode local)`,
    devOtp: otp,
    deliveryMode: 'development',
    warning: mailerWarning || "SMTP Gmail indisponible. Le code OTP est fourni localement pour les tests.",
  };
};

async function initEmailService() {
  const hasSmtpCredentials = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasSmtpCredentials) {
    if (isProduction) {
      throw new Error("Configuration SMTP manquante. Ajoutez SMTP_USER et SMTP_PASS.");
    }

    transporter = createDevTransport();
    mailerMode = 'development';
    mailerWarning = "Configuration SMTP manquante. Ajoutez un mot de passe d'application Gmail pour envoyer de vrais emails.";
    console.warn(`EMAIL_MODE=${mailerMode}: ${mailerWarning}`);
    return;
  }

  const gmailTransport = createSmtpTransport();

  try {
    await gmailTransport.verify();
    transporter = gmailTransport;
    mailerMode = 'gmail';
    mailerWarning = '';
    console.log(`EMAIL_MODE=${mailerMode}: Gmail SMTP pret.`);
  } catch (error) {
    const readableError = formatMailerError(error);

    if (isProduction) {
      throw new Error(readableError);
    }

    transporter = createDevTransport();
    mailerMode = 'development';
    mailerWarning = readableError;
    console.warn(`EMAIL_MODE=${mailerMode}: ${readableError}`);
  }
}

async function sendOtpEmail({ email, name, otp, subject, introText }) {
  if (!transporter) {
    throw new Error("Le service email n'est pas initialise.");
  }

  const html = buildOtpTemplate(name, otp, introText);

  await transporter.sendMail({
    from: `"UH2C Preinscription" <${process.env.SMTP_USER || 'no-reply@uh2c.ma'}>`,
    to: email,
    subject,
    html,
  });

  if (mailerMode === 'development') {
    console.warn(`[DEV OTP] ${email}: ${otp}`);
  } else {
    console.log(`OTP envoye a ${email}`);
  }

  return createOtpResponse('Code envoye avec succes.', otp);
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
      subject: `Code de verification : ${otp}`,
      introText: "Voici votre code de verification pour activer votre compte sur la plateforme de preinscription :",
    });

    return res.json(response);
  } catch (error) {
    otpStore.delete(email);
    const readableError = formatMailerError(error);
    console.error('Erreur envoi email:', error.message);
    return res.status(500).json({ error: readableError });
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
      subject: `Nouveau code de verification : ${otp}`,
      introText: 'Voici votre nouveau code de verification :',
    });

    return res.json({
      ...response,
      message: mailerMode === 'development' ? 'Nouveau code genere (mode local).' : 'Nouveau code envoye.',
    });
  } catch (error) {
    otpStore.delete(email);
    const readableError = formatMailerError(error);
    console.error('Erreur renvoi email:', error.message);
    return res.status(500).json({ error: readableError });
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
