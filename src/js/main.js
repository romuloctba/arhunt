require('./gameApi.js');

$(document).ready(($)=> {
  GAME_API.loadGame();

  /* Game Controls */
  $('#resetGame').click(GAME_API.resetGame);
  $('#viewProgress').click(GAME_API.viewProgress);
  $('#helpMenu').click(GAME_API.showHelp);
  
  /* PopUp */
  $('#closePopup').click(GAME_API.closePopup);
  
  /* Hunt Marker found events */
  $('.game-marker').on('markerFound', GAME_API.markerFound);

});

