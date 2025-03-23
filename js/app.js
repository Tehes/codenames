/* -------------------- Helper functions -------------------- */

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

/* -------------------- Variables -------------------- */

import { wordList } from './words.js';
let words = wordList;
let mode = "competitive"; // cooperative or competitive
let suddenDeath;

const logo = document.querySelector("h1");
const gameGrid = document.querySelector("#GameGrid");
const cards = document.querySelectorAll(".card");
const modeSwitch = document.querySelector(".segmented-toggle");
const playerSwitch = document.querySelector("#playerSwitch");
const leftRadio = document.querySelector('#optionLeft');
const rightRadio = document.querySelector('#optionRight');
const scoreLeft = document.querySelector("#scoreLeft");
const scoreRight = document.querySelector("#scoreRight");
const leftCounter = scoreLeft.querySelector("span");
const rightCounter = scoreRight.querySelector("span");


let startingTeam, blueCount, redCount, greenCount, greenCounterLeft, greenCounterRight, solved, playedWords, colors, colorsLeft, colorsRight, hash, timeTokens, activePlayer;

/* -------------------- Functions -------------------- */

function init() {
    shuffle(words);
    if (playedWords) {
        words = words.concat(playedWords);
        playedWords = [];
    }

    if (mode === "competitive") {
        startingTeam = shuffle(["blue", "red"])[0];
        blueCount = (startingTeam === "blue") ? 9 : 8;
        redCount = (startingTeam === "red") ? 9 : 8;

        playerSwitch.classList.add("hidden");

        scoreLeft.firstChild.textContent = "Team Blau: ";
        leftCounter.textContent = "0";
        scoreLeft.classList.remove("green");
        scoreLeft.classList.add("blue");

        scoreRight.firstChild.textContent = "Team Rot: ";
        rightCounter.textContent = "0";
        scoreRight.classList.remove("green");
        scoreRight.classList.add("red");

        colors = setColorsWithNoBigClusters();

        hash = generateHash(colors, startingTeam);
        makeQRCode(hash);
    }
    else if (mode === "cooperative") {
        activePlayer = shuffle(["left", "right"])[0];
        timeTokens = 9;
        greenCount = 15;
        greenCounterLeft = 0;
        greenCounterRight = 0;
        suddenDeath = false;

        playerSwitch.classList.remove("hidden");
        if (activePlayer === "left") {
            document.querySelector("#optionLeft").checked = true;
        } else {
            document.querySelector("#optionRight").checked = true;
        }

        scoreLeft.firstChild.textContent = "Punkte: ";
        leftCounter.textContent = "0";
        scoreLeft.classList.remove("blue");
        scoreLeft.classList.add("green");

        scoreRight.firstChild.textContent = "Zeitmarker: ";
        rightCounter.textContent = timeTokens;
        scoreRight.classList.remove("red");
        scoreRight.classList.add("green");

        colorsLeft = setColorsWithNoBigClusters();
        colorsRight;
        let matchCount;
        // Wiederhole, bis colorsRight genau 3 übereinstimmende grüne Felder hat
        do {
            colorsRight = setColorsWithNoBigClusters();
            matchCount = 0;
            for (let i = 0; i < colorsLeft.length; i++) {
                if (colorsLeft[i] === "green" && colorsRight[i] === "green") {
                    matchCount++;
                }
            }
        } while (matchCount !== 3);

        hash = generateHash(colorsLeft);
        makeQRCode(hash, activePlayer);
        hash = generateHash(colorsRight);
        makeQRCode(hash, activePlayer);
    }

    solved = false;
    setCards();

    logo.addEventListener("click", reset, false);
    modeSwitch.addEventListener("change", modeSwitchHandler);
    playerSwitch.addEventListener("change", playerToggleHandler);

    console.log(words.length + " Wörter");
    console.log("Hash = " + hash);

    gameGrid.addEventListener("click", play, false);
    gameGrid.addEventListener("transitionend", isFinished, false);
}

function modeSwitchHandler() {
    if (document.querySelector("#optionNormal").checked) {
        mode = "competitive";
    } else if (document.querySelector("#optionCoop").checked) {
        mode = "cooperative";
    }
    reset();
}

