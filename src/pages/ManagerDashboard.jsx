import React, { useState } from 'react';
import { UserPlus, Pencil, Trash2, X, LogOut, Search, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SCHOOLS } from '../context/AuthContext';
import styles from './Student.module.css';

const EMPTY_STUDENT = { name: '', email: '', cne: '', password: '' };

const ManagerDashboard = () => {
  const { currentUser, getStudentsBySchool, getAllStudents, addUser, updateUser, deleteUser, logout } = useAuth();
  const { t, toggleLang } = useLanguage();

  const assignedSchool = currentUser?.assignedSchool;
  const schoolInfo = SCHOOLS.find(s => s.id === assignedSchool);

  // Get students for this manager's school
  const fetchStudents = () => {
    if (assignedSchool) {
      return getStudentsBySchool(assignedSchool);
    }
    return getAllStudents();
  };

  const [students, setStudents] = useState(fetchStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [error, setError] = useState('');

  const refresh = () => setStudents(fetchStudents());

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.cne || '').toLowerCase().includes(q);
  });

  const openAdd = () => { setForm(EMPTY_STUDENT); setError(''); setModal('add'); };
  const openEdit = (student) => {
    setSelected(student);
    setForm({ name: student.name, email: student.email, cne: student.cne || '', password: '' });
    setError('');
    setModal('edit');
  };
  const openDelete = (student) => { setSelected(student); setModal('delete'); };

  const handleAdd = () => {
    if (!form.name || !form.email || !form.cne || !form.password) {
      setError('Tous les champs sont requis.');
      return;
    }
    const result = addUser(form);
    if (!result.success) { setError(result.error); return; }
    refresh();
    setModal(null);
  };

  const handleEdit = () => {
    if (!form.name || !form.email) { setError('Nom et email requis.'); return; }
    const updated = { ...selected, name: form.name, email: form.email, cne: form.cne };
    if (form.password) updated.password = form.password;
    updateUser(updated);
    refresh();
    setModal(null);
  };

  const handleDelete = () => {
    deleteUser(selected.id);
    refresh();
    setModal(null);
  };

  const completedCount = students.filter(s => s.preRegistration).length;
  const pendingCount = students.length - completedCount;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-gray-light)' }}>
      {/* Top Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <img src="/logo.png" alt="Université Hassan II" style={{ height: '45px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className={styles.navActions}>
            <button className={styles.navLangBtn} onClick={toggleLang}>{t('language')}</button>
            <button className={styles.navLogoutBtn} onClick={logout}>
              <LogOut size={16} /> {t('logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.managerWrapper}>
        <div className={styles.managerHeader}>
          <div>
            <h1 className={styles.managerTitle}>{t('managerTitle')}</h1>
            {schoolInfo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <Building2 size={16} />
                <span><strong>{schoolInfo.id}</strong> — {schoolInfo.name}</span>
              </div>
            )}
          </div>
          <button id="add-student-btn" className="btn btn-primary" onClick={openAdd}>
            <UserPlus size={18} /> {t('addStudent')}
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.miniStat}>
            <div className={styles.miniStatValue}>{students.length}</div>
            <div className={styles.miniStatLabel}>Total étudiants</div>
          </div>
          <div className={styles.miniStat}>
            <div className={styles.miniStatValue} style={{ color: '#10b981' }}>{completedCount}</div>
            <div className={styles.miniStatLabel}>Dossiers soumis</div>
          </div>
          <div className={styles.miniStat}>
            <div className={styles.miniStatValue} style={{ color: 'var(--color-orange)' }}>{pendingCount}</div>
            <div className={styles.miniStatLabel}>En attente</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ position: 'relative', maxWidth: 400 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou CNE..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.formInput}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>CNE</th>
                <th>Dossier</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>Aucun étudiant trouvé.</td></tr>
              )}
              {filteredStudents.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{s.email}</td>
                  <td>{s.cne || '—'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${s.preRegistration ? styles.statusDone : styles.statusPending}`}>
                      {s.preRegistration ? 'Soumis' : 'En attente'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={`${styles.iconBtn} ${styles.editBtn}`} title="Modifier" onClick={() => openEdit(s)}>
                        <Pencil size={15} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Supprimer" onClick={() => openDelete(s)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className={styles.modalTitle} style={{ margin: 0 }}>
                {modal === 'add' ? t('addStudent') : t('editStudent')}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: '0.88rem' }}>{error}</div>}
            {[
              ['name', 'text', 'Nom complet *', 'Mohamed Alami'],
              ['email', 'email', 'Email *', 'etudiant@email.ma'],
              ['cne', 'text', 'CNE / Massar *', 'R123456789'],
              ['password', 'password', modal === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe (opt.)', '••••••••'],
            ].map(([field, type, label, ph]) => (
              <div className={styles.formGroup} key={field} style={{ marginBottom: 16 }}>
                <label className={styles.formLabel}>{label}</label>
                <input
                  id={`modal-${field}`}
                  type={type}
                  className={styles.formInput}
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  placeholder={ph}
                />
              </div>
            ))}
            <div className={styles.modalActions}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button id="modal-save-btn" className="btn btn-primary" onClick={modal === 'add' ? handleAdd : handleEdit}>
                {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === 'delete' && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h2 className={styles.modalTitle}>Confirmer la suppression</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 8 }}>
              Voulez-vous vraiment supprimer l'étudiant <strong>{selected?.name}</strong> ?
            </p>
            <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>Cette action est irréversible.</p>
            <div className={styles.modalActions}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button id="confirm-delete-btn" className="btn" onClick={handleDelete}
                style={{ background: '#ef4444', color: 'white' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
