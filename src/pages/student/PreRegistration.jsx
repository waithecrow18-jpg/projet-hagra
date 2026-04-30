import React, { useState, useRef } from 'react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Check, Upload, Download, CheckCircle2, CalendarDays, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../Student.module.css';

// ── helpers ──────────────────────────────────────────────────────────────────
const ETABS = [
  'FSBM — Faculté des Sciences Ben M\'Sik',
  'FSAC — Faculté des Sciences Ain Chock',
  'FSTM — Faculté des Sciences et Techniques',
  'FLSHAC — Faculté des Lettres Ain Chock',
  'FLSHB — Faculté des Lettres Ben M\'Sik',
  'FSJESC — Sciences Juridiques Ain Chock',
  'FSJESAS — Sciences Juridiques Ain Sebaâ',
  'FMPC — Médecine et Pharmacie',
  'FMDC — Médecine Dentaire',
  'ENCGC — École Nationale de Commerce',
  'ENSEM — Electricité et Mécanique',
  'ENS — École Normale Supérieure',
  'EST — École Supérieure de Technologie',
];

const ETAB_FILIERES = {
  'FSBM — Faculté des Sciences Ben M\'Sik': ['Mathématiques', 'Physique-Chimie', 'Informatique', 'Biologie'],
  'FSAC — Faculté des Sciences Ain Chock': ['Mathématiques', 'Physique-Chimie', 'Informatique', 'Biologie'],
  'FSTM — Faculté des Sciences et Techniques': ['Génie Informatique', 'Génie Électrique', 'Génie Mécanique', 'Biotechnologie'],
  'FLSHAC — Faculté des Lettres Ain Chock': ['Lettres Arabes', 'Lettres Françaises', 'Études Anglaises', 'Histoire et Géographie'],
  'FLSHB — Faculté des Lettres Ben M\'Sik': ['Lettres Arabes', 'Lettres Françaises', 'Études Anglaises', 'Sociologie'],
  'FSJESC — Sciences Juridiques Ain Chock': ['Droit en Français', 'Droit en Arabe', 'Économie et Gestion'],
  'FSJESAS — Sciences Juridiques Ain Sebaâ': ['Droit en Français', 'Droit en Arabe', 'Économie et Gestion'],
  'FMPC — Médecine et Pharmacie': ['Médecine', 'Pharmacie'],
  'FMDC — Médecine Dentaire': ['Médecine Dentaire'],
  'ENCGC — École Nationale de Commerce': ['Commerce', 'Gestion'],
  'ENSEM — Electricité et Mécanique': ['Génie Électrique', 'Génie Mécanique', 'Génie Informatique'],
  'ENS — École Normale Supérieure': ['Licence Professionnelle Enseignement'],
  'EST — École Supérieure de Technologie': ['Génie Informatique', 'Techniques de Management', 'Génie Électrique'],
};

// Obtenir toutes les filières uniques si nécessaire, ou on s'en passe
const FILIERES = [...new Set(Object.values(ETAB_FILIERES).flat())];
const WILAYAS = ['Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès', 'Souss-Massa', 'Tanger-Tétouan-Al Hoceïma', 'Oriental', 'Autre'];

const MENTIONS = ['Passable', 'Assez Bien', 'Bien', 'Très Bien'];

const SERIES_BAC = ['Sciences Mathématiques A', 'Sciences Mathématiques B', 'Sciences Physiques', 'Sciences de la Vie et de la Terre', 'Sciences Économiques', 'Lettres', 'Sciences Agronomiques', 'Arts Appliqués', 'Technique'];

// ── Steps ─────────────────────────────────────────────────────────────────────

