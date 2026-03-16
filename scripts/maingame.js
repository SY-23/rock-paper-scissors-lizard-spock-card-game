import { resetPrelimForNextRound } from "./prelimgame.js";
import { buttons } from "./prelimgame.js";
import { IMAGES } from './prelimgame.js';
import { getNextButton } from "./ui.js";
import { scores } from "./ui.js";
import { clearUI } from "./ui.js";
//import { startingPlayer } from './prelimgame.js';
import { getStartingPlayer } from "./prelimgame.js";
import { resetPrelimCompletely } from "./prelimgame.js";
import { registerNewGameReset } from "./ui.js";
import { setPrelimUnlocked } from "./ui.js";
  
let matchOver = false;
let roundTricksPlayer = 0;
let roundTricksComputer = 0;
let roundTricksDraw = 0;

let roundsWonPlayer = 0;     // fürs spätere First-to-3
let roundsWonComputer = 0;
let initiativeWinner = null; // "player" | "computer"
let trickIndex = 0;          // 0..10

function other(p) {
  return p === "player" ? "computer" : "player";
}

let slotsGamingboardComputerhand = document.querySelectorAll('.js-gamingboard-computerhand-slots div');
let slotsGamingboardPlayerhand = document.querySelectorAll('.js-gamingboard-playerhand-slots div');
let slotsGamingboardComputer = document.querySelectorAll('.js-gamingboard-computer-slots div');
let slotsGamingboardPlayer = document.querySelectorAll('.js-gamingboard-player-slots div');

const nextButton = getNextButton();

let infoTimeout;

const infoBoard = document.getElementById('info-board');

nextButton.addEventListener('click', handleNextButton);


function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [array[i], array[random]] = [array[random], array[i]];
  }
}


function takeCardsFromBoard() {
  buttons.forEach(btn => {
    const img = btn.querySelector('img');
    if (img) img.src = "";
    
    btn.dataset.face = "back";
  });
}


function moveCardsToSlots() {
  const slotsComputer = document.querySelectorAll('#computerHand .js-card-slot');
  const slotsPlayer   = document.querySelectorAll('#playerHand .js-card-slot');

  buttons.forEach((button, i) => {
    const img = button.querySelector("img");

    // Typ holen (erst vom Button, sonst vom img)
    const type = button.dataset.type || img?.dataset.type;

    if (i < 11) {
      if (slotsPlayer[i]) {
        slotsPlayer[i].appendChild(button);

        // Player: Front zeigen
        if (type && IMAGES[type]) {
          img.src = IMAGES[type];
        } else {
          console.warn("Kein gültiger Typ/Mapping für Player:", { type, button });
          img.src = "";
          
        }
      }
    } else {
      if (slotsComputer[i - 11]) {
        slotsComputer[i - 11].appendChild(button);

        // Computer: verdeckt
        img.src = IMAGES.hidden;
      }
    }
  });
}


const GamePhase = Object.freeze({
  WAITING_FOR_DEAL: "WAITING_FOR_DEAL",
  FIRST_MOVE_PLAYER: "FIRST_MOVE_PLAYER",
  FIRST_MOVE_COMPUTER: "FIRST_MOVE_COMPUTER",
  IN_ROUND: "IN_ROUND",
});


let gamePhase = GamePhase.WAITING_FOR_DEAL;


function setInfo(key, params = {}) {
  const messages = {
    DEAL_PLAYER_FIRST: 'You begin! Press "Next" to deal out the cards.',
    DEAL_COMPUTER_FIRST: 'You play second! Press "Next" to deal out the cards.',
    PLAY_FIRST_CARD: "Play a card from your hand.",
    COMPUTER_PLAYED_FIRST: (t) => `Computer played ${t}. Choose your card.`,
    COMPUTER_WIN: "You lose!", 
    PLAYER_WIN: "You win!",
    NOBODY_WIN: "It's a tie!",
    PLAYER_WIN_ROUND: "Round over. You win the round.",
    COMPUTER_WIN_ROUND: "Round over. Computer wins the round.",
    NOBODY_WIN_ROUND: "Round over. It's a draw.",
    MATCH_PLAYER_WIN: "Match over! You win the game. Press 'New Game' to play again.",
    MATCH_COMPUTER_WIN: "Match over! Computer wins the game. Press 'New Game' to play again.",
  };

  const msg = messages[key];
  infoBoard.textContent = typeof msg === "function" ? msg(params.type) : msg;
}

