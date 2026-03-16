document.body.innerHTML = 
`<div class="gamingTable">
  <div class="informationBoard">
    <p id="info-board" style="grid-area: box-1"></p>
    <button class="gamingAreaButton" id="start-btn" style="grid-area: box-2">start</button>
    <button class="gamingAreaButton" id="next-btn" style="grid-area: box-3">Next</button>
      <div id="score-board" style="grid-area: box-4">
        <ul id="score-list" style="list-style: none; padding: 0;">
          <li>Tricks Won: <p id="sg" style="margin: 0;">0</p></li>
          <li>Tricks Lost: <p id="sv" style="margin: 0;">0</p></li>
          <li>Tricks Tied: <p id="rg" style="margin: 0;">0</p></li>
          <li>Rounds Won: <p id="rv" style="margin: 0;">0</p></li>
          <li>Rounds Lost: <p id="su" style="margin: 0;">0</p></li>
          <li>Rounds Tied: <p id="ru" style="margin: 0;">0</p></li>
        </ul>
      </div>
        <div class="gamingArea" style="grid-area: box-5">
          <div class="gamingAreaSlots" style="grid-area: box-6">
          <div class="js-informationboard-slot">
          <img id="chosenCard">
          </div>
          <div class="js-informationboard-slot">
          <img id="randomCard">
          </div>
          </div>
          <div id="gameRunningArea" class="gamingAreaButtons" style="grid-area: box-7">
          <button class="gamingAreaButton js-gamingAreaButton" style="grid-area: box-8">rock</button>
          <button class="gamingAreaButton js-gamingAreaButton" style="grid-area: box-9">paper</button>
          <button class="gamingAreaButton js-gamingAreaButton" style="grid-area: box-10">scissors</button>
          <button class="gamingAreaButton js-gamingAreaButton" style="grid-area: box-11">lizard</button>
          <button class="gamingAreaButton gamingAreaButtonSpock js-gamingAreaButton" style="grid-area: box-12">spock</button>
          </div>
          <div id="gameCompleteArea" style="display: none;"></div>
        </div>
  </div> 
  <div class="gamingboard">
    <div class="js-gamingboard-computerhand-slots" id="computerHand">
    </div>
    <div class="js-gamingboard-computer-slots" id="computerBoard">
    </div>

    <div class="js-gamingboard-player-slots" id="playerBoard">
    </div>
    <div class="js-gamingboard-playerhand-slots" id="playerHand">  
    </div>
  <div>
  </div>
</div>`;

export let prelimUnlocked = false;

export function setPrelimUnlocked(value, source = "unknown") {
  prelimUnlocked = value;
  console.log(`setPrelimUnlocked -> ${prelimUnlocked} | source: ${source}`);
}


export function isPrelimUnlocked() {
  return prelimUnlocked;
}

export function getNextButton() {
  return document.getElementById("next-btn");
}

let externalNewGameReset = null;

const startButton = document.getElementById('start-btn');

const nextButton = document.getElementById('next-btn');

const infoBoard = document.getElementById('info-board');

const scoreList = document.getElementById('score-list');

const gameButtons = document.querySelectorAll('.js-gamingAreaButton')

export function getGameButtons() {
  return document.querySelectorAll('.js-gamingAreaButton');
}

const areaGameButtons = document.getElementById('gameRunningArea');

const areaGameComplete = document.getElementById('gameCompleteArea');


document.getElementById('gameRunningArea').style.display = 'none';

export function getInfoBoard() {
  return document.getElementById('info-board');
}

export function getChoiceImages() {
  return {
    left: document.getElementById("chosenCard"),
    right: document.getElementById("randomCard"),
  };
}


let gameRunningArea = false;

let score1 = document.getElementById('sg');
let score2 = document.getElementById('sv');
let score3 = document.getElementById('rg');
let score4 = document.getElementById('rv');
let score5 = document.getElementById('su');
let score6 = document.getElementById('ru');

export let scores = [
  score1,
  score2,
  score3,
  score4,
  score5,
  score6
]


let isGameRunning = false;
let startButtonTimer = null;

function createAllSlots(targetSelector, count) {
    
    const allContainers = document.querySelectorAll(targetSelector);

    allContainers.forEach(slotContainer => {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < count; i++) {
            const slot = document.createElement('div');
            
            // 2. JS-Klasse zur Identifikation
            slot.classList.add('js-card-slot'); 
            
            //slot.dataset.slotIndex = i; 

            fragment.appendChild(slot);
        }
        
        slotContainer.appendChild(fragment);
    });
}


createAllSlots('.js-gamingboard-computer-slots', 11);
createAllSlots('.js-gamingboard-player-slots', 11);
createAllSlots('.js-gamingboard-computerhand-slots', 11);
createAllSlots('.js-gamingboard-playerhand-slots', 11);


function firstInstruction() {
  infoBoard.textContent = 'Press "Start" to begin the game. First, an initiative duel decides who starts the round.';
};

firstInstruction();

export function secondInstruction() {
  clearBoard();

  infoBoard.textContent = 'Choose Rock, Paper, Scissors, Lizard or Spock.';

  scores.forEach(score => {
    score.textContent = "0";
  });

  startButton.textContent = "New Game";

  document.getElementById('gameRunningArea').style.display = 'block';
  document.getElementById('gameCompleteArea').style.display = 'none';
}


startButton.addEventListener('click', handleStartButton);

function handleStartButtonStyle() {
  startButton.classList.toggle("dark");
}


function handleStartButton() {

  if (!isGameRunning) {

    // Spiel starten
    setPrelimUnlocked(true, "start button -> prelim begins");
    secondInstruction();
    startButton.textContent = "New Game";
    isGameRunning = true;

  } else {

    const confirmed = confirm("Restart the current game?");
    if (!confirmed) {
      return;
    }

    if (externalNewGameReset) {
      setPrelimUnlocked(false, "new game confirmed -> reset");
      externalNewGameReset();
    }

    firstInstruction();
    startButton.textContent = "Start";
    isGameRunning = false;
    setPrelimUnlocked(false, "return to start screen");
    document.getElementById('gameRunningArea').style.display = 'none';
  }

  handleStartButtonStyle();
}


export function clearBoard() {
  // Suche alle Karten-Buttons auf dem gesamten Spielfeld
  const cards = document.querySelectorAll('.gameCardButtons');
  
  // Entferne jeden gefundenen Button aus dem DOM
  cards.forEach(card => {
    card.remove();
  });
  
}


export function clearUI() {
  document.querySelectorAll('.js-gamingboard-computer-slots div').forEach(slot => slot.innerHTML = '');
  document.querySelectorAll('.js-gamingboard-player-slots div').forEach(slot => slot.innerHTML = '');
  document.querySelectorAll('.js-gamingboard-computerhand-slots div').forEach(slot => slot.innerHTML = '');
  document.querySelectorAll('.js-gamingboard-playerhand-slots div').forEach(slot => slot.innerHTML = '');
}


export function registerNewGameReset(fn) {
  externalNewGameReset = fn;
}
