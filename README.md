# Codenames Web

A browser-based implementation of the popular board game **Codenames**. This
project is completely playable online at
[https://tehes.github.io/codenames/](https://tehes.github.io/codenames/) and
requires no installation.

## Overview

In the original **Codenames** game, two teams compete to uncover their secret
agents based on clues given by the spymasters. The spymasters know the secret
layout via a code card. In this web implementation:

- **Game View:**
  - Players see a 5x5 grid of cards, each assigned a word from an external word
    list and a color (blue, red, neutral, or black) that represents its role.
  - Clicking on a card serves as giving a tip, revealing its color, and updating
    the team’s score.

- **Spymaster View (Code Card):**
  - A unique QR code is generated for each game layout.
  - The QR code encodes the board’s color distribution (the code card).
  - Spymasters scan this QR code with their mobile devices to view the secret
    layout on a dedicated spymaster interface.

- **Responsive Design:**\
  Both the game board and the QR code container are responsive. For example, the
  QR code container uses flexible viewport units (vmin) with a maximum width of
  400px.

- **Gameplay:**
  - The game initializes a randomized board with controlled color clustering
    using a BFS algorithm.
  - The gameplay and scoring work similarly to the original board game.
  - A clue is given by clicking on a card, and the game ends when win conditions
    are met (e.g., the assassin is revealed or a team uncovers all its cards).
  - Clicking the header resets the game and generates a new board and QR code.

## Disclaimer

This project is developed solely for non-commercial and personal entertainment
purposes. It is an independent, unofficial web implementation of the
**Codenames** board game. **This project is not affiliated with, endorsed by, or
sponsored by the official Codenames game publisher or manufacturer.** All
intellectual property rights to the original board game and its components
remain with their respective owners. No money is charged for playing, and no
advertisements are included. Use at your own risk.