let readyToBeginnGame = false;


function handleNextButton() {
  if (matchOver) {
    infoBoard.textContent = 'The match is over. Press "Start" to begin a new game.';
    return;
  }

  const cards = document.querySelectorAll('.gameCardButtons');

  if (cards.length !== 22) {
    clearTimeout(infoTimeout);

    const previousText = infoBoard.textContent;
    infoBoard.textContent = 'Choose a prelim card first.';

    infoTimeout = setTimeout(() => {
      infoBoard.textContent = previousText;
    }, 3000);

    return;
  }

  // Erst hier ist der Übergang ins Hauptspiel wirklich legitim
  setPrelimUnlocked(false, "main game started");

  takeCardsFromBoard();
  shuffleCards(buttons);
  moveCardsToSlots();

  readyToBeginnGame = true;
  roundTricksPlayer = 0;
  roundTricksComputer = 0;
  roundTricksDraw = 0;

  resetTrickScoresUI();
  trickIndex = 0;

  initiativeWinner = getStartingPlayer();
  makeFirstMove();
}


function resetTrickScoresUI() {
  // Index 0: Stiche gewonnen (sg)
  // Index 1: Stiche verloren (sv)
  // Index 2: Stiche unentschieden (rg)
  scores[0].textContent = "0";
  scores[1].textContent = "0";
  scores[2].textContent = "0";
}


function makeFirstMove() {
  if (!readyToBeginnGame) return;

  if (!initiativeWinner) initiativeWinner = getStartingPlayer();
  
  const startingPlayer =
    (trickIndex % 2 === 0) ? initiativeWinner : other(initiativeWinner);

  if (startingPlayer === "player") {
    gamePhase = GamePhase.FIRST_MOVE_PLAYER;
    disableNextButtonListener();
    //console.log("TURN -> player", { trickIndex, reason: "next player input allowed" });
    turn = "player";                 //sauber setzen
    setInfo("PLAY_FIRST_CARD");
    return;
  }

  if (startingPlayer === "computer") {
    gamePhase = GamePhase.FIRST_MOVE_COMPUTER;
    disableNextButtonListener();
    //console.log("TURN -> busy", { trickIndex, reason: "player card accepted" });

    turn = "busy";                   //während Computer legt blocken
    const playedType = playCardComputer();
    if (!playedType) return;

    const prettyType = playedType.charAt(0).toUpperCase() + playedType.slice(1);
    setInfo("COMPUTER_PLAYED_FIRST", { type: prettyType });

    gamePhase = GamePhase.IN_ROUND;
    //console.log("TURN -> player", { trickIndex, reason: "next player input allowed" });
    turn = "player";                 //jetzt darf Player antworten
    return;
  }
  
}



  let computerSlotIndex = 0;//wird momentan nicht genutzt

function playCardComputer() {
    const computerCards = Array.from(
      document.querySelectorAll('#computerHand .gameCardButtons')
    );

    if (computerCards.length === 0) return null;

    const slot = Array.from(slotsGamingboardComputer)
      .find(s => s.children.length === 0);
    if (!slot) return null;

    const chosen = computerCards[Math.floor(Math.random() * computerCards.length)];
    const img = chosen.querySelector("img");
    const type = chosen.dataset.type || img?.dataset.type;

    slot.appendChild(chosen);

    if (img) {
    if (type && IMAGES[type]) {
      img.src = IMAGES[type];
    } else {
      img.src = "";
    }
    }
    if (type) {
      historyComputer.push(type);
      
    }
          /*console.log("COMPUTER PLAYED CARD", {
          type,
          trickIndex,
          turn
        });*/
    return type; 
}

  let computerMoves = [];//wird momentan nicht genutzt
    
  let turn = "player";

  const playerHand = document.querySelector("#playerHand");

  playerHand.addEventListener("click", (event) => {
    const chosen = event.target.closest("button");  // nimmt den Button, auch wenn man auf <span> im Button klickt
    if (!chosen) return;                            // Klick war irgendwo im Container, aber nicht auf einer Karte

    playCardPlayer(chosen);
    });

    let historyPlayer = []; 
    let historyComputer = []; // Auch für den Computer ein Gedächtnis anlegen

