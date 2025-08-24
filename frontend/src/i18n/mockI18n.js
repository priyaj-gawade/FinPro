// Mock implementation of i18next to avoid dependency errors
import React from 'react';

// Mock translations
const translations = {
  en: {
    app_title: "FinTooz",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    marathi: "Marathi",
    bengali: "Bengali",
    tamil: "Tamil",
    punjabi: "Punjabi",
    dashboard: "Dashboard",
    transactions: "Transactions",
    profile: "Profile",
    logout: "Logout",
    login: "Login",
    register: "Register",
    welcome: "Welcome",
    user: "User",
    locale: "en-US",
    financial_summary: "Financial Summary",
    financial_analytics: "Financial Analytics",
    balance: "Balance",
    income: "Income",
    expenses: "Expenses",
    current_balance: "Current Balance",
    monthly_total: "Monthly Total",
    updated_today: "Updated today",
    this_month: "This month",
    expense_distribution: "Expense Distribution",
    income_vs_expenses: "Income vs Expenses by Category",
    ask_ai_assistant: "Ask AI Assistant",
    "dashboard.overview": "Here's your financial overview. Track your spending, monitor your budget, and get personalized insights to improve your financial health.",
    // Transactions page
    transactions_description: "Manage your income and expenses. Add, edit, or delete transactions and filter by type, category, or date.",
    add_transaction: "Add Transaction",
    filter_transactions: "Filter Transactions",
    recent_transactions: "Recent Transactions",
    view_all: "View All",
    date: "Date",
    type: "Type",
    category: "Category",
    description: "Description",
    amount: "Amount",
    no_transactions_found: "No transactions found",
    add_your_first_transaction: "Add Your First Transaction",
    transaction_history: "Transaction History",
    // Profile page
    profile_description: "Manage your account settings and preferences.",
    update_profile: "Update Profile",
    personal_information: "Personal Information",
    security: "Security",
    save_changes: "Save Changes",
    // Phone verification
    phone_verification: "Phone Verification",
    phone_number: "Phone Number",
    send_verification_code: "Send Verification Code",
    verification_code: "Verification Code",
    verify: "Verify",
    change_phone: "Change Phone"
  },
  hi: {
    app_title: "फिनटूज़",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    marathi: "मराठी",
    bengali: "बंगाली",
    tamil: "तमिल",
    punjabi: "पंजाबी",
    dashboard: "डैशबोर्ड",
    transactions: "लेनदेन",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "रजिस्टर",
    welcome: "स्वागत है",
    user: "उपयोगकर्ता",
    locale: "hi-IN",
    financial_summary: "वित्तीय सारांश",
    financial_analytics: "वित्तीय विश्लेषण",
    balance: "बैलेंस",
    income: "आय",
    expenses: "व्यय",
    current_balance: "वर्तमान बैलेंस",
    monthly_total: "मासिक कुल",
    updated_today: "आज अपडेट किया गया",
    this_month: "इस महीने",
    expense_distribution: "व्यय वितरण",
    income_vs_expenses: "श्रेणी के अनुसार आय बनाम व्यय",
    ask_ai_assistant: "AI सहायक से पूछें",
    "dashboard.overview": "यहां आपका वित्तीय अवलोकन है। अपने खर्च को ट्रैक करें, अपने बजट की निगरानी करें, और अपने वित्तीय स्वास्थ्य को बेहतर बनाने के लिए व्यक्तिगत अंतर्दृष्टि प्राप्त करें।",
    // Transactions page
    transactions_description: "अपनी आय और व्यय का प्रबंधन करें। लेनदेन जोड़ें, संपादित करें, या हटाएं और प्रकार, श्रेणी, या तिथि द्वारा फ़िल्टर करें।",
    add_transaction: "लेनदेन जोड़ें",
    filter_transactions: "लेनदेन फ़िल्टर करें",
    recent_transactions: "हाल के लेनदेन",
    view_all: "सभी देखें",
    date: "तारीख",
    type: "प्रकार",
    category: "श्रेणी",
    description: "विवरण",
    amount: "राशि",
    no_transactions_found: "कोई लेनदेन नहीं मिला",
    add_your_first_transaction: "अपना पहला लेनदेन जोड़ें",
    transaction_history: "लेनदेन इतिहास",
    // Profile page
    profile_description: "अपने खाते की सेटिंग्स और प्राथमिकताओं का प्रबंधन करें।",
    update_profile: "प्रोफ़ाइल अपडेट करें",
    personal_information: "व्यक्तिगत जानकारी",
    security: "सुरक्षा",
    save_changes: "परिवर्तन सहेजें"
  },
  mr: {
    app_title: "फिनटूझ",
    language: "भाषा",
    english: "इंग्रजी",
    hindi: "हिंदी",
    marathi: "मराठी",
    bengali: "बंगाली",
    tamil: "तमिळ",
    punjabi: "पंजाबी",
    dashboard: "डॅशबोर्ड",
    transactions: "व्यवहार",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "नोंदणी",
    welcome: "स्वागत आहे",
    user: "वापरकर्ता",
    locale: "mr-IN",
    financial_summary: "आर्थिक सारांश",
    financial_analytics: "आर्थिक विश्लेषण",
    balance: "शिल्लक",
    income: "उत्पन्न",
    expenses: "खर्च",
    current_balance: "वर्तमान शिल्लक",
    monthly_total: "मासिक एकूण",
    updated_today: "आज अपडेट केले",
    this_month: "या महिन्यात",
    expense_distribution: "खर्च वितरण",
    income_vs_expenses: "श्रेणीनुसार उत्पन्न विरुद्ध खर्च",
    ask_ai_assistant: "AI सहाय्यकाला विचारा",
    "dashboard.overview": "हे आपले आर्थिक अवलोकन आहे. आपला खर्च ट्रॅक करा, आपल्या बजेटचे निरीक्षण करा, आणि आपले आर्थिक आरोग्य सुधारण्यासाठी वैयक्तिक अंतर्दृष्टी मिळवा.",
    // Transactions page
    transactions_description: "आपले उत्पन्न आणि खर्च व्यवस्थापित करा. व्यवहार जोडा, संपादित करा, किंवा हटवा आणि प्रकार, श्रेणी, किंवा तारखेनुसार फिल्टर करा.",
    add_transaction: "व्यवहार जोडा",
    filter_transactions: "व्यवहार फिल्टर करा",
    // Profile page
    profile_description: "आपल्या खात्याची सेटिंग्ज आणि प्राधान्ये व्यवस्थापित करा.",
    update_profile: "प्रोफाइल अपडेट करा",
    personal_information: "वैयक्तिक माहिती",
    security: "सुरक्षा",
    save_changes: "बदल जतन करा"
  },
  bn: {
    app_title: "ফিনটুজ",
    language: "ভাষা",
    english: "ইংরেজি",
    hindi: "হিন্দি",
    marathi: "মারাঠি",
    bengali: "বাংলা",
    tamil: "তামিল",
    punjabi: "পাঞ্জাবি",
    dashboard: "ড্যাশবোর্ড",
    transactions: "লেনদেন",
    profile: "প্রোফাইল",
    logout: "লগআউট",
    login: "লগইন",
    register: "নিবন্ধন",
    welcome: "স্বাগতম",
    user: "ব্যবহারকারী",
    locale: "bn-IN",
    financial_summary: "আর্থিক সারাংশ",
    financial_analytics: "আর্থিক বিশ্লেষণ",
    balance: "ব্যালেন্স",
    income: "আয়",
    expenses: "ব্যয়",
    current_balance: "বর্তমান ব্যালেন্স",
    monthly_total: "মাসিক মোট",
    updated_today: "আজ আপডেট করা হয়েছে",
    this_month: "এই মাসে",
    expense_distribution: "ব্যয় বিতরণ",
    income_vs_expenses: "বিভাগ অনুসারে আয় বনাম ব্যয়",
    ask_ai_assistant: "AI সহকারীকে জিজ্ঞাসা করুন",
    "dashboard.overview": "এখানে আপনার আর্থিক ওভারভিউ রয়েছে। আপনার খরচ ট্র্যাক করুন, আপনার বাজেট পর্যবেক্ষণ করুন, এবং আপনার আর্থিক স্বাস্থ্য উন্নত করতে ব্যক্তিগত অন্তর্দৃষ্টি পান।",
    // Transactions page
    transactions_description: "আপনার আয় এবং ব্যয় পরিচালনা করুন। লেনদেন যোগ করুন, সম্পাদনা করুন, বা মুছুন এবং ধরন, বিভাগ, বা তারিখ অনুসারে ফিল্টার করুন।",
    add_transaction: "লেনদেন যোগ করুন",
    filter_transactions: "লেনদেন ফিল্টার করুন",
    // Profile page
    profile_description: "আপনার অ্যাকাউন্ট সেটিংস এবং পছন্দগুলি পরিচালনা করুন।",
    update_profile: "প্রোফাইল আপডেট করুন",
    personal_information: "ব্যক্তিগত তথ্য",
    security: "নিরাপত্তা",
    save_changes: "পরিবর্তনগুলি সংরক্ষণ করুন"
  },
  ta: {
    app_title: "ஃபின்டூஸ்",
    language: "மொழி",
    english: "ஆங்கிலம்",
    hindi: "இந்தி",
    marathi: "மராத்தி",
    bengali: "வங்காளம்",
    tamil: "தமிழ்",
    punjabi: "பஞ்சாபி",
    dashboard: "டாஷ்போர்டு",
    transactions: "பரிவர்த்தனைகள்",
    profile: "சுயவிவரம்",
    logout: "வெளியேறு",
    login: "உள்நுழைக",
    register: "பதிவு செய்க",
    welcome: "வரவேற்கிறோம்",
    user: "பயனர்",
    locale: "ta-IN",
    financial_summary: "நிதி சுருக்கம்",
    financial_analytics: "நிதி பகுப்பாய்வு",
    balance: "இருப்பு",
    income: "வருமானம்",
    expenses: "செலவுகள்",
    current_balance: "தற்போதைய இருப்பு",
    monthly_total: "மாதாந்திர மொத்தம்",
    updated_today: "இன்று புதுப்பிக்கப்பட்டது",
    this_month: "இந்த மாதம்",
    expense_distribution: "செலவு விநியோகம்",
    income_vs_expenses: "வகை வாரியாக வருமானம் vs செலவுகள்",
    ask_ai_assistant: "AI உதவியாளரைக் கேளுங்கள்",
    "dashboard.overview": "இதோ உங்கள் நிதி கண்ணோட்டம். உங்கள் செலவைக் கண்காணிக்கவும், உங்கள் பட்ஜெட்டைக் கண்காணிக்கவும், உங்கள் நிதி ஆரோக்கியத்தை மேம்படுத்த தனிப்பயனாக்கப்பட்ட நுண்ணறிவுகளைப் பெறவும்.",
    // Transactions page
    transactions_description: "உங்கள் வருமானம் மற்றும் செலவுகளை நிர்வகிக்கவும். பரிவர்த்தனைகளைச் சேர்க்கவும், திருத்தவும் அல்லது நீக்கவும், மற்றும் வகை, பிரிவு அல்லது தேதி மூலம் வடிகட்டவும்.",
    add_transaction: "பரிவர்த்தனையைச் சேர்க்கவும்",
    filter_transactions: "பரிவர்த்தனைகளை வடிகட்டவும்",
    // Profile page
    profile_description: "உங்கள் கணக்கு அமைப்புகள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்.",
    update_profile: "சுயவிவரத்தைப் புதுப்பிக்கவும்",
    personal_information: "தனிப்பட்ட தகவல்",
    security: "பாதுகாப்பு",
    save_changes: "மாற்றங்களைச் சேமிக்கவும்"
  },
  pa: {
    app_title: "ਫਿਨਟੂਜ਼",
    language: "ਭਾਸ਼ਾ",
    english: "ਅੰਗਰੇਜ਼ੀ",
    hindi: "ਹਿੰਦੀ",
    marathi: "ਮਰਾਠੀ",
    bengali: "ਬੰਗਾਲੀ",
    tamil: "ਤਮਿਲ",
    punjabi: "ਪੰਜਾਬੀ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    transactions: "ਲੈਣ-ਦੇਣ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    logout: "ਲੌਗਆਊਟ",
    login: "ਲੌਗਇਨ",
    register: "ਰਜਿਸਟਰ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    user: "ਉਪਭੋਗਤਾ",
    locale: "pa-IN",
    financial_summary: "ਵਿੱਤੀ ਸਾਰ",
    financial_analytics: "ਵਿੱਤੀ ਵਿਸ਼ਲੇਸ਼ਣ",
    balance: "ਬੈਲੇਂਸ",
    income: "ਆਮਦਨ",
    expenses: "ਖਰਚੇ",
    current_balance: "ਮੌਜੂਦਾ ਬੈਲੇਂਸ",
    monthly_total: "ਮਹੀਨਾਵਾਰ ਕੁੱਲ",
    updated_today: "ਅੱਜ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ",
    this_month: "ਇਸ ਮਹੀਨੇ",
    expense_distribution: "ਖਰਚ ਵੰਡ",
    income_vs_expenses: "ਸ਼੍ਰੇਣੀ ਦੁਆਰਾ ਆਮਦਨ ਬਨਾਮ ਖਰਚੇ",
    ask_ai_assistant: "AI ਸਹਾਇਕ ਨੂੰ ਪੁੱਛੋ",
    "dashboard.overview": "ਇੱਥੇ ਤੁਹਾਡਾ ਵਿੱਤੀ ਸੰਖੇਪ ਜਾਣਕਾਰੀ ਹੈ। ਆਪਣੇ ਖਰਚਿਆਂ ਨੂੰ ਟਰੈਕ ਕਰੋ, ਆਪਣੇ ਬਜਟ 'ਤੇ ਨਜ਼ਰ ਰੱਖੋ, ਅਤੇ ਆਪਣੀ ਵਿੱਤੀ ਸਿਹਤ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ ਨਿੱਜੀ ਅੰਤਰਦਿਰਸ਼ਟੀ ਪ੍ਰਾਪਤ ਕਰੋ।",
    // Transactions page
    transactions_description: "ਆਪਣੀ ਆਮਦਨ ਅਤੇ ਖਰਚਿਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ। ਲੈਣ-ਦੇਣ ਜੋੜੋ, ਸੰਪਾਦਿਤ ਕਰੋ, ਜਾਂ ਮਿਟਾਓ ਅਤੇ ਕਿਸਮ, ਸ਼੍ਰੇਣੀ, ਜਾਂ ਤਾਰੀਖ ਦੁਆਰਾ ਫਿਲਟਰ ਕਰੋ।",
    add_transaction: "ਲੈਣ-ਦੇਣ ਜੋੜੋ",
    filter_transactions: "ਲੈਣ-ਦੇਣ ਫਿਲਟਰ ਕਰੋ",
    // Profile page
    profile_description: "ਆਪਣੇ ਖਾਤੇ ਦੀਆਂ ਸੈਟਿੰਗਾਂ ਅਤੇ ਤਰਜੀਹਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।",
    update_profile: "ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਕਰੋ",
    personal_information: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
    security: "ਸੁਰੱਖਿਆ",
    save_changes: "ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ"
  }
};

// Available languages
const languages = ['en', 'hi', 'mr', 'bn', 'ta', 'pa'];

// Current language
let currentLanguage = 'en';
try {
  const storedLanguage = localStorage.getItem('language');
  if (storedLanguage && languages.includes(storedLanguage)) {
    currentLanguage = storedLanguage;
  } else {
    localStorage.setItem('language', currentLanguage);
  }
} catch (error) {
  console.error('Error accessing localStorage:', error);
}

// Event listeners for language change
const listeners = [];

// Mock i18n object
const i18n = {
  language: currentLanguage,
  languages: languages,
  changeLanguage: (lng) => {
    if (currentLanguage !== lng && languages.includes(lng)) {
      currentLanguage = lng;
      localStorage.setItem('language', lng);
      i18n.language = lng;
      
      // Notify all listeners about the language change
      setTimeout(() => {
        listeners.forEach(listener => listener(lng));
      }, 0);
    }
    
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
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    // Add listener to force component re-render on language change
    const handleLanguageChange = () => forceUpdate();
    i18n.on('languageChanged', handleLanguageChange);
    
    // Cleanup listener on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);
  
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