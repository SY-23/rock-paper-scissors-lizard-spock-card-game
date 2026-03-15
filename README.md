
Browser-based Rock–Paper–Scissors–Lizard–Spock card game built with vanilla JavaScript.

# Rock–Paper–Scissors–Lizard–Spock Card Game

A browser-based card game that transforms the classic hand game into a strategic card game.

This project was created as a programming work sample for an application for vocational training as a **Fachinformatiker für Anwendungsentwicklung (FIAE)** in Germany.

![Gameplay Screenshot](screenshots/gameplay.png)

---

## Project Goal

This project demonstrates fundamental software development concepts, in particular:

- modeling complex game rules
- managing multi-level game states
- controlled user interactions
- structured separation of game logic and UI

---

## Project Description

This project is a browser-based card game based on the extended hand game **Rock–Paper–Scissors–Lizard–Spock**, played by one player against a computer opponent.

The project was developed as a programming work sample for an application for vocational training as a **Fachinformatiker für Anwendungsentwicklung (FIAE)** in Germany.

The focus of the project is not on complex graphics or advanced game AI, but on implementing clearly structured game states, user interactions, and game logic in JavaScript.

---

## Game Concept

The game combines two mechanics:

1. An **initiative duel** based on the classic Rock–Paper–Scissors–Lizard–Spock rules determines which player starts.
2. The SPSLS principle is then transferred into a **sequential card game**.

A round consists of **11 tricks**.

Both the player and the computer receive **11 cards each** from a randomly generated pool of **22 cards**.

A round is won if one player wins **at least one trick more** than the opponent.  
A draw is possible.

A match is won once a player has won **three rounds**.

---

## Gameplay

Game flow:

1. The player starts the game using the **Start** button.
2. Initiative duel based on SPSLS rules. In case of a tie, the duel is repeated until a winner is determined.
3. The 22 cards for the main round are randomly generated and briefly shown face up so the player can memorize them (**preview phase**).
4. The cards are shuffled and distributed between the two players.
5. The player and the computer play their cards sequentially in tricks. The winner of the initiative duel plays the first card.
6. After 11 tricks, the round is evaluated and the next round begins.
7. The match ends once a player has won three rounds.

---

## Features

- three-level game structure (trick → round → match)
- instruction texts designed to guide players through the game
- immediate evaluation of tricks according to SPSLS rules
- all played cards remain visible on the board until the round ends
- alternating starting players for balancing (6 starting turns vs. 5 response turns)
- scoreboard tracking wins, losses, and ties for both tricks and rounds
- centralized control of UI messages
- safeguards against invalid or premature user input
- stabilized asynchronous transitions between game phases
- short pauses between rounds to improve readability of result messages
- user interface consisting of a sidebar with game instructions and scoreboard, and a main play area
- the player’s hand displays 11 visible cards that can be selected via mouse click
- the computer’s hand shows 11 hidden cards
- the current AI uses random card selection, with the possibility of future strategic improvements
- a **New Game** button allows players to restart the game or cancel a running match
- initiative buttons are only visible during the initiative phase

---

## Technologies

- JavaScript
- HTML
- CSS

The project uses **no external frameworks or libraries**.

---

## Installation / Running the Game

1. Clone the repository
