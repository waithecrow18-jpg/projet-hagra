import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  fr: {
    // Nav
    home: 'Accueil',
    search: 'Recherche',
    info: 'Infos',
    preregistration: 'Préinscription',
    logout: 'Déconnexion',
    // Landing
    sessionLabel: "SESSION D'ADMISSION 2024-2025",
    heroTitle: 'Plateforme de Préinscription Universitaire',
    heroSubtitle: "Rejoignez l'excellence académique. Commencez votre parcours dès aujourd'hui.",
    signUp: "S'inscrire",
    learnMore: 'En savoir plus',
    accreditation: 'Accréditation Officielle',
    // Auth
    loginTitle: 'Connexion',
    loginSubtitle: 'Accédez à votre espace étudiant',
    email: 'Email',
    password: 'Mot de passe',
    loginBtn: 'Se connecter',
    noAccount: "Pas encore de compte ?",
    registerLink: "Créer un compte",
    registerTitle: 'Inscription',
    registerSubtitle: 'Créez votre espace étudiant',
    fullName: 'Nom complet',
    cne: 'CNE / Numéro Massar',
    confirmPassword: 'Confirmer le mot de passe',
    registerBtn: "S'inscrire",
    haveAccount: 'Déjà un compte ?',
    loginLink: 'Se connecter',
    // Steps
    step1Title: 'Informations Personnelles',
    step2Title: 'Coordonnées',
    step3Title: 'Baccalauréat',
    step4Title: "Choix de l'Établissement",
    step5Title: 'Couverture Médicale (AMO)',
    step6Title: 'Photo Personnelle',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Soumettre',
    // Success
    successTitle: 'Préinscription Réussie !',
    successMessage: "Félicitations ! Votre dossier de préinscription a été soumis avec succès.",
    downloadBtn: "Télécharger le formulaire de pré-inscription",
    // Manager
    managerTitle: 'Tableau de Bord Manager',
    addStudent: 'Ajouter un Étudiant',
    editStudent: 'Modifier',
    deleteStudent: 'Supprimer',
    studentList: 'Liste des Étudiants',
    // General
    search_placeholder: 'Rechercher des établissements...',
    language: 'العربية',
    // Appointment
    appointmentTitle: 'Rendez-vous de dépôt',
    appointmentDesc: 'Réservez un créneau pour déposer votre dossier à l\'établissement.',
    bookAppointment: 'Prendre un rendez-vous',
    appointmentDate: 'Choisir une date',
    appointmentTime: 'Choisir un créneau horaire',
    confirmAppointment: 'Confirmer le rendez-vous',
    appointmentConfirmed: 'Rendez-vous confirmé',
    appointmentLocation: 'Service de Scolarité — Bâtiment principal',
    appointmentReminder: 'Pensez à apporter votre CIN, le formulaire imprimé, et 2 photos d\'identité.',
    weekendWarning: 'Le service est fermé le week-end. Veuillez choisir un jour ouvrable.',
    slotsAvailable: 'créneaux disponibles',
    slotDuration: 'Durée : 30 min',
  },
  ar: {
    // Nav
    home: 'الرئيسية',
    search: 'بحث',
    info: 'معلومات',
    preregistration: 'التسجيل القبلي',
    logout: 'تسجيل الخروج',
    // Landing
    sessionLabel: 'موسم القبول 2024-2025',
    heroTitle: 'منصة التسجيل القبلي الجامعي',
    heroSubtitle: 'انضم إلى التميز الأكاديمي. ابدأ مسارك اليوم.',
    signUp: 'سجل الآن',
    learnMore: 'اكتشف المزيد',
    accreditation: 'اعتماد رسمي',
    // Auth
    loginTitle: 'تسجيل الدخول',
    loginSubtitle: 'الولوج إلى فضاء الطالب الخاص بك',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'دخول',
    noAccount: 'ليس لديك حساب؟',
    registerLink: 'إنشاء حساب',
    registerTitle: 'إنشاء حساب',
    registerSubtitle: 'قم بإنشاء فضاء الطالب الخاص بك',
    fullName: 'الاسم الكامل',
    cne: 'رمز مسار / CNE',
    confirmPassword: 'تأكيد كلمة المرور',
    registerBtn: 'إنشاء',
    haveAccount: 'لديك حساب بالفعل؟',
    loginLink: 'تسجيل الدخول',
    // Steps
    step1Title: 'المعلومات الشخصية',
    step2Title: 'معلومات الاتصال',
    step3Title: 'البكالوريا',
    step4Title: 'اختيار المؤسسة',
    step5Title: 'التغطية الصحية (AMO)',
    step6Title: 'الصورة الشخصية',
    next: 'التالي',
    previous: 'السابق',
    submit: 'تأكيد الطلب',
    // Success
    successTitle: 'تم التسجيل بنجاح!',
    successMessage: 'تهانينا! لقد تم تقديم طلب التسجيل القبلي الخاص بك بنجاح.',
    downloadBtn: 'تحميل استمارة التسجيل القبلي',
    // Manager
    managerTitle: 'لوحة تحكم المدير',
    addStudent: 'إضافة طالب',
    editStudent: 'تعديل',
    deleteStudent: 'حذف',
    studentList: 'قائمة الطلاب',
    // General
    search_placeholder: 'البحث عن مؤسسات...',
    language: 'Français',
    // Appointment
    appointmentTitle: 'موعد إيداع الملف',
    appointmentDesc: 'احجز موعداً لإيداع ملفك بالمؤسسة.',
    bookAppointment: 'أخذ موعد',
    appointmentDate: 'اختر تاريخاً',
    appointmentTime: 'اختر توقيتاً',
    confirmAppointment: 'تأكيد الموعد',
    appointmentConfirmed: 'تم تأكيد الموعد',
    appointmentLocation: 'مصلحة الشؤون الطلابية — المبنى الرئيسي',
    appointmentReminder: 'لا تنس إحضار بطاقتك الوطنية، الاستمارة المطبوعة، وصورتين شمسيتين.',
    weekendWarning: 'المصلحة مغلقة في عطلة نهاية الأسبوع. يرجى اختيار يوم عمل.',
    slotsAvailable: 'مواعيد متاحة',
    slotDuration: 'المدة: 30 دقيقة',
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('fr');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang(l => l === 'fr' ? 'ar' : 'fr');

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
