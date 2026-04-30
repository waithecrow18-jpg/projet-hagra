import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const SCHOOLS = [
  { id: 'FSJESAC', name: 'FacultÃ© des Sciences Juridiques, Ã‰conomiques et Sociales - AÃ¯n Chock', address: "Km 8, Route d'El Jadida, BP 8110, Oasis, Casablanca" },
  { id: 'FSJESAS', name: 'FacultÃ© des Sciences Juridiques, Ã‰conomiques et Sociales - AÃ¯n SebaÃ¢', address: 'Angle Bd. Yacoub El Mansour et Bd. Roudani, AÃ¯n SebaÃ¢, Casablanca' },
  { id: 'FSJESM', name: 'FacultÃ© des Sciences Juridiques, Ã‰conomiques et Sociales - Mohammedia', address: 'BP 145, Mohammedia' },
  { id: 'ENCG', name: 'Ã‰cole Nationale de Commerce et de Gestion', address: 'Beau Site, BP 2725, AÃ¯n SebaÃ¢, Casablanca' },
  { id: 'FLSHAC', name: 'FacultÃ© des Lettres et des Sciences Humaines - AÃ¯n Chock', address: "Km 8, Route d'El Jadida, BP 6010, Casablanca" },
  { id: 'FLSHBM', name: "FacultÃ© des Lettres et des Sciences Humaines - Ben M'sik", address: 'Av. Errahmouni Boualam, BP 7951, Ben M\'sik, Casablanca' },
  { id: 'FLSHM', name: 'FacultÃ© des Lettres et des Sciences Humaines - Mohammedia', address: 'BP 546, Mohammedia' },
  { id: 'ENS', name: 'Ã‰cole Normale SupÃ©rieure', address: "Km 9, Route d'El Jadida, BP 50069, Ghandi, Casablanca" },
  { id: 'FSAC', name: 'FacultÃ© des Sciences - AÃ¯n Chock', address: "Km 8, Route d'El Jadida, BP 5366, MaÃ¢rif, Casablanca" },
  { id: 'FSBM', name: "FacultÃ© des Sciences - Ben M'sik", address: 'Av. Commandant Idriss El Harti, BP 7955, Ben M\'sik, Casablanca' },
  { id: 'FSTM', name: 'FacultÃ© des Sciences et Techniques - Mohammedia', address: 'BP 146, Route de Rabat, Mohammedia 28806' },
  { id: 'EST', name: 'Ã‰cole SupÃ©rieure de Technologie', address: "Km 7, Route d'El Jadida, BP 8012, Oasis, Casablanca" },
  { id: 'ENSEM', name: "Ã‰cole Nationale SupÃ©rieure d'Ã‰lectricitÃ© et de MÃ©canique", address: "Km 7, Route d'El Jadida, BP 8118, Oasis, Casablanca" },
  { id: 'ENSAM', name: "Ã‰cole Nationale SupÃ©rieure d'Arts et MÃ©tiers", address: '50 Av. Nile, Sidi Othman, Casablanca 20670' },
  { id: 'ENSAD', name: "Ã‰cole Nationale SupÃ©rieure d'Art et de Design", address: 'Bd. Oued Ziz, AÃ¯n Chock, Casablanca' },
  { id: 'FMPC', name: 'FacultÃ© de MÃ©decine et de Pharmacie', address: '19 Rue Tarik Ibnou Ziad, BP 9154, Mers Sultan, Casablanca' },
  { id: 'FMD', name: 'FacultÃ© de MÃ©decine Dentaire', address: 'Rue Abou Al Alaa Zahar, BP 9154, Quartier des HÃ´pitaux, Casablanca' },
  { id: 'ISPITS', name: 'Institut SupÃ©rieur des Professions InfirmiÃ¨res et Techniques de SantÃ©', address: 'Quartier des HÃ´pitaux, Casablanca' },
];

const SEED_USERS = [
  {
    id: 'admin-1',
    name: 'Super Administrateur',
    email: 'admin@univh2c.ma',
    password: 'admin123',
    role: 'superadmin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'manager-1',
    name: 'Admin Manager',
    email: 'manager@univh2c.ma',
    password: 'manager123',
    role: 'manager',
    assignedSchool: 'FSJESAC',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-demo',
    name: 'Ahmed Benali',
    email: 'ahmed@student.ma',
    password: 'student123',
    role: 'student',
    cne: 'R123456789',
    isVerified: true,
    createdAt: new Date().toISOString(),
    preRegistration: null,
  },
];

const API_URL = 'http://localhost:3001';