function playerToggleHandler() {
    const selected = document.querySelector('input[name="activePlayer"]:checked').id;
    activePlayer = (selected === "optionLeft") ? "left" : "right";
    console.log("Active player switched to: " + activePlayer);
    if (timeTokens > 0) {
        timeTokens--;
        rightCounter.textContent = timeTokens;
    }

    setTimeout(() => {
        if (activePlayer === "left" && greenCounterLeft === 9) {
            rightRadio.checked = true;
        } else if (activePlayer === "right" && greenCounterRight === 9) {
            leftRadio.checked = true;
        }
    }, 500);
}

function togglePlayerSwitchUI() {
    if (leftRadio.checked && greenCounterRight < 9) {
        rightRadio.checked = true;
    } else if (rightRadio.checked && greenCounterLeft < 9) {
        leftRadio.checked = true;
    }
    playerToggleHandler();
}

function setColorsWithNoBigClusters() {
    let colors;
    // competitive mode
    if (mode === "competitive") {
        const blueColors = Array.from({ length: 8 }, () => "blue");
        const redColors = Array.from({ length: 8 }, () => "red");
        const neutralColors = Array.from({ length: 7 }, () => "neutral");
        colors = [...blueColors, ...redColors, ...neutralColors, "black", startingTeam];
    }
    else if (mode === "cooperative") {
        const greenColors = Array.from({ length: 9 }, () => "green");
        const neutralColors = Array.from({ length: 13 }, () => "neutral");
        const blackColors = Array.from({ length: 3 }, () => "black");
        colors = [...greenColors, ...neutralColors, ...blackColors];
    }

    let validLayoutFound = false;
    while (!validLayoutFound) {
        shuffle(colors);
        // Prüfen, ob kein Cluster > 4 Felder
        if (!hasTooLargeCluster(colors, 4)) {
            validLayoutFound = true;
        }
    }
    return colors;
}

/* Prüft, ob es irgendwo im 5x5-Grid einen Farb-Cluster gibt,
    der größer ist als maxClusterSize. Berücksichtigt dabei
    auch diagonale Nachbarn (8 Richtungen). */
function hasTooLargeCluster(colors, maxClusterSize) {
    const rows = 5;
    const cols = 5;
    const visited = new Array(colors.length).fill(false);

    // Hilfsfunktion, um die Indexe der Nachbarn (inkl. Diagonal) zu bekommen
    function getNeighbors(r, c) {
        const neighbors = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue; // sich selbst überspringen
                const nr = r + dr;
                const nc = c + dc;
                // Nur gültige Felder (im 5x5) aufnehmen
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    neighbors.push(nr * cols + nc);
                }
            }
        }
        return neighbors;
    }

    // BFS, um die Größe eines zusammenhängenden Farb-Clusters zu ermitteln
    function bfs(startIndex) {
        const queue = [startIndex];
        visited[startIndex] = true;
        const startColor = colors[startIndex];
        let clusterSize = 0;

        while (queue.length > 0) {
            const current = queue.shift();
            clusterSize++;
            const r = Math.floor(current / cols);
            const c = current % cols;

            // Nachbarn (8 Richtungen) holen
            const neighbors = getNeighbors(r, c);
            for (const n of neighbors) {
                if (!visited[n] && colors[n] === startColor) {
                    visited[n] = true;
                    queue.push(n);
                }
            }
        }
        return clusterSize;
    }

    // Jeden Index im Array prüfen, ob wir dort einen (noch) unbesuchten Cluster haben
    for (let i = 0; i < colors.length; i++) {
        if (!visited[i]) {
            const size = bfs(i);
            if (size > maxClusterSize) {
                return true; // Es gibt mindestens einen Cluster, der zu groß ist
            }
        }
    }
    return false; // Kein zu großer Cluster gefunden
}

function setCards() {
    cards.forEach((card, i) => {
        if (mode === "competitive") {
            card.dataset.color = colors[i];
        }
        else if (mode === "cooperative") {
            card.dataset.coopLeft = colorsLeft[i];
            card.dataset.coopRight = colorsRight[i];
        }
        card.dataset.word = words[i];
        card.textContent = words[i];
    });
}

function generateHash(colorArray) {
    const hash = colorArray
        .map((color) => {
            if (color === "blue") return "0";
            if (color === "red") return "1";
            if (color === "neutral") return "2";
            if (color === "black") return "3";
            if (color === "green") return "4";
        })
        .join("");
    return hash;
}

