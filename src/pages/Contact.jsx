import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mail, Phone, MapPin, ExternalLink, MessageCircle, Globe, Shield, Building } from 'lucide-react';
import styles from './Contact.module.css';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useLanguage(); // Using translations if available, otherwise fallback text

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="Université Hassan II" style={{ height: '50px', objectFit: 'contain' }} />
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ padding: '8px 20px', borderRadius: '20px' }}>
          {t('loginBtn') || 'Login'}
        </button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.eyebrow}>Connect with Admissions</div>
        <h1 className={styles.title}>Your Academic Journey Starts with a Conversation.</h1>
        <p className={styles.subtitle}>
          Our admissions officers and academic advisors are here to guide you through the pre-registration process. Reach out today for a curated consultation.
        </p>

        <div className={styles.grid2}>
          {/* Form Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Direct Inquiry</h2>
            <form onSubmit={e => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input type="text" className={styles.formInput} placeholder="John Doe" required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input type="email" className={styles.formInput} placeholder="john.doe@academic.edu" required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subject of Interest</label>
                <select className={styles.formSelect} required>
                  <option value="">Undergraduate Admissions</option>
                  <option value="postgrad">Postgraduate Admissions</option>
                  <option value="intl">International Students</option>
                  <option value="tech">Technical Support</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message</label>
                <textarea className={styles.formTextarea} placeholder="How can we assist your academic goals?" required></textarea>
              </div>
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                Submit Inquiry <Send size={18} />
              </button>
            </form>
          </div>

          <div>
            {/* Contact Channels */}
            <div className={styles.channelsCard}>
              <div className={styles.channelsEyebrow}>Contact Channels</div>
              
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <Mail size={18} />
                </div>
                <div className={styles.channelInfo}>
                  <h4>Admissions Email</h4>
                  <p>admissions@univh2c.ma</p>
                </div>
              </div>

              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <Phone size={18} />
                </div>
                <div className={styles.channelInfo}>
                  <h4>Global Inquiries</h4>
                  <p>+212 (0) 522 43 30 30</p>
                </div>
              </div>

              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <MapPin size={18} />
                </div>
                <div className={styles.channelInfo}>
                  <h4>Physical Archive</h4>
                  <p>Présidence de l'Université Hassan II,<br />Quartier des Hôpitaux,<br />Casablanca 20100</p>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className={styles.mapCard}>
              <div className={styles.mapOverlay}>
                <div>
                  <h4 className={styles.mapTitle}>Main Campus Office</h4>
                  <p className={styles.mapSubtitle}>Open Mon-Fri, 9:00 AM - 5:00 PM</p>
                </div>
                <ExternalLink size={20} color="var(--color-primary)" style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerCopy}>
          &copy; {new Date().getFullYear()} Université Hassan II de Casablanca. All Rights Reserved.
        </p>
        <div className={styles.footerLinks}>
          <a href="#">Academic Calendar</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Institutional Repository</a>
          <a href="#">Support</a>
        </div>
        <div className={styles.footerSocials}>
          <Globe size={18} />
          <Shield size={18} />
          <Building size={18} />
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button className={styles.chatBtn} title="Chat with us">
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

export default Contact;
