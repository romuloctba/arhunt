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
    const confirmation = window.confirm("Tem certeza que deseja recomeçar? (Todo progresso será perdido!)");
    if (!confirmation) {
      return;
    }
    window.localStorage.clear(STORAGE_KEY);
    GAME_API.loadGame();
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
  loadGame: () => {
    const config = GAME_API.getConfig();
    if (config.activePath && (config.currentLevelIndex || config.currentLevelIndex === 0)) {
    } else {
      GAME_API.newGame(config);
      GAME_API.loadGame();
      GAME_API.showHelp();
    }
  },
  showHelp: () => {
    const introText = { text: "Seja bem vindo(a)! \n Vamos começar a caçada. \n Use a câmera do Celular para capturar PISTAS, apontando-a para MARCADORES, espalhadas pelo ODC. \n\n - Cada pista trará uma peça do enigma \n "};
    introText.text = introText.text + " \n - Nem todos os marcadores contém pistas para a sua missão. (Leia a mensagem ao capturar um marcador)";
    introText.text = introText.text + " \n - Quando TODAS pistas forem coletadas, você recebrá um aviso.";
    introText.text = introText.text + " \n - Clique em 'Ver Progresso' para conferir as pistas que já capturou, e quantas faltam.";
    introText.text = introText.text + " \n - Ao coletar todas as pistas da sua missão, decifre a ordem correta e vá à um ponto de retirada de prêmios.";
    GAME_API.showPopup(introText.text, "Instruções");
  },
  generateProgressHtml: () => {
    const config = GAME_API.getConfig();
    const totalMarkers = document.getElementsByClassName('game-marker').length;
    const totalClues = GAME_API.clues[config.activePath].length;
    const foundMarkers = config.foundMarkers.length;
    const foundClues = config.foundClues.length;
    const foundCluesList = config.foundClues.length >= 1 ? "<li>" + config.foundClues.join('</li><li>') + "</li>" : "";
    const instructions = foundClues === totalClues ? "Descobriu a palavra? <br> Descubra, e vá a um ponto de retirada de prêmio!" : "";

    const html = `
    <h4 class="progress-title">Marcadores verificados</h4>
    <p>
     Lidos <strong>${foundMarkers} / ${totalMarkers}</strong> marcadores disponíveis.
    </p>
     <h4 class="progress-title">Pistas encontradas</h4>
     <p>
     Encontradas <strong>${foundClues} / ${totalClues}</strong> pistas. <br>
     </p>
     <ul class="foundCluesList">
      ${foundCluesList}
     </ul>
     ${instructions}
    `
    return html;
  },
  viewProgress: () => {
    const title = "Progresso da caçada:";
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
      GAME_API.showPopup('Essa pista é inválida para a sua missão. \n Por favor, procure outra pista!', 'Ops..');
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
    const text = "Parabéns, você encontrou uma pista! \n \n Você pode conferir o Progresso Total no botão 'Ver Progresso'.";
    const extraContent = `
      <p>Pista ${totalFound} de ${totalToFind} encontrada:</p>
      <div class="showClue">
        <p>Letra: <span class="clueBox">${clue}</span></p>
      </div>
    `;
    GAME_API.showPopup(text, "Pista encontrada!", extraContent);
  },
  showFoundAllClues: clue => {
    const finalText = "Parabéns, você coletou todas as pistas!";
    const finalExtraContent = `
      <h4>A última pista é:</h4>
      <div class="showClue">
        <h2>${clue}</h2>
      </div>
      <p>Entre em 'Ver Progresso' para ver todas as dicas registradas!</p>
    `;
    GAME_API.showPopup(finalText, "Dicas Completas!", finalExtraContent);
  },
  processMarker: markerId => {
    const config = GAME_API.getConfig();
    if (!config.foundMarkers.includes(markerId)) {
      config.foundMarkers.push(markerId);
      GAME_API.waitingMarkers[markerId] = new Date().getTime();
      GAME_API.captureMarker(markerId);
    } else {
      if (GAME_API.isWaitingOver(markerId)) {
        const markerStatus = GAME_API.isValidMarker(markerId) ? 'Válida' : 'Inválida';
        GAME_API.showPopup("Você já leu este marcador... \n\n (Era uma pista "+ markerStatus +")", "Marcador Repetido");
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