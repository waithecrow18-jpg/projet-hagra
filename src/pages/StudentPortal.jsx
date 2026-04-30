import React, { useState } from 'react';
import { Building2, LogOut, Menu, X, Home, Search, Info, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import StudentHome from './student/StudentHome';
import SearchPage from './student/SearchPage';
import InfoPage from './student/InfoPage';
import PreRegistration from './student/PreRegistration';
import styles from './Student.module.css';

const StudentPortal = () => {
  const { logout } = useAuth();
  const { t, toggleLang } = useLanguage();
  const [activePage, setActivePage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: t('home'), icon: <Home size={16} /> },
    { key: 'search', label: t('search'), icon: <Search size={16} /> },
    { key: 'info', label: t('info'), icon: <Info size={16} /> },
    { key: 'preregistration', label: t('preregistration'), icon: <FileText size={16} /> },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <StudentHome onNavigate={setActivePage} />;
      case 'search': return <SearchPage />;
      case 'info': return <InfoPage />;
      case 'preregistration': return <PreRegistration />;
      default: return <StudentHome onNavigate={setActivePage} />;
    }
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.navLogo} onClick={() => setActivePage('home')}>
            <img src="/logo.png" alt="Université Hassan II" style={{ height: '45px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>

          <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
            {navItems.map(item => (
              <button
                key={item.key}
                className={`${styles.navLink} ${activePage === item.key ? styles.active : ''}`}
                onClick={() => { setActivePage(item.key); setMenuOpen(false); }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.navActions}>
            <button className={styles.navLangBtn} onClick={toggleLang}>{t('language')}</button>
            <button className={styles.navLogoutBtn} onClick={logout}>
              <LogOut size={16} />
              {t('logout')}
            </button>
            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} color="white" /> : <><span /><span /><span /></>}
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.pageContainer}>
        {renderPage()}
      </main>
    </div>
  );
};

export default StudentPortal;
