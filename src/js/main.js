require('./i18n');
require('./gameApi.js');
require('./i18n/languages');

$(document).ready(($)=> {
  const i18nInstance = i18n.setup(languages, 'pt-BR');
  GAME_API.loadGame(i18nInstance);

  /* Game Controls */
  $('#resetGame').click(GAME_API.resetGame).text(i18nInstance.get('RESET_GAME_BUTTON'));
  $('#viewProgress').click(GAME_API.viewProgress).text(i18nInstance.get('VIEW_PROGRESS_BUTTON'));
  $('#helpMenu').click(GAME_API.showHelp);
  $('.language-selector').click(GAME_API.setLang);
  
  /* PopUp */
  $('#closePopup').click(GAME_API.closePopup);
  
  /* Hunt Marker found events */
  $('.game-marker').on('markerFound', GAME_API.markerFound);

});

