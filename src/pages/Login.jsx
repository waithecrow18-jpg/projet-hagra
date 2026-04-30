import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './Auth.module.css';

const Login = () => {
  const { login } = useAuth();
  const { t, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(async () => {
      const result = await login(form.email, form.password);
      if (result.success) {
        if (result.user.role === 'superadmin') navigate('/admin');
        else if (result.user.role === 'manager') navigate('/manager');
        else navigate('/portal');
      } else if (result.needsVerification) {
        // Redirect to OTP page only for unverified students
        navigate('/verify-otp', { state: { email: result.email, name: result.name, otpMeta: result.otpMeta || null } });
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className={styles.authWrapper}>
      <button className={styles.langToggle} onClick={toggleLang}>{t('language')}</button>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <img src="/logo.png" alt="Université Hassan II" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
        <h1 className={styles.authTitle}>{t('loginTitle')}</h1>
        <p className={styles.authSubtitle}>{t('loginSubtitle')}</p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('email')}</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="votre@email.ma"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="••••••••"
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', fontSize: '0.8rem', color: '#4a5568' }}>
            <strong>👑 Super Admin:</strong> admin@univh2c.ma / admin123<br />
            <strong>👔 Manager:</strong> manager@univh2c.ma / manager123<br />
            <strong>🎓 Étudiant:</strong> ahmed@student.ma / student123
          </div>

          <button id="login-submit" type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Connexion...' : t('loginBtn')}
          </button>
        </form>

        <div className={styles.authFooter}>
          {t('noAccount')}{' '}
          <a onClick={() => navigate('/register')}>{t('registerLink')}</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