function makeQRCode(colors, activePlayer = false) {
    const modal = document.querySelector("#modal");
    modal.className = "";

    // Erstelle einen Container für den QR-Code
    const qrContainer = document.createElement("div");
    qrContainer.id = "qrcode";
    modal.appendChild(qrContainer);

    // Erzeuge den QR-Code mit kjua.js
    const qr = window.kjua({
        text: `http://tehes.github.io/codenames/spymaster.html?color=${colors}&player=${activePlayer}`,
        render: "svg",      // Ausgabe als SVG für Skalierbarkeit
        fill: "#333",       // Farbe für die dunklen Module
        crisp: true         // für scharfe Kanten
        // weitere Optionen können hier hinzugefügt werden
    });

    // Füge den generierten QR-Code in den Container ein
    qrContainer.innerHTML = "";
    qrContainer.appendChild(qr);

    modal.addEventListener("click", deleteQR, false);

    function deleteQR() {
        const modal = document.querySelector("#modal");
        modal.className = "invisible";
        document.querySelector("#qrcode").remove();
        modal.removeEventListener("click", deleteQR, false);
    }
}

function play(ev) {
    if (!ev.target.classList.contains("card")) return;
    //reset if finished
    if (solved === true) {
        reset();
        return;
    }

    // select card
    if (mode === "competitive") {
        if (ev.target.dataset.color) {
            ev.target.classList.add(ev.target.dataset.color);
            ev.target.textContent = "";
        }
    } else if (mode === "cooperative") {
        // Determine the color based on the active card
        let activeColor;
        if (activePlayer === "left") {
            activeColor = ev.target.dataset.coopLeft;
            ev.target.removeAttribute("data-coop-left");
        } else if (activePlayer === "right") {
            activeColor = ev.target.dataset.coopRight;
            ev.target.removeAttribute("data-coop-right");
        }
        if (!activeColor) {
            return;
        }
        else if (activeColor === "neutral") {
            if (ev.target.classList.contains("neutral-border")) {
                ev.target.classList.add(activeColor);
                ev.target.textContent = "";
            }
            else {
                ev.target.classList.add("neutral-border");
            }
            if (timeTokens === 0) {
                suddenDeath = true;
            }
            togglePlayerSwitchUI();
        }
        else {
            ev.target.classList.add(activeColor);
            ev.target.textContent = "";
            if (activeColor === "green") {
                if (activePlayer === "left") {
                    greenCounterLeft++;
                } else if (activePlayer === "right") {
                    greenCounterRight++;
                }
            }
        }

    }

    // increment teams count
    if (mode === "competitive") {
        leftCounter.textContent = document.querySelectorAll("#GameGrid .blue").length;
        rightCounter.textContent = document.querySelectorAll("#GameGrid .red").length;
    }
    else if (mode === "cooperative") {
        leftCounter.textContent = document.querySelectorAll("#GameGrid .green").length;
    }
}

function isFinished() {
    if (document.querySelectorAll("#GameGrid .black").length === 1) {
        alert("Spiel beendet");
        solve();
    }
    else if (blueCount === document.querySelectorAll("#GameGrid .blue").length) {
        alert("Blau gewinnt");
        solve();
    }
    else if (redCount === document.querySelectorAll("#GameGrid .red").length) {
        alert("Rot gewinnt");
        solve();
    }
    else if (greenCount === document.querySelectorAll("#GameGrid .green").length) {
        alert("Ihr habt gewonnen!");
        solve();
    }
    else if (suddenDeath === true) {
        alert("Ihr habt verloren!");
        solve();
    }
}

function solve() {
    gameGrid.removeEventListener("transitionend", isFinished, false);

    cards.forEach((card) => {
        if (mode === "competitive") {
            card.classList.add(card.dataset.color);
        }
        card.textContent = card.dataset.word;
    });
    solved = true;
}

function reset() {
    if (solved === false) {
        gameGrid.removeEventListener("transitionend", isFinished, false);
    }
    logo.removeEventListener("click", reset, false);
    modeSwitch.removeEventListener("change", modeSwitchHandler);
    playerSwitch.removeEventListener("change", playerToggleHandler);
    gameGrid.removeEventListener("click", play);

    cards.forEach((card) => {
        card.classList.remove("blue", "red", "black", "neutral", "green", "neutral-border");
    });

    playedWords = words.splice(0, 25);

    init();
}

window.codenames = {
    init,
    solve
};

window.codenames.init();
