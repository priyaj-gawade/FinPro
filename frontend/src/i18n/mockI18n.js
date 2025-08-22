// Mock implementation of i18next to avoid dependency errors

// Mock translations
const translations = {
  en: {
    app_title: "FinTooz",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    marathi: "Marathi",
    dashboard: "Dashboard",
    transactions: "Transactions",
    profile: "Profile",
    logout: "Logout",
    login: "Login",
    register: "Register",
    // Add more translations as needed
  },
  hi: {
    app_title: "फिनटूज़",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    marathi: "मराठी",
    dashboard: "डैशबोर्ड",
    transactions: "लेनदेन",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "रजिस्टर",
    // Add more translations as needed
  },
  mr: {
    app_title: "फिनटूझ",
    language: "भाषा",
    english: "इंग्रजी",
    hindi: "हिंदी",
    marathi: "मराठी",
    dashboard: "डॅशबोर्ड",
    transactions: "व्यवहार",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "नोंदणी",
    // Add more translations as needed
  }
};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

// Event listeners for language change
const listeners = [];

// Mock i18n object
const i18n = {
  language: currentLanguage,
  changeLanguage: (lng) => {
    currentLanguage = lng;
    localStorage.setItem('language', lng);
    i18n.language = lng;
    
    // Notify all listeners about the language change
    listeners.forEach(listener => listener(lng));
    
    // Force page refresh to apply changes immediately
    window.location.reload();
    
    return Promise.resolve(lng);
  },
  t: (key) => {
    return translations[currentLanguage][key] || key;
  },
  // Add listener for language changes
  on: (event, callback) => {
    if (event === 'languageChanged') {
      listeners.push(callback);
    }
    return i18n;
  },
  // Remove listener
  off: (event, callback) => {
    if (event === 'languageChanged') {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
    return i18n;
  }
};

// Mock useTranslation hook
export const useTranslation = () => {
  return {
    t: (key) => i18n.t(key),
    i18n
  };
};

// Mock initReactI18next
export const initReactI18next = {
  type: 'backend',
  init: () => {}
};

export default i18n;