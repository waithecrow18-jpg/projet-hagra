import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, UserPlus, FileEdit, Send, GraduationCap, ChevronRight, ShieldCheck } from 'lucide-react';
import styles from './Landing.module.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header + ' container'}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Université Hassan II" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
        <div className={styles.sessionLabel}>
          SESSION D'ADMISSION 2024-2025
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero + ' container'}>
        <h1 className={styles.heroTitle}>
          Plateforme de<br />Préinscription<br />Universitaire
        </h1>
        <p className={styles.heroSubtitle}>
          Rejoignez l'excellence académique. Commencez votre parcours dès aujourd'hui avec notre processus d'inscription simplifié.
        </p>
        <div className={styles.heroActions}>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            S'inscrire <ChevronRight size={18} />
          </button>
          <button className="btn btn-outline" onClick={() => {
            document.getElementById('comment-ca-marche').scrollIntoView({ behavior: 'smooth' });
          }}>
            En savoir plus
          </button>
        </div>
        
        <div className={styles.heroImageCard}>
          <img 
            src="/university_building.png" 
            alt="University Campus" 
            className={styles.heroImage} 
          />
          <div className={styles.badge}>
            <ShieldCheck className={styles.badgeIcon} size={20} />
            <span>Accréditation Officielle</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats + ' container'}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
            <UserPlus size={24} />
          </div>
          <div className={styles.statValue}>12,500+</div>
          <div className={styles.statLabel}>étudiants inscrits</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconOrange}`}>
            <GraduationCap size={24} />
          </div>
          <div className={styles.statValue}>45</div>
          <div className={styles.statLabel}>filières disponibles</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.iconTeal}`}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statValue}>98%</div>
          <div className={styles.statLabel}>taux de validation</div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <h3 className={styles.sectionSubtitle} style={{textAlign: 'left', marginBottom: '8px'}}>À PROPOS DE NOUS</h3>
              <h3>Une institution engagée pour votre réussite</h3>
              <p>
                La plateforme de préinscription de l'Université Hassan II de Casablanca a été conçue pour offrir à nos futurs étudiants un accès rapide et transparent à nos différents services et filières académiques.
              </p>
              <p>
                Nous mettons à votre disposition une plateforme centralisée où vous pouvez déposer votre dossier numériquement, suivre son avancement, et même prendre un rendez-vous pour le dépôt physique.
              </p>
              <div className={styles.aboutFeatures}>
                <div className={styles.aboutFeatureItem}>
                  <div className={styles.aboutFeatureIcon}><CheckCircle2 size={18} /></div>
                  Traitement rapide des dossiers
                </div>
                <div className={styles.aboutFeatureItem}>
                  <div className={styles.aboutFeatureIcon}><CheckCircle2 size={18} /></div>
                  Suivi en temps réel
                </div>
                <div className={styles.aboutFeatureItem}>
                  <div className={styles.aboutFeatureIcon}><CheckCircle2 size={18} /></div>
                  Prise de rendez-vous intelligente
                </div>
              </div>
            </div>
            <div className={styles.aboutImageWrapper}>
              <img src="/university_building.png" alt="University campus" className={styles.aboutImage} />
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="comment-ca-marche" className={styles.howItWorks}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Comment ça marche ?</h2>
          <h3 className={styles.sectionSubtitle}>3 ÉTAPES SIMPLES</h3>
          
          <div className={styles.stepsList}>
            <div className={styles.stepItem}>
              <div className={styles.stepNumberCircle}>01</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Créer un compte</h4>
                <p className={styles.stepDesc}>Créez votre profil étudiant avec vos informations de base pour accéder à la plateforme.</p>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumberCircle}>02</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Remplir formulaire</h4>
                <p className={styles.stepDesc}>Complétez vos informations académiques, vos choix d'établissement et téléchargez votre photo.</p>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumberCircle}>03</div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>Soumettre inscription</h4>
                <p className={styles.stepDesc}>Validez votre dossier et téléchargez immédiatement votre reçu de préinscription officiel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container">
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Prêt à commencer votre futur ?</h2>
          <p className={styles.ctaDesc}>Les inscriptions se clôturent le 30 Septembre 2024. Ne manquez pas votre chance !</p>
          <button className="btn btn-white" onClick={() => navigate('/login')}>
            Demander maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <div className={styles.logo} style={{ color: 'white', marginBottom: '16px' }}>
                <img src="/logo.png" alt="Université Hassan II" style={{ height: '55px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Façonnons l'avenir de l'éducation au Maroc.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h4>Ressources</h4>
              <div className={styles.footerLinks}>
                <a href="#">FAQ</a>
                <a href="#">Filières</a>
                <a href="#">Bourses</a>
                <a href="#">Guide d'inscription</a>
              </div>
            </div>
            <div className={styles.footerCol}>
              <h4>Légal & Support</h4>
              <div className={styles.footerLinks}>
                <a style={{ cursor: 'pointer' }} onClick={() => navigate('/contact')}>Contactez-nous</a>
                <a href="#">Mentions légales</a>
                <a href="#">Politique de confidentialité</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            &copy; {new Date().getFullYear()} Plateforme de Préinscription. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
