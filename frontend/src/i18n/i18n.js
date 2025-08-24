// Using mock implementation instead of actual i18next
import i18n, { initReactI18next, useTranslation } from './mockI18n';

// No need to import JSON files or initialize i18n
// The mock implementation already has the translations

export { useTranslation };
export default i18n;