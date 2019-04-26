const STORAGE_KEY = 'ar-easter-hunt';

GAME_API = {
  availablePaths: {
    a1: [1, 2, 3, 4, 5, 6, 7],
    a2: [2, 3, 4, 5, 6],
    a3: [3, 4, 5, 6, 7],
    a4: [4, 5, 6, 7, 8, 9, 10],
    a5: [5, 6, 7, 8, 9, 10],
  },
  clues: {
    a1: ['D', 'R', 'A', 'C', 'U', 'L', 'A'],
    a2: ['F', 'R', 'A', 'N', 'K'],
    a3: ['A', 'L', 'I', 'C', 'E'],
    a4: ['U', 'N', 'I', 'C', 'O', 'R', 'N'],
    a5: ['H', 'O', 'T', 'D', 'O', 'G'],
  },
  waitingMarkers: {

  },
  i18n: {},
  showPopup: (msg = "", title = "", extraContent = "") => {
    GAME_API.closePopup();
    $('#popup .popup-title').text(title);
    $('#popup .extra-content').html(extraContent);
    $('#popup .popup-content p').text(msg);
    $('#popup').addClass('active');
  },
  closePopup: () => {
    $('#popup').removeClass('active');
  },
  setLang: function() {
    const lang = $(this).data('lang');
    i18n.use(lang);

    $('.language-selector').removeClass('active');
    $(this).addClass('active');
    $('#resetGame').text(i18n.get('RESET_GAME_BUTTON'));
    $('#viewProgress').text(i18n.get('VIEW_PROGRESS_BUTTON'));
  },
  getConfig: () => {
    const savedData = window.localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ started: new Date().toISOString() }))
    }
    const data = savedData ? savedData : window.localStorage.getItem(STORAGE_KEY);
    return JSON.parse(data);
  },
  saveConfig: (newConfig) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  },
  resetGame: () => {
    const message = i18n.get("CONFIRM_MESSAGE");
    const confirmation = window.confirm(message);
    if (!confirmation) {
      return;
    }
    window.localStorage.clear(STORAGE_KEY);
    GAME_API.loadGame(GAME_API.i18n);
  },
  newGame: (config) => {
    config.currentLevelIndex = 0;
    const availablePaths = Object.keys(GAME_API.availablePaths);
    const totalPaths = availablePaths.length;
    const random = Math.floor(Math.random() * totalPaths) + 1;  
    config.activePath = availablePaths[random-1];
    config.foundClues = [];
    config.foundMarkers = [];
    GAME_API.saveConfig(config);
  },
  loadGame: (i18n) => {
    GAME_API.i18n = i18n;
    const config = GAME_API.getConfig();
    if (config.activePath && (config.currentLevelIndex || config.currentLevelIndex === 0)) {
    } else {
      GAME_API.newGame(config);
      GAME_API.loadGame();
      GAME_API.showHelp();
    }
  },
  showHelp: () => {
    const helpText = i18n.get('SHOW_HELP_TEXT');
    const helpTitle = i18n.get('SHOW_HELP_TITLE');
    GAME_API.showPopup(helpText, helpTitle);
  },
  generateProgressHtml: () => {
    const config = GAME_API.getConfig();
    const totalMarkers = document.getElementsByClassName('game-marker').length;
    const totalClues = GAME_API.clues[config.activePath].length;
    const foundMarkers = config.foundMarkers.length;
    const foundClues = config.foundClues.length;
    const foundCluesList = config.foundClues.length >= 1 ? "<li>" + config.foundClues.join('</li><li>') + "</li>" : "";
    const instructions = foundClues === totalClues ? i18n.get('FINAL_INSTRUCTIONS_TIP') : "";

    const html = `
    <h4 class="progress-title">${i18n.get('PROGRESS_MARKER_TITLE')}</h4>
    <p>
     ${i18n.get('PROGRESS_MARKER_TEXT', {foundMarkers, totalMarkers})}
    </p>
     <h4 class="progress-title">${i18n.get('PROGRESS_CLUES_TITLE')}</h4>
     <p>
     ${i18n.get('PROGRESS_CLUES_TEXT', { foundClues, totalClues })}
     </p>
     <ul class="foundCluesList">
      ${foundCluesList}
     </ul>
     ${instructions}
    `
    return html;
  },
  viewProgress: () => {
    const title = i18n.get('VIEW_PROGRESS_TITLE');
    const text = "";
    const extraContent = GAME_API.generateProgressHtml();
    GAME_API.showPopup(text, title, extraContent);
  },
  markerFound: function() {
    var marker = $(this).data('code');
    var markerId = marker;
    GAME_API.processMarker(markerId);
  },
  isValidMarker: (markerId, path = GAME_API.getConfig().activePath) => {
    return GAME_API.availablePaths[path] && GAME_API.availablePaths[path].includes(markerId);
  },
  getMarkerIndex: (markerId, activePath) => GAME_API.availablePaths[activePath].indexOf(markerId),
  captureMarker: (markerId) => {
    const config = GAME_API.getConfig();
    config.foundMarkers.push(markerId);
    const activePath = config.activePath;
    
    if (!GAME_API.isValidMarker(markerId, activePath)) {
      GAME_API.saveConfig(config);
      GAME_API.showPopup(i18n.get('INVALID_CLUE_TEXT'), i18n.get('INVALID_CLUE_TITLE'));
      return;
    }

    const markerIndex = GAME_API.getMarkerIndex(markerId, activePath);
    const clue = GAME_API.clues[activePath][markerIndex];
    config.foundClues.push(clue);
    GAME_API.saveConfig(config);
   
    const foundAllClues = config.foundClues.length === GAME_API.clues[activePath].length;

    if (foundAllClues) {
      GAME_API.showFoundAllClues(clue);
      return;
    } 

    const totalFound = config.foundClues.length;
    const totalToFind = GAME_API.clues[activePath].length;
    GAME_API.showClueProgress(totalFound, totalToFind, clue);
  },
  showClueProgress: (totalFound, totalToFind, clue) => {
    const text = i18n.get('SHOW_CLUE_PROGRESS_TEXT');
    const extraContent = `
      ${i18n.get('SHOW_CLUE_PROGRESS_TEXT_INFO', { totalFound, totalToFind })}
      <div class="showClue">
        <p>${i18n.get('LETTER')} <span class="clueBox">${clue}</span></p>
      </div>
    `;
    GAME_API.showPopup(text, i18n.get('SHOW_CLUE_PROGRESS_TITLE'), extraContent);
  },
  showFoundAllClues: clue => {
    const finalText = i18n.get('SHOW_FOUND_ALL_CLUES_TEXT');
    const finalExtraContent = `
      <h4>${i18n.get('SHOW_FOUND_ALL_CLUES_TEXT_TITLE')}</h4>
      <div class="showClue">
        <h2>${clue}</h2>
      </div>
      <p>${i18n.get('SHOW_FOUND_ALL_CLUES_TEXT_INFO')}</p>
    `;
    GAME_API.showPopup(finalText, i18n.get('SHOW_FOUND_ALL_CLUES_TITLE'), finalExtraContent);
  },
  processMarker: markerId => {
    const config = GAME_API.getConfig();
    if (!config.foundMarkers.includes(markerId)) {
      config.foundMarkers.push(markerId);
      GAME_API.waitingMarkers[markerId] = new Date().getTime();
      GAME_API.captureMarker(markerId);
    } else {
      if (GAME_API.isWaitingOver(markerId)) {
        const markerStatus = GAME_API.isValidMarker(markerId) ? i18n.get('VALID') : i18n.get('INVALID');
        const repeatedMarkerText = i18n.get('REPEATED_MARKER_TEXT', { markerStatus });
        GAME_API.showPopup(repeatedMarkerText, i18n.get('REPEATED_MARKER_TITLE'));
      }
    }
  },
  isWaitingOver: (markerId) => {
    if (!GAME_API.waitingMarkers[markerId]) {
      return true;
    }
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - GAME_API.waitingMarkers[markerId];
    if (elapsedTime/1000 > 10) {
      GAME_API.waitingMarkers[markerId] = new Date().getTime();
      return true;
    }
  }
}