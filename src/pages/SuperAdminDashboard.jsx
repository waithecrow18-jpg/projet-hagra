import React, { useState } from 'react';
import { Shield, Users, Building2, Plus, Pencil, Trash2, X, LogOut, Power } from 'lucide-react';
import { useAuth, SCHOOLS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './Student.module.css';
import adminStyles from './SuperAdmin.module.css';

const EMPTY_MANAGER = { name: '', email: '', password: '', assignedSchool: '' };

const SuperAdminDashboard = () => {
  const { 
    getAllManagers, addManager, updateUser, deleteUser, 
    getAllStudents, getSiteStatus, toggleSiteStatus, logout 
  } = useAuth();
  
  const { t, toggleLang } = useLanguage();
  
  const [managers, setManagers] = useState(getAllManagers());
  const [students] = useState(getAllStudents());
  const [siteOpen, setSiteOpen] = useState(getSiteStatus() === 'open');
  
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_MANAGER);
  const [error, setError] = useState('');

  const refresh = () => setManagers(getAllManagers());

  const handleToggleSite = () => {
    const nextStatus = toggleSiteStatus();
    setSiteOpen(nextStatus === 'open');
  };

  const openAdd = () => { setForm(EMPTY_MANAGER); setError(''); setModal('add'); };
  const openEdit = (manager) => {
    setSelected(manager);
    setForm({ name: manager.name, email: manager.email, password: '', assignedSchool: manager.assignedSchool });
    setError('');
    setModal('edit');
  };
  const openDelete = (manager) => { setSelected(manager); setModal('delete'); };

  const handleAdd = () => {
    if (!form.name || !form.email || !form.password || !form.assignedSchool) {
      setError('Tous les champs sont requis.');
      return;
    }
    const result = addManager(form);
    if (!result.success) { setError(result.error); return; }
    refresh();
    setModal(null);
  };

  const handleEdit = () => {
    if (!form.name || !form.email || !form.assignedSchool) { 
      setError('Nom, email et école requis.'); return; 
    }
    const updated = { ...selected, name: form.name, email: form.email, assignedSchool: form.assignedSchool };
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

  // Build a map of schools and their assigned managers
  const schoolsData = SCHOOLS.map(school => {
    const manager = managers.find(m => m.assignedSchool === school.id);
    return { ...school, manager };
  });

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

      <div className={adminStyles.adminWrapper}>
        <div className={adminStyles.adminHeader}>
          <div>
            <h1 className={adminStyles.adminTitle}>Administration Globale</h1>
            <p className={adminStyles.adminSubtitle}>Vue d'ensemble et gestion de la plateforme</p>
          </div>
        </div>

        {/* Site Status Control */}
        <div className={adminStyles.statusCard}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Power size={20} color={siteOpen ? '#10b981' : '#ef4444'} />
              Statut des Inscriptions
            </h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {siteOpen ? 'Les étudiants peuvent s\'inscrire et soumettre leurs dossiers.' : 'Les inscriptions sont actuellement suspendues.'}
            </p>
          </div>
          <label className={adminStyles.toggleSwitch}>
            <input type="checkbox" checked={siteOpen} onChange={handleToggleSite} />
            <span className={adminStyles.slider}></span>
          </label>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsRow} style={{ marginBottom: 40 }}>
          <div className={styles.miniStat}>
            <div className={styles.miniStatValue} style={{ color: 'var(--color-primary)' }}>{students.length}</div>
            <div className={styles.miniStatLabel}>Total Étudiants inscrits</div>
          </div>
          <div className={styles.miniStat}>
            <div className={styles.miniStatValue} style={{ color: '#8b5cf6' }}>{managers.length}</div>
            <div className={styles.miniStatLabel}>Managers actifs</div>
          </div>
          <div className={styles.miniStat}>
            <div className={styles.miniStatValue} style={{ color: '#f59e0b' }}>{SCHOOLS.length}</div>
            <div className={styles.miniStatLabel}>Établissements</div>
          </div>
        </div>

        <div className={adminStyles.grid}>
          {/* Managers Table */}
          <div className={adminStyles.card} style={{ gridColumn: '1 / -1' }}>
            <div className={adminStyles.cardHeader}>
              <h2 className={adminStyles.cardTitle}>Gestion des Managers</h2>
              <button className="btn btn-primary" onClick={openAdd}>
                <Plus size={16} /> Nouveau Manager
              </button>
            </div>
            <div className={styles.tableWrapper} style={{ boxShadow: 'none', border: 'none', padding: 0 }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nom & Email</th>
                    <th>Établissement assigné</th>
                    <th>Créé le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>Aucun manager trouvé.</td></tr>
                  )}
                  {managers.map(m => {
                    const school = SCHOOLS.find(s => s.id === m.assignedSchool);
                    return (
                      <tr key={m.id}>
                        <td>
                          <strong>{m.name}</strong>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{m.email}</div>
                        </td>
                        <td>
                          <span className={`${adminStyles.badge} ${school ? adminStyles.badgeAssigned : ''}`}>
                            {school ? school.id : 'Non assigné'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                          {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button className={`${styles.iconBtn} ${styles.editBtn}`} onClick={() => openEdit(m)}>
                              <Pencil size={15} />
                            </button>
                            <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => openDelete(m)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Schools Overview */}
          <div className={adminStyles.card} style={{ gridColumn: '1 / -1' }}>
            <div className={adminStyles.cardHeader}>
              <h2 className={adminStyles.cardTitle}>Établissements UH2C</h2>
            </div>
            <ul className={adminStyles.schoolList}>
              {schoolsData.map(school => (
                <li key={school.id} className={adminStyles.schoolItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className={adminStyles.schoolName}>{school.name} ({school.id})</div>
                      <div className={adminStyles.schoolManager}>
                        {school.address}
                      </div>
                    </div>
                    <div>
                      {school.manager ? (
                        <span className={`${adminStyles.badge} ${adminStyles.badgeAssigned}`}>
                          Manager: {school.manager.name}
                        </span>
                      ) : (
                        <span className={adminStyles.badge}>Sans manager</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add / Edit Manager Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className={styles.modalTitle} style={{ margin: 0 }}>
                {modal === 'add' ? 'Ajouter un Manager' : 'Modifier le Manager'}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>{error}</div>}
            
            <div className={styles.formGroup} style={{ marginBottom: 16 }}>
              <label className={styles.formLabel}>Nom complet *</label>
              <input type="text" className={styles.formInput} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            
            <div className={styles.formGroup} style={{ marginBottom: 16 }}>
              <label className={styles.formLabel}>Email *</label>
              <input type="email" className={styles.formInput} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: 16 }}>
              <label className={styles.formLabel}>Établissement assigné *</label>
              <select className={styles.formInput} value={form.assignedSchool} onChange={e => setForm({...form, assignedSchool: e.target.value})}>
                <option value="">Sélectionner une école...</option>
                {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
              </select>
            </div>

            <div className={styles.formGroup} style={{ marginBottom: 24 }}>
              <label className={styles.formLabel}>{modal === 'add' ? 'Mot de passe *' : 'Nouveau mot de passe (optionnel)'}</label>
              <input type="password" className={styles.formInput} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>

            <div className={styles.modalActions}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={modal === 'add' ? handleAdd : handleEdit}>
                {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Manager Modal */}
      {modal === 'delete' && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h2 className={styles.modalTitle}>Supprimer ce manager ?</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
              Êtes-vous sûr de vouloir supprimer l'accès pour <strong>{selected?.name}</strong> ?
            </p>
            <div className={styles.modalActions}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn" onClick={handleDelete} style={{ background: '#ef4444', color: 'white' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
