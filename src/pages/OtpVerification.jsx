import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const OtpVerification = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const name = location.state?.name || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpMeta, setOtpMeta] = useState(location.state?.otpMeta || null);
  const canResend = timer === 0;
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      setError('');
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Veuillez saisir les 6 chiffres du code.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyOtp(email, code);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        if (result.user?.role === 'superadmin') {
          navigate('/admin', { replace: true });
        } else if (result.user?.role === 'manager') {
          navigate('/manager', { replace: true });
        } else {
          navigate('/portal', { replace: true });
        }
      }, 1500);
    } else {
      setError(result.error);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setTimer(60);
    setError('');

    const result = await resendOtp(email, name);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setOtpMeta(result.otpMeta || null);
  };

  if (!email) {
    return null;
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard} style={{ maxWidth: 440, textAlign: 'center' }}>
        {success ? (
          <div style={{ padding: '24px 0' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                animation: 'scaleIn 0.4s ease',
              }}
            >
              <ShieldCheck size={40} color="white" />
            </div>
            <h2 style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
              Compte verifie !
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Redirection vers votre portail...
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a1f5e, #283082)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <ShieldCheck size={32} color="white" />
            </div>

            <h1 className={styles.authTitle}>Verification OTP</h1>
            <p className={styles.authSubtitle} style={{ marginBottom: 8 }}>
              Un code a 6 chiffres a ete envoye a
            </p>
            <p
              style={{
                fontWeight: 700,
                color: 'var(--color-primary)',
                fontSize: '0.95rem',
                marginBottom: 20,
              }}
            >
              {email}
            </p>

            {otpMeta?.devOtp && (
              <div
                style={{
                  marginBottom: 20,
                  borderRadius: 16,
                  padding: '16px 18px',
                  background: 'linear-gradient(135deg, #fff7ed, #fffbeb)',
                  border: '1px solid #fdba74',
                  textAlign: 'left',
                  boxShadow: '0 8px 24px rgba(251, 146, 60, 0.12)',
                }}
              >
                <p style={{ margin: 0, color: '#9a3412', fontSize: '0.85rem', fontWeight: 800 }}>
                  Mode local OTP
                </p>
                <p style={{ margin: '8px 0 12px', color: '#7c2d12', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Gmail bloque encore l&apos;envoi reel. Utilisez ce code pour continuer vos tests locaux.
                </p>
                <div
                  style={{
                    borderRadius: 12,
                    background: '#fff',
                    border: '1px solid #fed7aa',
                    padding: '12px 14px',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    letterSpacing: '0.35rem',
                    color: '#1a1f5e',
                    textAlign: 'center',
                  }}
                >
                  {otpMeta.devOtp}
                </div>
                {otpMeta.warning && (
                  <p style={{ margin: '12px 0 0', color: '#9a3412', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    {otpMeta.warning}
                  </p>
                )}
              </div>
            )}

            {error && <div className={styles.errorAlert}>{error}</div>}

            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'center',
                marginBottom: 28,
              }}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  style={{
                    width: 50,
                    height: 58,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    borderRadius: 12,
                    border: digit ? '2px solid var(--color-primary)' : '2px solid #e2e8f0',
                    background: digit ? '#f0f4ff' : '#f8fafc',
                    color: 'var(--color-primary)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxShadow: digit ? '0 0 0 3px rgba(26, 31, 94, 0.1)' : 'inset 2px 2px 4px rgba(0,0,0,0.05)',
                  }}
                />
              ))}
            </div>

            <button
              className={`btn btn-primary ${styles.submitBtn}`}
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              style={{ marginBottom: 20 }}
            >
              {loading ? 'Verification...' : 'Verifier le code'}
            </button>

            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              {canResend ? (
                <button
                  onClick={handleResend}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <RotateCcw size={14} /> Renvoyer le code
                </button>
              ) : (
                <span>Renvoyer dans <strong>{timer}s</strong></span>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OtpVerification;
