import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../Student.module.css';

const FAQS = [
  {
    q: 'Quels documents sont nécessaires pour la préinscription ?',
    a: 'Vous aurez besoin de votre CIN, relevé de notes du baccalauréat, numéro CNE/Massar, et une photo d\'identité récente au format numérique (JPG/PNG).',
  },
  {
    q: 'Quelle est la date limite pour soumettre le dossier ?',
    a: 'Les dossiers de préinscription pour la session 2024-2025 doivent être soumis avant le 30 septembre 2024. Passé ce délai, aucun dossier ne sera accepté.',
  },
  {
    q: 'Comment puis-je suivre l\'état de ma demande ?',
    a: 'Après soumission, vous recevrez un numéro de référence unique. Connectez-vous à votre espace étudiant pour consulter l\'état de votre dossier à tout moment.',
  },
  {
    q: 'Puis-je modifier mon dossier après soumission ?',
    a: 'Les modifications sont possibles uniquement avant la date limite. Contactez l\'administration de l\'établissement choisi pour toute modification urgente après soumission.',
  },
  {
    q: 'Comment fonctionne la couverture AMO étudiant ?',
    a: 'L\'AMO (Assurance Maladie Obligatoire) est proposée aux étudiants inscrits. Vous devez fournir vos informations de couverture lors de la préinscription. Si vous n\'en possédez pas, cochez la case correspondante.',
  },
  {
    q: 'Quels sont les critères d\'admission ?',
    a: 'Les critères varient selon l\'établissement et la filière. En général : note du baccalauréat, spécialité choisie, et résultats obtenus. Consultez la page de chaque établissement pour les détails.',
  },
  {
    q: 'Que faire en cas de problème technique ?',
    a: 'Contactez le support technique de la plateforme via l\'adresse support@univh2c.ma ou appelez le +212 5 22 00 00 00 du lundi au vendredi de 8h à 16h.',
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <div className={styles.faqQuestion} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {open && <div className={styles.faqAnswer}>{a}</div>}
    </div>
  );
};

const InfoPage = () => (
  <div className={styles.faqSection}>
    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 8 }}>
      Informations & FAQ
    </h1>
    <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>
      Retrouvez les réponses aux questions les plus fréquentes.
    </p>

    <div style={{
      background: 'linear-gradient(135deg, #1a1f5e, #3b42a8)',
      borderRadius: 16, padding: '20px 24px', color: 'white', marginBottom: 28
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>📞 Besoin d'aide ?</div>
      <div style={{ opacity: 0.85, fontSize: '0.9rem' }}>
        Support: <strong>support@univh2c.ma</strong> · Tél: <strong>+212 5 22 00 00 00</strong>
      </div>
    </div>

    {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
  </div>
);

export default InfoPage;
