import React from 'react';
import { Home, Search, Info, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../Student.module.css';

const StudentHome = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const hasRegistered = !!currentUser?.preRegistration;

  const quickCards = [
    { key: 'search', label: t('search'), icon: <Search size={22} />, color: '#1a1f5e' },
    { key: 'info', label: t('info'), icon: <Info size={22} />, color: '#f97316' },
    { key: 'preregistration', label: t('preregistration'), icon: <FileText size={22} />, color: '#14b8a6' },
  ];

  return (
    <div>
      <div className={styles.homeHero}>
        <h1 className={styles.homeHeroTitle}>
          Bienvenue, {currentUser?.name?.split(' ')[0]} 👋
        </h1>
        <p className={styles.homeHeroSubtitle}>
          Université Hassan II de Casablanca — Session 2024-2025
        </p>
        <div className={styles.homeBadge}>
          {hasRegistered ? '✅ Préinscription soumise' : '📋 Préinscription en attente'}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
        {hasRegistered && (
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px 24px',
            marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: '4px solid #10b981'
          }}>
            <CheckCircle2 size={32} color="#10b981" />
            <div>
              <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 2 }}>Préinscription complétée</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Numéro de référence : <strong>{currentUser.preRegistration.refNumber}</strong>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ marginLeft: 'auto', fontSize: '0.85rem', padding: '8px 16px' }}
              onClick={() => onNavigate('preregistration')}
            >
              Voir / Télécharger
            </button>
          </div>
        )}

        <h2 style={{ fontWeight: 700, color: '#1a1f5e', marginBottom: 16, fontSize: '1.1rem' }}>
          Navigation rapide
        </h2>
        <div className={styles.quickActions} style={{ padding: 0 }}>
          {quickCards.map(card => (
            <div key={card.key} className={styles.quickCard} onClick={() => onNavigate(card.key)}>
              <div className={styles.quickCardIcon} style={{ background: `${card.color}18`, color: card.color }}>
                {card.icon}
              </div>
              <div className={styles.quickCardLabel}>{card.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1f5e, #3b42a8)',
          borderRadius: 16, padding: '28px 24px', color: 'white',
          marginTop: 24, textAlign: 'center'
        }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 8 }}>
            📅 Date limite d'inscription
          </div>
          <div style={{ opacity: 0.85, marginBottom: 16, fontSize: '0.95rem' }}>
            Les dossiers doivent être soumis avant le <strong>30 Septembre 2024</strong>
          </div>
          {!hasRegistered && (
            <button className="btn btn-white" onClick={() => onNavigate('preregistration')}
              style={{ fontSize: '0.9rem', padding: '10px 24px' }}>
              Commencer la préinscription →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
