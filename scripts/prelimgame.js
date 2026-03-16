import { getGameButtons } from "./ui.js";
import { getInfoBoard, getChoiceImages } from "./ui.js";
import { setPrelimUnlocked } from "./ui.js";
import { isPrelimUnlocked } from "./ui.js";

getGameButtons().forEach(button => {
  button.addEventListener("click", handleChoice);
});

let startingPlayer = null;
export function setStartingPlayer(v) { startingPlayer = v; }
export function getStartingPlayer() { return startingPlayer; }

export let buttons = []; 
let isProcessingChoice = false;

export const IMAGES = {
            rock: 'images/rock.png',
            paper: 'images/paper.png',
            scissors: 'images/scissors.png',
            lizard: 'images/lizard.png',
            spock: 'images/spock.png',
            hidden: 'images/card-back.png'
          };

function handleChoice(event) {

      console.log("handleChoice fired | prelimUnlocked =", isPrelimUnlocked());

  if (!isPrelimUnlocked()) {
    console.log("Guard blocked prelim click.");
    return;
  }

  console.log("Guard allowed prelim click.");

  const choice = (event?.target?.textContent ?? "").trim();
  const infoBoard = getInfoBoard();
  const { left: imgLeft, right: imgRight } = getChoiceImages();

  if (!choice) return;
  if (!infoBoard) {
    console.error("infoBoard fehlt (#info-board).");
    return;
  }
  if (!imgLeft || !imgRight) {
    console.error("chosenCard/randomCard fehlen (#chosenCard / #randomCard).");
    return;
  }
  if (isProcessingChoice) return;
  isProcessingChoice = true;
  const randomNum = Math.floor(Math.random() * 5);

  if (choice === "rock") {
    imgLeft.src = IMAGES[choice] || "";

      if (randomNum === 2) {
        infoBoard.textContent = 'You chose Rock. Computer chose Scissors. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 3) {
        infoBoard.textContent = 'You chose Rock. Computer chose Lizard. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 1) {
        infoBoard.textContent = 'You chose Rock. Computer chose Paper. You lose.';
         setTimeout(pressNext, 3000);
        setStartingPlayer("computer");
      }
      if (randomNum === 4) {
        infoBoard.textContent = 'You chose Rock. Computer chose Spock. You lose.';
         setTimeout(pressNext, 3000);
        setStartingPlayer("computer");
      }
      if (randomNum === 0) {
        infoBoard.textContent = 'You chose Rock. Computer chose Rock. It is a tie.';
        
         setTimeout(startAgain, 3000);
      }   

  }

  if (choice === "paper") {
    imgLeft.src = IMAGES[choice] || "";

    if (randomNum === 2) {
        infoBoard.textContent = 'You chose Paper. Computer chose Scissors. You lose.';
         setTimeout(pressNext, 3000);
        setStartingPlayer("computer");
      }
      if (randomNum === 3) {
        infoBoard.textContent = 'You chose Paper. Computer chose Lizard. You lose.';
         setTimeout(pressNext, 3000);
        setStartingPlayer("computer");
      }
      if (randomNum === 1) {
        infoBoard.textContent = 'You chose Paper. Computer chose Paper. It is a tie.';
        
         setTimeout(startAgain, 3000);
      }
      if (randomNum === 4) {
        infoBoard.textContent = 'You chose Paper. Computer chose Spock. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 0) {
        infoBoard.textContent = 'You chose Paper. Computer chose Rock. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
  }

  if (choice === "scissors") {
    imgLeft.src = IMAGES[choice] || "";

      if (randomNum === 2) {
        infoBoard.textContent = 'You chose Scissors. Computer chose Scissors. It is a tie.';
        
         setTimeout(startAgain, 3000);
      }
      if (randomNum === 3) {
        infoBoard.textContent = 'You chose Scissors. Computer chose Lizard. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 1) {
        infoBoard.textContent = 'You chose Scissors. Computer chose Paper. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 4) {
        infoBoard.textContent = 'You chose Scissors. Computer chose Spock. You lose.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("computer");
      }
      if (randomNum === 0) {
        infoBoard.textContent = 'You chose Scissors. Computer chose Rock. You lose.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("computer");
      }   
  }

  if (choice === "lizard") {
    imgLeft.src = IMAGES[choice] || "";

      if (randomNum === 2) {
        infoBoard.textContent = 'You chose Lizard. Computer chose Scissors. You lose.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("computer");
      }
      if (randomNum === 3) {
        infoBoard.textContent = 'You chose Lizard. Computer chose Lizard. It is a tie.';
  
        setTimeout(startAgain, 3000);
      }
      if (randomNum === 1) {
        infoBoard.textContent = 'You chose Lizard. Computer chose Paper. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 4) {
        infoBoard.textContent = 'You chose Lizard. Computer chose Spock. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 0) {
        infoBoard.textContent = 'You chose Lizard. Computer chose Rock. You lose.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("computer");
      }   
  }

  if (choice === "spock") {
    imgLeft.src = IMAGES[choice] || "";

      if (randomNum === 2) {
        infoBoard.textContent = 'You chose Spock. Computer chose Scissors. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }
      if (randomNum === 3) {
        infoBoard.textContent = 'You chose Spock. Computer chose Lizard. You lose.';
         setTimeout(pressNext, 3000);
        setStartingPlayer("computer");
      }
      if (randomNum === 1) {
        infoBoard.textContent = 'You chose Spock. Computer chose Paper. You lose.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("computer");
      }
      if (randomNum === 4) {
        infoBoard.textContent = 'You chose Spock. Computer chose Spock. It is a tie.';
        
         setTimeout(startAgain, 3000);
      }
      if (randomNum === 0) {
        infoBoard.textContent = 'You chose Spock. Computer chose Rock. You win.';
         setTimeout(pressNext, 3000);
         setStartingPlayer("player");
      }   
  }

  function  startAgain () {
      if (randomNum === 0) 
        if (choice === "rock") {
          infoBoard.textContent = 'Choose again: Rock, Paper, Scissors, Lizard or Spock.';
        }

      if (randomNum === 1)
        if (choice === "paper") {
          infoBoard.textContent = 'Choose again: Rock, Paper, Scissors, Lizard or Spock.';
        }
      
      if (randomNum === 2)
        if (choice === "scissors") {
          infoBoard.textContent = 'Choose again: Rock, Paper, Scissors, Lizard or Spock.';
        }

      if (randomNum === 3)
        if (choice === "lizard") {
          infoBoard.textContent = 'Choose again: Rock, Paper, Scissors, Lizard or Spock.';
        }

      if (randomNum === 4)
        if (choice === "spock") {
          infoBoard.textContent = 'Choose again: Rock, Paper, Scissors, Lizard or Spock.';
        }
        isProcessingChoice = false;
      }

      
      assignCards();
    function assignCards () {
    if (randomNum === 0) {
      imgRight.src = "images/rock.png";
    }

    if (randomNum === 1) {
      imgRight.src = "images/paper.png";
    }

    if (randomNum === 2) {
      imgRight.src = "images/scissors.png";
    }

    if (randomNum === 3) {
      imgRight.src = "images/lizard.png";
    }

    if (randomNum === 4) {
      imgRight.src = "images/spock.png";
    }
    }

    const computerChoices = ["rock", "paper", "scissors", "lizard", "spock"];
    const computerChoice = computerChoices[randomNum];
    
    function pressNext() {
  
      let gameCompleted = false; 
      

      if (choice === "rock" && (randomNum === 2 || randomNum === 3)) {
        infoBoard.textContent = 'You start the round. Press "Next" to deal the cards.';
        gameCompleted = true; 
      } 
      else if (choice === "paper" && (randomNum === 0 || randomNum === 4)) {
        infoBoard.textContent = 'You start the round. Press "Next" to deal the cards.';
        gameCompleted = true;
      }
      
      else if (choice === "scissors" && (randomNum === 1 || randomNum === 3)) {
        infoBoard.textContent = 'You start the round. Press "Next" to deal the cards.';
        gameCompleted = true;
      }
      else if (choice === "lizard" && (randomNum === 1 || randomNum === 4)) {
        infoBoard.textContent = 'You start the round. Press "Next" to deal the cards.';
        gameCompleted = true;
      }
      else if (choice === "spock" && (randomNum === 0 || randomNum === 2)) {
        infoBoard.textContent = 'You start the round. Press "Next" to deal the cards.';
        gameCompleted = true;
      }
      else {
        infoBoard.textContent = 'Computer starts the round. Press "Next" to deal the cards.';
        gameCompleted = true;
      }
        
        if (gameCompleted === true) {
          setPrelimUnlocked(false, "prelim resolved");

          document.getElementById('gameRunningArea').style.display = 'none';
          document.getElementById('gameCompleteArea').style.display = 'block';
            } 

        
  
        let assignedGameCards = [];
       
        
        if (gameCompleted === true) {
        
        function drawCardsFromDeck() {
          //for (let i = 0; i < 22; i++) {}
          return Array.from({ length: 22 }, () => Math.floor(Math.random() * 5));
        }
            const cardNumbers = drawCardsFromDeck();
            const gameCards = cardNumbers.map(assignGameCards);
          

            function assignGameCards (element) {
   
              if (element === 0) {
                return 'rock';
                
                } else if (element === 1) {
                return 'paper';
                
                } else if (element === 2) {
                return 'scissors';
                
                } else if (element === 3) {
                return 'lizard';
                
                } else if (element === 4) {
                return 'spock';
                
                }
              }
             
              assignedGameCards = gameCards;
             
           }    
           
        let slotsGamingboardComputer = document.querySelectorAll('.js-gamingboard-computer-slots div');
        let slotsGamingboardPlayer = document.querySelectorAll('.js-gamingboard-player-slots div');

        const TYPES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

          function drawTypes(count = 22) {
            return Array.from({ length: count }, () => TYPES[Math.floor(Math.random() * TYPES.length)]);
          }

          

          function createGameImage(type) {
            const img = document.createElement('img');
            img.src = IMAGES[type] || "";
            img.dataset.type = type;
            return img;
          }


          function createCardInSlot() {
          const SlotsGamingboard = [...slotsGamingboardComputer, ...slotsGamingboardPlayer];

          assignedGameCards = drawTypes(SlotsGamingboard.length);

          SlotsGamingboard.forEach((slot, i) => {
          const type = assignedGameCards[i];

          const button = document.createElement('button');
          button.appendChild(createGameImage(type));

          // optional: Button/Slot-Index merken (super praktisch später)
          button.dataset.index = i;

          slot.appendChild(button);
          buttons.push(button);

          button.classList.add("gameCardButtons");
          

          });
        }

      createCardInSlot();
          
  }
        
}   
      

export function resetPrelimForNextRound() {
  // 1) Starting player zurücksetzen
  setStartingPlayer(null);

  // 2) Alle alten Kartenbuttons aus dem DOM entfernen (Hand + Board + Preview)
  document.querySelectorAll(".gameCardButtons").forEach(btn => btn.remove());

  // 3) shared Array leeren (WICHTIG: nicht neu zuweisen, nur leeren!)
  buttons.length = 0;
  isProcessingChoice = false;
  // 4) UI wieder auf Initiativephase
  const running = document.getElementById("gameRunningArea");
  const complete = document.getElementById("gameCompleteArea");
  if (running) running.style.display = "block";
  if (complete) complete.style.display = "none";

  const infoBoard = getInfoBoard();
  if (infoBoard) infoBoard.textContent = "Choose: Rock, Paper, Scissors, Lizard or Spock.";
  setPrelimUnlocked(true, "next round prelim begins");
}

export function resetPrelimCompletely() {
  setStartingPlayer(null);
  document.querySelectorAll(".gameCardButtons").forEach(btn => btn.remove());
  buttons.length = 0;

  const { left, right } = getChoiceImages();
  if (left) left.src = "";
  if (right) right.src = "";

  const running = document.getElementById("gameRunningArea");
  const complete = document.getElementById("gameCompleteArea");
  if (running) running.style.display = "none";
  if (complete) complete.style.display = "none";
}
      
      