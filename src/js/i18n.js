window.i18n = {
  languages: {},
  language: 'pt-BR',
  setup: (languages, current) => {
    i18n.languages = languages;
    i18n.language = current;
    return i18n;
  },
  use: (newLanguage) => {
    console.log('set new language ', newLanguage);
    i18n.language = newLanguage;
  },
  get: (token, args = {}) => {
    const statement = i18n.languages[i18n.language][token] || token;
    const keys = Object.keys(args);
    let translated = statement;

    keys.forEach(key => {
      const selector = `{${key}}`;
      translated = translated.replace(RegExp(selector, "g"), args[key]);
    });
    
    return translated;
  },
}
export default i18n;