function playCardPlayer(chosen) {
    /*console.log("CLICK player card", {
      turn,
      readyToBeginnGame,
      trickIndex
    });*/
    if (turn !== "player") {
    //console.log("CLICK REJECTED", { turn, trickIndex });
      return;
    }

    //console.log("CLICK ACCEPTED", { trickIndex });
    if (!readyToBeginnGame || turn !== "player") return;

    const slot = Array.from(slotsGamingboardPlayer).find(s => s.children.length === 0);
    if (!slot) return;

    // 1. Sofort ins Gedächtnis schreiben (bevor sich im DOM etwas verschiebt)
    const img = chosen.querySelector("img");
    const type = chosen.dataset.type || img?.dataset.type;

    if (type) {
        historyPlayer.push(type);
        
    }

    // 2. Karte auf das Board legen
    //console.log("TURN -> busy", { trickIndex, reason: "player card accepted" });

    turn = "busy";
    /*console.log("CLICK player card", {
      turn,
      readyToBeginnGame,
      trickIndex
    });*/
    //console.log("Player card accepted -> turn busy");
    slot.appendChild(chosen);

    chosen.disabled = true;
    // So ist sichergestellt, dass beide Karten (Player & Computer) erfasst werden
    getPlayerCardData();
    getComputerCardData();
    
    //console.log("before checkGameState", { turn, trickIndex });
  checkGameState();

}

  const rules = {
    rock: ["lizard", "scissors"],
    paper: ["spock", "rock"],
    scissors: ["lizard", "paper"],
    lizard: ["spock", "paper"],
    spock: ["rock", "scissors"]
  };

function compareCardTypes(player, computer) {

  if (!rules[player]) {
    console.error(`Fehler: Der Typ "${player}" existiert nicht in den Rules!`);
    return "error"; 
  }

  if (player === computer) {
    return "draw";
  }

  if (rules[player].includes(computer)) {
    return "player";
  }

  return "computer";
}


  function compareMovesAndAnnounceWinner() {

        getPlayerCardData();
        getComputerCardData();

        if (cardTypeComputer.length > 0 && cardTypePlayer.length > 0) {
          //console.log("TURN -> busy", { trickIndex, reason: "player card accepted" });

          turn = "busy"; //Pause/Übergang blocken

          const playerLast = cardTypePlayer.at(-1);
          const computerLast = cardTypeComputer.at(-1);
          const result = compareCardTypes(playerLast, computerLast);

        // Hier direkt die Info an das Board senden:
        if (result === "draw") {
          setInfo("NOBODY_WIN"); // "It's a tie!"
          setTimeout(() => {
            /*console.log("compare result", {
                playerLast,
                computerLast,
                result,
                trickIndex
              });*/
          prepareNextRound(1);
        }, 1500);
        } 
        if (result === "player") {
          setInfo("PLAYER_WIN"); // "You win!"
          setTimeout(() => {
            /*console.log("compare result", {
            playerLast,
            computerLast,
            result,
            trickIndex
          });*/
          prepareNextRound(2);
          
        }, 1500);
        } 
        if (result === "computer") {
          setInfo("COMPUTER_WIN"); // "You lose!"
          setTimeout(() => {
          prepareNextRound(3);
        /*console.log("compare result", {
          playerLast,
          computerLast,
          result,
          trickIndex
        });*/
      }, 1500);
      }    
    }
  }


function addPoint(index) {
  let currentScore = parseInt(scores[index].textContent) || 0;
  scores[index].textContent = currentScore + 1;
}


function endRound() {
  turn = "busy";

  let roundResult = "draw";
  if (roundTricksPlayer > roundTricksComputer) roundResult = "player";
  else if (roundTricksComputer > roundTricksPlayer) roundResult = "computer";

  if (roundResult === "player") {
    roundsWonPlayer++;
    addPoint(3);
    setInfo("PLAYER_WIN_ROUND");
  } else if (roundResult === "computer") {
    roundsWonComputer++;
    addPoint(4);
    setInfo("COMPUTER_WIN_ROUND");
  } else {
    addPoint(5);
    setInfo("NOBODY_WIN_ROUND");
  }

  if (roundsWonPlayer >= 3) {
    matchOver = true;
    setPrelimUnlocked(false, "match over");
    setInfo("MATCH_PLAYER_WIN");
    return;
  }
  if (roundsWonComputer >= 3) {
    setPrelimUnlocked(false, "match over");
    matchOver = true;
    setInfo("MATCH_COMPUTER_WIN");
    return;
  }

  setTimeout(() => {
    clearUI();
    gamePhase = GamePhase.WAITING_FOR_DEAL;
    readyToBeginnGame = false;

    enableNextButtonListener();
    resetPrelimForNextRound();
    turn = "player";
  }, 3000);
  
}