const Step1 = ({ data, onChange }) => (
  <>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Nom *</label>
        <input id="s1-nom" className={styles.formInput} value={data.nom} onChange={e => onChange('nom', e.target.value)} placeholder="El Idrissi" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Prénom *</label>
        <input id="s1-prenom" className={styles.formInput} value={data.prenom} onChange={e => onChange('prenom', e.target.value)} placeholder="Fatima" required />
      </div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Nom en arabe</label>
        <input id="s1-nomAr" className={styles.formInput} value={data.nomAr} onChange={e => onChange('nomAr', e.target.value)} placeholder="الإدريسي" style={{ direction: 'rtl' }} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Prénom en arabe</label>
        <input id="s1-prenomAr" className={styles.formInput} value={data.prenomAr} onChange={e => onChange('prenomAr', e.target.value)} placeholder="فاطمة" style={{ direction: 'rtl' }} />
      </div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Date de naissance *</label>
        <input id="s1-dob" type="date" className={styles.formInput} value={data.dob} onChange={e => onChange('dob', e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Sexe *</label>
        <select id="s1-sexe" className={styles.formSelect} value={data.sexe} onChange={e => onChange('sexe', e.target.value)}>
          <option value="">-- Choisir --</option>
          <option>Masculin</option>
          <option>Féminin</option>
        </select>
      </div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>CIN *</label>
        <input id="s1-cin" className={styles.formInput} value={data.cin} onChange={e => onChange('cin', e.target.value)} placeholder="AB123456" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>CNE / Massar *</label>
        <input id="s1-cne" className={styles.formInput} value={data.cne} onChange={e => onChange('cne', e.target.value)} placeholder="R123456789" required />
      </div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Nationalité</label>
        <input id="s1-nationalite" className={styles.formInput} value={data.nationalite} onChange={e => onChange('nationalite', e.target.value)} placeholder="Marocaine" />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Lieu de naissance</label>
        <input id="s1-lieuNaissance" className={styles.formInput} value={data.lieuNaissance} onChange={e => onChange('lieuNaissance', e.target.value)} placeholder="Casablanca" />
      </div>
    </div>
  </>
);

const Step2 = ({ data, onChange }) => (
  <>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Email *</label>
      <input id="s2-email" type="email" className={styles.formInput} value={data.email} onChange={e => onChange('email', e.target.value)} placeholder="votre@email.ma" required />
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Téléphone *</label>
        <input id="s2-tel" type="tel" className={styles.formInput} value={data.tel} onChange={e => onChange('tel', e.target.value)} placeholder="06 12 34 56 78" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Téléphone (parent)</label>
        <input id="s2-telParent" type="tel" className={styles.formInput} value={data.telParent} onChange={e => onChange('telParent', e.target.value)} placeholder="06 00 00 00 00" />
      </div>
    </div>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Adresse complète *</label>
      <textarea id="s2-adresse" className={styles.formTextarea} value={data.adresse} onChange={e => onChange('adresse', e.target.value)} placeholder="N° Rue, Quartier, Ville..." required />
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Ville *</label>
        <input id="s2-ville" className={styles.formInput} value={data.ville} onChange={e => onChange('ville', e.target.value)} placeholder="Casablanca" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Code postal</label>
        <input id="s2-cp" className={styles.formInput} value={data.cp} onChange={e => onChange('cp', e.target.value)} placeholder="20000" />
      </div>
    </div>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Région / Wilaya</label>
      <select id="s2-wilaya" className={styles.formSelect} value={data.wilaya} onChange={e => onChange('wilaya', e.target.value)}>
        <option value="">-- Choisir --</option>
        {WILAYAS.map(w => <option key={w}>{w}</option>)}
      </select>
    </div>
  </>
);

const Step3 = ({ data, onChange }) => (
  <>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Série du Baccalauréat *</label>
        <select id="s3-serie" className={styles.formSelect} value={data.serie} onChange={e => onChange('serie', e.target.value)}>
          <option value="">-- Choisir --</option>
          {SERIES_BAC.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Année d'obtention *</label>
        <select id="s3-annee" className={styles.formSelect} value={data.annee} onChange={e => onChange('annee', e.target.value)}>
          <option value="">-- Choisir --</option>
          {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Note du Baccalauréat *</label>
        <input id="s3-note" type="number" min="0" max="20" step="0.01" className={styles.formInput} value={data.note} onChange={e => onChange('note', e.target.value)} placeholder="15.50" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Mention *</label>
        <select id="s3-mention" className={styles.formSelect} value={data.mention} onChange={e => onChange('mention', e.target.value)}>
          <option value="">-- Choisir --</option>
          {MENTIONS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
    </div>
    <div className={styles.formRow}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Établissement (lycée)</label>
        <input id="s3-lycee" className={styles.formInput} value={data.lycee} onChange={e => onChange('lycee', e.target.value)} placeholder="Lycée Ibn Rochd, Casablanca" />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>N° de Massar (Bac)</label>
        <input id="s3-noBac" className={styles.formInput} value={data.noBac} onChange={e => onChange('noBac', e.target.value)} placeholder="2024-XXXXXX" />
      </div>
    </div>
  </>
);

const Step4 = ({ data, onChange }) => {
  const availableFilieres1 = data.etab1 ? ETAB_FILIERES[data.etab1] : [];
  const availableFilieres2 = data.etab2 ? ETAB_FILIERES[data.etab2] : [];

  return (
    <>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Établissement de 1er choix *</label>
        <select id="s4-etab1" className={styles.formSelect} value={data.etab1} onChange={e => { onChange('etab1', e.target.value); onChange('filiere1', ''); }}>
          <option value="">-- Choisir l'établissement --</option>
          {ETABS.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Filière souhaitée (1er choix) *</label>
        <select id="s4-filiere1" className={styles.formSelect} value={data.filiere1} onChange={e => onChange('filiere1', e.target.value)} disabled={!data.etab1}>
          <option value="">{data.etab1 ? "-- Choisir la filière --" : "-- Choisissez d'abord l'établissement --"}</option>
          {availableFilieres1?.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Établissement de 2ème choix</label>
        <select id="s4-etab2" className={styles.formSelect} value={data.etab2} onChange={e => { onChange('etab2', e.target.value); onChange('filiere2', ''); }}>
          <option value="">-- Optionnel --</option>
          {ETABS.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Filière (2ème choix)</label>
        <select id="s4-filiere2" className={styles.formSelect} value={data.filiere2} onChange={e => onChange('filiere2', e.target.value)} disabled={!data.etab2}>
          <option value="">{data.etab2 ? "-- Optionnel --" : "-- Choisissez d'abord l'établissement --"}</option>
          {availableFilieres2?.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Remarques / Motivations</label>
        <textarea id="s4-motivations" className={styles.formTextarea} value={data.motivations} onChange={e => onChange('motivations', e.target.value)} placeholder="Décrivez vos motivations pour cette filière..." />
      </div>
    </>
  );
};

const Step5 = ({ data, onChange }) => (
  <>
    <div style={{ background: '#f0f4ff', borderRadius: 12, padding: '16px', marginBottom: 24, fontSize: '0.9rem', color: '#4a5568' }}>
      <strong>📋 AMO Étudiant</strong> : L'Assurance Maladie Obligatoire couvre vos frais médicaux pendant vos études. Si vous n'êtes pas encore couvert, vous pourrez vous inscrire après admission.
    </div>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Couverture AMO</label>
      <select id="s5-amo" className={styles.formSelect} value={data.amo} onChange={e => onChange('amo', e.target.value)}>
        <option value="">-- Choisir --</option>
        <option value="oui">Oui, je suis couvert(e)</option>
        <option value="non">Non, je ne suis pas couvert(e)</option>
        <option value="parent">Couvert(e) via mes parents</option>
      </select>
    </div>
    {(data.amo === 'oui' || data.amo === 'parent') && (
      <>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>N° d'affiliation AMO</label>
            <input id="s5-numAmo" className={styles.formInput} value={data.numAmo} onChange={e => onChange('numAmo', e.target.value)} placeholder="AMO-XXXXXXXXXX" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Organisme assureur</label>
            <input id="s5-organisme" className={styles.formInput} value={data.organisme} onChange={e => onChange('organisme', e.target.value)} placeholder="CNSS / CNOPS / Autre" />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Date d'expiration de la couverture</label>
          <input id="s5-expAmo" type="date" className={styles.formInput} value={data.expAmo} onChange={e => onChange('expAmo', e.target.value)} />
        </div>
      </>
    )}
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Groupe sanguin</label>
      <select id="s5-groupeSanguin" className={styles.formSelect} value={data.groupeSanguin} onChange={e => onChange('groupeSanguin', e.target.value)}>
        <option value="">-- Choisir --</option>
        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
      </select>
    </div>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Maladies chroniques / Allergies</label>
      <textarea id="s5-maladies" className={styles.formTextarea} value={data.maladies} onChange={e => onChange('maladies', e.target.value)} placeholder="Aucune / Préciser si nécessaire..." style={{ minHeight: 80 }} />
    </div>
  </>
);

const Step6 = ({ data, onChange }) => {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange('photoUrl', ev.target.result);
    reader.readAsDataURL(file);
    onChange('photoFile', file.name);
  };

  return (
    <>
      <div style={{ background: '#f0f4ff', borderRadius: 12, padding: '16px', marginBottom: 24, fontSize: '0.9rem', color: '#4a5568' }}>
        <strong>📸 Exigences photo</strong> : Fond blanc, visage bien visible, format JPG ou PNG, taille max 2 Mo.
      </div>
      <div className={styles.photoUploadArea} onClick={() => inputRef.current.click()}>
        {data.photoUrl ? (
          <>
            <img src={data.photoUrl} alt="Preview" className={styles.photoPreview} />
            <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Photo sélectionnée ✓</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cliquer pour changer</p>
          </>
        ) : (
          <>
            <div className={styles.uploadIcon}><Upload size={48} /></div>
            <p className={styles.uploadText}>Cliquez pour télécharger votre photo</p>
            <p className={styles.uploadSubtext}>JPG, PNG — Max 2 Mo</p>
          </>
        )}
      </div>
      <input ref={inputRef} id="s6-photo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </>
  );
};

// ── Appointment time slots ─────────────────────────────────────────────────────
const TIME_SLOTS = [
  '08:30 - 09:00', '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30',
  '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00',
  '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00',
];

// Simulate some already-booked slots per date
const getBookedSlots = (date) => {
  if (!date) return [];
  const seed = date.split('-').join('');
  const num = parseInt(seed, 10);
  return TIME_SLOTS.filter((_, i) => (num + i * 7) % 5 === 0);
};

// Get minimum selectable date (tomorrow)
const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// Get maximum selectable date (2 months from now)
const getMaxDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d.toISOString().split('T')[0];
};

// ── Success Screen ─────────────────────────────────────────────────────────────
const SuccessScreen = ({ refNumber, onDownload, onSaveAppointment, savedAppointment }) => {
  const { t } = useLanguage();
  const [rdvDate, setRdvDate] = useState(savedAppointment?.date || '');
  const [rdvSlot, setRdvSlot] = useState(savedAppointment?.slot || '');
  const [rdvConfirmed, setRdvConfirmed] = useState(!!savedAppointment);
  const [showRdvForm, setShowRdvForm] = useState(false);

  const bookedSlots = getBookedSlots(rdvDate);
  const availableSlots = TIME_SLOTS.filter(s => !bookedSlots.includes(s));

  // Check if selected date is a weekend
  const isWeekend = (dateStr) => {
    if (!dateStr) return false;
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const handleConfirmRdv = () => {
    if (!rdvDate || !rdvSlot) return;
    const appointmentData = { date: rdvDate, slot: rdvSlot, confirmedAt: new Date().toISOString() };
    onSaveAppointment(appointmentData);
    setRdvConfirmed(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className={styles.successWrapper} style={{ maxWidth: 580 }}>
      <div className={styles.successIcon}><CheckCircle2 size={40} /></div>
      <h2 className={styles.successTitle}>{t('successTitle')}</h2>
      <p className={styles.successMessage}>{t('successMessage')}</p>
      <div className={styles.successRefNum}>
        Référence : <strong>{refNumber}</strong>
      </div>
      <button id="download-btn" className="btn btn-primary" style={{ width: '100%', gap: 10, marginBottom: 28 }} onClick={onDownload}>
        <Download size={18} />
        {t('downloadBtn')}
      </button>

      {/* ─── Appointment Section ─── */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '28px 24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'left',
        border: rdvConfirmed ? '2px solid #10b981' : '2px solid var(--color-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: rdvConfirmed ? 'rgba(16,185,129,0.1)' : 'rgba(26,31,94,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: rdvConfirmed ? '#10b981' : 'var(--color-primary)', flexShrink: 0,
          }}>
            <CalendarDays size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              {t('appointmentTitle')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {t('appointmentDesc')}
            </p>
          </div>
        </div>

        {rdvConfirmed ? (
          /* ── Confirmed appointment card ── */
          <div style={{
            background: 'rgba(16,185,129,0.06)', borderRadius: 12, padding: '20px',
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.95rem' }}>
                {t('appointmentConfirmed')}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalendarDays size={16} color="var(--color-primary)" />
                <span style={{ fontWeight: 600, color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>
                  {formatDate(savedAppointment?.date || rdvDate)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={16} color="var(--color-primary)" />
                <span style={{ fontWeight: 600, color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>
                  {savedAppointment?.slot || rdvSlot}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={16} color="var(--color-primary)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {t('appointmentLocation')}
                </span>
              </div>
            </div>
            <div style={{
              marginTop: 16, padding: '10px 14px', background: 'rgba(26,31,94,0.05)',
              borderRadius: 8, fontSize: '0.82rem', color: 'var(--color-text-muted)',
            }}>
              💡 {t('appointmentReminder')}
            </div>
          </div>
        ) : (
          /* ── Appointment booking form ── */
          <>
            {!showRdvForm ? (
              <button
                id="book-rdv-btn"
                className="btn btn-primary"
                style={{ width: '100%', gap: 10 }}
                onClick={() => setShowRdvForm(true)}
              >
                <CalendarDays size={18} />
                {t('bookAppointment')}
              </button>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                {/* Date picker */}
                <div className={styles.formGroup} style={{ marginBottom: 16 }}>
                  <label className={styles.formLabel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarDays size={15} /> {t('appointmentDate')}
                  </label>
                  <input
                    id="rdv-date"
                    type="date"
                    className={styles.formInput}
                    value={rdvDate}
                    onChange={e => { setRdvDate(e.target.value); setRdvSlot(''); }}
                    min={getMinDate()}
                    max={getMaxDate()}
                  />
                  {rdvDate && isWeekend(rdvDate) && (
                    <span style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: 4, display: 'block' }}>
                      ⚠️ {t('weekendWarning')}
                    </span>
                  )}
                </div>

                {/* Time slot picker */}
                {rdvDate && !isWeekend(rdvDate) && (
                  <div className={styles.formGroup} style={{ marginBottom: 16 }}>
                    <label className={styles.formLabel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={15} /> {t('appointmentTime')}
                    </label>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                    }}>
                      {TIME_SLOTS.map(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = rdvSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setRdvSlot(slot)}
                            style={{
                              padding: '10px 6px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 600,
                              fontFamily: 'Inter, sans-serif', cursor: isBooked ? 'not-allowed' : 'pointer',
                              border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-gray-medium)',
                              background: isBooked ? '#f3f4f6' : isSelected ? 'rgba(26,31,94,0.08)' : 'white',
                              color: isBooked ? '#bbb' : isSelected ? 'var(--color-primary)' : 'var(--color-text-dark)',
                              textDecoration: isBooked ? 'line-through' : 'none',
                              transition: 'all 0.15s',
                            }}
                          >
                            {slot.split(' - ')[0]}
                          </button>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
                      {availableSlots.length} {t('slotsAvailable')} · {t('slotDuration')}
                    </p>
                  </div>
                )}

                {/* Confirm button */}
                {rdvDate && rdvSlot && !isWeekend(rdvDate) && (
                  <button
                    id="confirm-rdv-btn"
                    className="btn btn-primary"
                    style={{ width: '100%', gap: 10, marginTop: 4 }}
                    onClick={handleConfirmRdv}
                  >
                    <CheckCircle2 size={18} />
                    {t('confirmAppointment')}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const STEP_LABELS = ['Identité', 'Coordonnées', 'Baccalauréat', 'Établissement', 'AMO', 'Photo'];

const INIT = {
  step1: { nom: '', prenom: '', nomAr: '', prenomAr: '', dob: '', sexe: '', cin: '', cne: '', nationalite: 'Marocaine', lieuNaissance: '' },
  step2: { email: '', tel: '', telParent: '', adresse: '', ville: '', cp: '', wilaya: '' },
  step3: { serie: '', annee: '', note: '', mention: '', lycee: '', noBac: '' },
  step4: { etab1: '', filiere1: '', etab2: '', filiere2: '', motivations: '' },
  step5: { amo: '', numAmo: '', organisme: '', expAmo: '', groupeSanguin: '', maladies: '' },
  step6: { photoUrl: '', photoFile: '' },
};

const PreRegistration = () => {
  const { currentUser, savePreRegistration } = useAuth();
  const { t } = useLanguage();
  const existing = currentUser?.preRegistration;

  const [step, setStep] = useState(existing ? 7 : 1);
  const [formData, setFormData] = useState(existing?.data || INIT);
  const [refNumber] = useState(existing?.refNumber || null);
  const [finalRef, setFinalRef] = useState(refNumber);
  const [appointment, setAppointment] = useState(existing?.appointment || null);

  const handleSaveAppointment = (apptData) => {
    setAppointment(apptData);
    const updatedReg = { ...currentUser.preRegistration, appointment: apptData };
    savePreRegistration(updatedReg.data ? updatedReg : { data: formData, refNumber: finalRef, submittedAt: new Date().toISOString(), appointment: apptData });
  };

  const updateStep = (stepKey, field, value) =>
    setFormData(prev => ({ ...prev, [stepKey]: { ...prev[stepKey], [field]: value } }));

  const handleNext = () => {
    if (step < 6) setStep(s => s + 1);
    else {
      const ref = `UH2C-${Date.now().toString().slice(-8)}`;
      setFinalRef(ref);
      savePreRegistration({ data: formData, refNumber: ref, submittedAt: new Date().toISOString() });
      setStep(7);
    }
  };

  const handlePrev = () => setStep(s => s - 1);

  const handleDownload = async () => {
    const d = formData;
    const doc = new jsPDF();
    
    // Helper to load image
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    // 1. Draw Header
    const logoImg = await loadImage('/logo.png');
    if (logoImg) {
      doc.addImage(logoImg, 'PNG', 15, 10, 30, 20); // x, y, w, h
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138); // Navy blue
    doc.text("Fiche de Préinscription 2024/2025", 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const etabText = d.step4.etab1 || "Université Hassan II de Casablanca";
    doc.text(etabText, 105, 22, { align: 'center' });

    // Photo
    if (d.step6.photoUrl) {
      try {
        doc.addImage(d.step6.photoUrl, 'JPEG', 160, 10, 30, 35);
      } catch (e) {
        console.error("Failed to add photo", e);
        doc.rect(160, 10, 30, 35);
        doc.setFontSize(8);
        doc.text("Photo", 175, 27, { align: 'center' });
      }
    } else {
      doc.rect(160, 10, 30, 35);
      doc.setFontSize(8);
      doc.text("Photo", 175, 27, { align: 'center' });
    }

    // 2. Sub-header (Filière)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    const filiereText = d.step4.filiere1 ? `${d.step4.filiere1} (Formation initiale)` : "Formation initiale";
    doc.text(filiereText, 105, 45, { align: 'center' });

    // 3. Table 1: Identité
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Identité", 105, 55, { align: 'center' });

    const identityBody = [
      ["CNE/Code Massar", d.step1.cne],
      ["Nom", d.step1.nom],
      ["Prénom", d.step1.prenom],
      ["CIN", d.step1.cin],
      ["État Assurance", d.step5.amo === 'oui' ? 'Couvert (Oui)' : (d.step5.amo === 'parent' ? 'Couvert via parents' : 'Assurance non payée pour le code Massar et CIN donnés')],
      ["Sexe", d.step1.sexe === 'Masculin' ? 'M' : 'F'],
      ["Naissance", `${new Date(d.step1.dob).toLocaleDateString('fr-FR')} à ${d.step1.lieuNaissance}`],
      ["Nationalité", `${d.step1.nationalite} né(e) à ${d.step1.lieuNaissance}`],
      ["Adresse", `${d.step2.adresse}, ${d.step2.ville} ${d.step2.cp}`],
      ["Téléphone", d.step2.tel],
      ["Email", d.step2.email]
    ];

    autoTable(doc, {
      startY: 58,
      body: identityBody,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2, font: 'helvetica' },
      columnStyles: { 0: { fontStyle: 'bold', fillColor: [255, 255, 255], cellWidth: 50, textColor: [30, 58, 138] } },
      margin: { left: 15, right: 15 }
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    // 4. Table 2: Baccalauréat
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Baccalauréat", 105, finalY, { align: 'center' });

    const bacBody = [
      ["Année du Bac", d.step3.annee],
      ["Série du Bac", d.step3.serie],
      ["Mention", d.step3.mention],
      ["Lycée", d.step3.lycee],
      ["Province du Bac", d.step2.wilaya || '']
    ];

    autoTable(doc, {
      startY: finalY + 3,
      body: bacBody,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2, font: 'helvetica' },
      columnStyles: { 0: { fontStyle: 'bold', fillColor: [255, 255, 255], cellWidth: 50, textColor: [30, 58, 138] } },
      margin: { left: 15, right: 15 }
    });

    finalY = doc.lastAutoTable.finalY + 10;

    // 5. Table 3: Rendez-vous (if any)
    if (appointment) {
      doc.setFontSize(11);
      doc.text("Rendez-vous de dépôt", 105, finalY, { align: 'center' });
      
      const rdvBody = [
        ["Date", new Date(appointment.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
        ["Heure", appointment.slot],
        ["Lieu", "Service de Scolarité — Bâtiment principal"]
      ];

      autoTable(doc, {
        startY: finalY + 3,
        body: rdvBody,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2, font: 'helvetica' },
        columnStyles: { 0: { fontStyle: 'bold', fillColor: [255, 255, 255], cellWidth: 50, textColor: [30, 58, 138] } },
        margin: { left: 15, right: 15 }
      });
      finalY = doc.lastAutoTable.finalY + 10;
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`Généré le ${new Date().toLocaleString('fr-FR')} - Référence: ${finalRef}`, 15, 290);

    doc.save(`Preinscription_${finalRef}.pdf`);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 data={formData.step1} onChange={(f, v) => updateStep('step1', f, v)} />;
      case 2: return <Step2 data={formData.step2} onChange={(f, v) => updateStep('step2', f, v)} />;
      case 3: return <Step3 data={formData.step3} onChange={(f, v) => updateStep('step3', f, v)} />;
      case 4: return <Step4 data={formData.step4} onChange={(f, v) => updateStep('step4', f, v)} />;
      case 5: return <Step5 data={formData.step5} onChange={(f, v) => updateStep('step5', f, v)} />;
      case 6: return <Step6 data={formData.step6} onChange={(f, v) => updateStep('step6', f, v)} />;
      case 7: return <SuccessScreen refNumber={finalRef} onDownload={handleDownload} onSaveAppointment={handleSaveAppointment} savedAppointment={appointment} />;
      default: return null;
    }
  };

  if (step === 7) {
    return <div className={styles.pageContainer}>{renderStep()}</div>;
  }

  return (
    <div className={styles.stepperWrapper}>
      {/* Stepper */}
      <div className={styles.stepper}>
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const isDone = step > num;
          const isActive = step === num;
          return (
            <React.Fragment key={num}>
              {i > 0 && <div className={`${styles.stepConnector} ${isDone ? styles.done : ''}`} />}
              <div
                className={`${styles.stepCircle} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''}`}
                title={label}
              >
                {isDone ? <Check size={16} /> : num}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className={styles.formCard}>
        <h2 className={styles.formCardTitle}>
          {t(`step${step}Title`)}
          <span style={{ float: 'right', fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>
            {step} / {STEP_LABELS.length}
          </span>
        </h2>

        {renderStep()}

        <div className={styles.formActions}>
          {step > 1
            ? <button id="prev-btn" className="btn btn-outline" onClick={handlePrev}>{t('previous')}</button>
            : <span />
          }
          <button id="next-btn" className="btn btn-primary" onClick={handleNext}>
            {step === 6 ? t('submit') : t('next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreRegistration;