const getStoredSession = () => {
  const session = localStorage.getItem('session');
  return session ? JSON.parse(session) : null;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getStoredSession);

  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (!stored) {
      localStorage.setItem('users', JSON.stringify(SEED_USERS));
    } else {
      const users = JSON.parse(stored);
      if (!users.find((user) => user.role === 'superadmin')) {
        const superAdmins = SEED_USERS.filter((seedUser) => seedUser.role === 'superadmin');
        localStorage.setItem('users', JSON.stringify([...superAdmins, ...users]));
      }
    }

    if (!localStorage.getItem('siteStatus')) {
      localStorage.setItem('siteStatus', 'open');
    }

  }, []);

  const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
  const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

  const showOtpDeliveryInfo = (result, label) => {
    if (result.previewUrl) {
      console.log(`%c${label}`, 'background: #222; color: #bada55; font-size: 16px; padding: 4px;');
      console.log(`%cCliquez ici pour lire l'email : ${result.previewUrl}`, 'font-size: 14px; font-weight: bold; color: #3b82f6;');
      alert("Un email OTP de test a ete genere. Regardez la console du navigateur (F12) pour ouvrir le lien.");
      return;
    }

    if (result.devOtp) {
      console.log(`%c${label}`, 'background: #1f2937; color: #fbbf24; font-size: 16px; padding: 4px;');
      console.log(`%cCode OTP local : ${result.devOtp}`, 'font-size: 16px; font-weight: bold; color: #10b981;');
      if (result.warning) {
        console.warn(result.warning);
      }
      alert(`Mode local OTP\n\nCode: ${result.devOtp}\n\n${result.warning || "Le serveur email est en mode local."}`);
    }
  };

  const getOtpMeta = (result) => {
    if (!result) {
      return null;
    }

    if (!result.devOtp && !result.previewUrl && !result.warning) {
      return null;
    }

    return {
      devOtp: result.devOtp || '',
      previewUrl: result.previewUrl || '',
      warning: result.warning || '',
      deliveryMode: result.deliveryMode || (result.previewUrl ? 'preview' : 'email'),
    };
  };

  const getSiteStatus = () => localStorage.getItem('siteStatus') || 'open';

  const toggleSiteStatus = () => {
    const current = getSiteStatus();
    const next = current === 'open' ? 'closed' : 'open';
    localStorage.setItem('siteStatus', next);
    return next;
  };

  const login = async (email, password) => {
    const users = getUsers();
    const user = users.find((entry) => entry.email === email && entry.password === password);

    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }

    if (user.role === 'student' && !user.isVerified) {
      return {
        success: false,
        needsVerification: true,
        email: user.email,
        name: user.name,
        error: 'Compte non vÃ©rifiÃ©. Veuillez entrer le code OTP envoyÃ© Ã  votre email.',
      };
    }

    setCurrentUser(user);
    localStorage.setItem('session', JSON.stringify(user));
    return { success: true, user };
  };

  const register = async (data) => {
    const users = getUsers();
    if (users.find((user) => user.email === data.email)) {
      return { success: false, error: 'Un compte avec cet email existe dÃ©jÃ .' };
    }

    const newUser = {
      ...data,
      id: `student-${Date.now()}`,
      role: 'student',
      isVerified: false,
      createdAt: new Date().toISOString(),
      preRegistration: null,
    };

    try {
      const res = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name: data.name }),
      });
      const result = await res.json();

      if (!res.ok) {
        return { success: false, error: result.error || "Impossible d'envoyer le code OTP." };
      }

      showOtpDeliveryInfo(result, 'OTP inscription genere');
      saveUsers([...users, newUser]);
      return { success: true, user: newUser, otpMeta: getOtpMeta(result) };
    } catch (err) {
      console.error('OTP send error:', err);
      return { success: false, error: 'Erreur de connexion au serveur OTP.' };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error };
      }

      const users = getUsers();
      let loggedInUser = null;

      const updatedUsers = users.map((user) => {
        if (user.email === email) {
          const verifiedUser = { ...user, isVerified: true };
          setCurrentUser(verifiedUser);
          localStorage.setItem('session', JSON.stringify(verifiedUser));
          loggedInUser = verifiedUser;
          return verifiedUser;
        }

        return user;
      });

      saveUsers(updatedUsers);
      return { success: true, user: loggedInUser };
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur.' };
    }
  };

  const resendOtp = async (email, name) => {
    try {
      const res = await fetch(`${API_URL}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const result = await res.json();

      if (!res.ok) {
        return { success: false, error: result.error };
      }

      showOtpDeliveryInfo(result, 'OTP renvoye');
      return { success: true, otpMeta: getOtpMeta(result) };
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('session');
  };

  const updateUser = (updatedUser) => {
    const users = getUsers();
    const newUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
    saveUsers(newUsers);

    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('session', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (userId) => {
    const users = getUsers();
    saveUsers(users.filter((user) => user.id !== userId));
  };

  const addUser = (data) => {
    const users = getUsers();
    if (users.find((user) => user.email === data.email)) {
      return { success: false, error: 'Un compte avec cet email existe dÃ©jÃ .' };
    }

    const newUser = {
      ...data,
      id: `student-${Date.now()}`,
      role: 'student',
      isVerified: true,
      createdAt: new Date().toISOString(),
      preRegistration: null,
    };

    saveUsers([...users, newUser]);
    return { success: true, user: newUser };
  };

  const getAllStudents = () => getUsers().filter((user) => user.role === 'student');

  const getStudentsBySchool = (schoolId) => getUsers().filter((user) => {
    if (user.role !== 'student') {
      return false;
    }

    if (!user.preRegistration?.data?.step4?.etab1) {
      return false;
    }

    const school = SCHOOLS.find((entry) => entry.id === schoolId);
    return (
      user.preRegistration.data.step4.etab1 === schoolId ||
      user.preRegistration.data.step4.etab1 === school?.name
    );
  });

  const getAllManagers = () => getUsers().filter((user) => user.role === 'manager');

  const addManager = (data) => {
    const users = getUsers();
    if (users.find((user) => user.email === data.email)) {
      return { success: false, error: 'Un compte avec cet email existe dÃ©jÃ .' };
    }

    const newManager = {
      ...data,
      id: `manager-${Date.now()}`,
      role: 'manager',
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newManager]);
    return { success: true, user: newManager };
  };

  const savePreRegistration = (data) => {
    const users = getUsers();
    const updatedUsers = users.map((user) => {
      if (user.id === currentUser.id) {
        const updatedUser = { ...user, preRegistration: data };
        setCurrentUser(updatedUser);
        localStorage.setItem('session', JSON.stringify(updatedUser));
        return updatedUser;
      }

      return user;
    });

    saveUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateUser,
        deleteUser,
        addUser,
        getAllStudents,
        getStudentsBySchool,
        getAllManagers,
        addManager,
        savePreRegistration,
        verifyOtp,
        resendOtp,
        getSiteStatus,
        toggleSiteStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