function prepareNextRound(x) {
  /*console.log("prepareNextRound BEFORE", {
  x,
  trickIndex,
  roundTricksPlayer,
  roundTricksComputer,
  roundTricksDraw
});*/
  if (x === 1) addPoint(2);
  else if (x === 2) addPoint(0);
  else if (x === 3) addPoint(1);
  if (x === 1) roundTricksDraw++;
  else if (x === 2) roundTricksPlayer++;
  else if (x === 3) roundTricksComputer++;


  trickIndex++;
  /*console.log("prepareNextRound AFTER", {
    trickIndex
  });*/

  // Nach 11 Stichen ist Runde vorbei (0..10 = 11)
  if (trickIndex >= 11) {
    endRound();   
    return;
  }
  
  makeFirstMove();
}

  let cardTypeComputer = [];
  let cardTypePlayer = [];


function getPlayerCardData() {
    cardTypePlayer = []; 
    slotsGamingboardPlayer.forEach(slot => {
        const btn = slot.querySelector("button");
        if (btn) {
            
            const type = btn.dataset.type || btn.querySelector("img")?.dataset.type;
            if (type) {
                cardTypePlayer.push(type);
            }
        }
    });
    return cardTypePlayer;
}


function getComputerCardData() {
  cardTypeComputer = [];
  slotsGamingboardComputer.forEach(slot => {
    const btn = slot.querySelector("button");
    if (btn) {
      const type = btn.dataset.type || btn.querySelector("img")?.dataset.type; 
      if (type) cardTypeComputer.push(type);
    }
  });
  return cardTypeComputer;
}


function countComputerButtons() {
    let count = 0;

    slotsGamingboardComputer.forEach(slot => {
      if (slot.querySelector("button")) {
        count++;
      }
    });

    return count;
    
}


function countPlayerButtons() {
    let count = 0;

    slotsGamingboardPlayer.forEach(slot => {
      if (slot.querySelector("button")) {
        count++;
      }
    });

    return count;
    
}


function checkGameState() {
  /*console.log("checkGameState", {
    player: countPlayerButtons(),
    computer: countComputerButtons(),
    turn,
    trickIndex
  });*/
  const player = countPlayerButtons();
  const computer = countComputerButtons();

  if (player > computer) {
    playCardComputer();
    setTimeout(checkGameState, 0);
  }
  else if (computer > player) {
    // Computer hat vorgelegt, warten bis Player antwortet
    return;
  }
  else if (player === computer && player > 0) {
    compareMovesAndAnnounceWinner();
  }
}

export function resetGlobalGameState() {
  roundTricksPlayer = 0;
  roundTricksComputer = 0;
  roundTricksDraw = 0;
  roundsWonPlayer = 0;
  roundsWonComputer = 0;
  initiativeWinner = null;
  trickIndex = 0;
  readyToBeginnGame = false;
  gamePhase = GamePhase.WAITING_FOR_DEAL;
  enableNextButtonListener();
  //console.log("TURN -> player", { trickIndex, reason: "next player input allowed" });
  turn = "player";
  matchOver = false;
  

  historyPlayer = [];
  historyComputer = [];
  cardTypePlayer = [];
  cardTypeComputer = [];

  clearTimeout(infoTimeout);
}


export function fullResetGame() {
setPrelimUnlocked(false, "full reset");


  resetGlobalGameState();
  resetPrelimForNextRound();
  clearBoardStateOnly();
  resetScoreboardDisplay();
  infoBoard.textContent = 'Press "Start" to begin the game.';
}
      
  function clearBoardStateOnly() {
  document.querySelectorAll(".gameCardButtons").forEach(btn => btn.remove());
}


function resetScoreboardDisplay() {
  scores.forEach(score => {
    score.textContent = "0";
  });
} 

registerNewGameReset(fullResetGame);


function disableNextButtonListener() {
  if (nextButton) {

    nextButton.removeEventListener('click', handleNextButton);
    //nextButton.style.opacity = "0.5"; // Optionale visuelle Rückmeldung
  }
}


function enableNextButtonListener() {
  if (nextButton) {

    nextButton.addEventListener('click', handleNextButton);
    //nextButton.style.opacity = "1";
  }
}

