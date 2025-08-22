import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-selector">
      <label>{t('language')}: </label>
      <select 
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
      >
        <option value="en">{t('english')}</option>
        <option value="hi">{t('hindi')}</option>
        <option value="mr">{t('marathi')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;