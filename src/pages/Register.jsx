import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './Auth.module.css';

const Register = () => {
  const { register } = useAuth();
  const { t, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', cne: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nom requis';
    if (!form.email.includes('@')) errs.email = 'Email invalide';
    if (!form.cne.trim()) errs.cne = 'CNE requis';
    if (form.password.length < 6) errs.password = 'Min. 6 caractères';
    if (form.password !== form.confirm) errs.confirm = 'Mots de passe différents';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);
    setError('');

    const result = await register({ name: form.name, email: form.email, cne: form.cne, password: form.password });
    if (result.success) {
      // Redirect to OTP verification page
      navigate('/verify-otp', { state: { email: form.email, name: form.name } });
    } else if (result.error?.includes('existe')) {
      navigate('/login', { state: { email: form.email, fromRegister: true } });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const field = (name, type, label, placeholder) => (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label}</label>
      <input
        id={`register-${name}`}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={`${styles.formInput} ${fieldErrors[name] ? styles.error : ''}`}
        placeholder={placeholder}
      />
      {fieldErrors[name] && <span className={styles.errorMsg}>{fieldErrors[name]}</span>}
    </div>
  );

  return (
    <div className={styles.authWrapper}>
      <button className={styles.langToggle} onClick={toggleLang}>{t('language')}</button>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <img src="/logo.png" alt="Université Hassan II" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
        <h1 className={styles.authTitle}>{t('registerTitle')}</h1>
        <p className={styles.authSubtitle}>{t('registerSubtitle')}</p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {field('name', 'text', t('fullName'), 'Mohamed El Amine')}
          {field('email', 'email', t('email'), 'votre@email.ma')}
          {field('cne', 'text', t('cne'), 'R123456789')}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`${styles.formInput} ${fieldErrors.password ? styles.error : ''}`}
                placeholder="••••••••"
                style={{ paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && <span className={styles.errorMsg}>{fieldErrors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('confirmPassword')}</label>
            <input
              id="register-confirm"
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className={`${styles.formInput} ${fieldErrors.confirm ? styles.error : ''}`}
              placeholder="••••••••"
            />
            {fieldErrors.confirm && <span className={styles.errorMsg}>{fieldErrors.confirm}</span>}
          </div>

          <button id="register-submit" type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Création...' : t('registerBtn')}
          </button>
        </form>

        <div className={styles.authFooter}>
          {t('haveAccount')}{' '}
          <a onClick={() => navigate('/login')}>{t('loginLink')}</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
