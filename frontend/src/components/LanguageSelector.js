import React from 'react';
import { useTranslation } from '../i18n/i18n';

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
        <option value="bn">{t('bengali')}</option>
        <option value="ta">{t('tamil')}</option>
        <option value="pa">{t('punjabi')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;