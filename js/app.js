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

import { words } from './words.js';

const logo = document.querySelector("h1");
const gameGrid = document.querySelector("#GameGrid");
const cards = document.querySelectorAll(".card");
const blueCounter = document.querySelector(".blue span");
const redCounter = document.querySelector(".red span");

let startingTeam, blueCount, redCount, solved, playedWords, colors, hash;

/* -------------------- Functions -------------------- */

function init() {
    startingTeam = (Math.round(Math.random()) === 0) ? "blue" : "red";
    blueCount = (startingTeam === "blue") ? 9 : 8;
    redCount = (startingTeam === "red") ? 9 : 8;

    solved = false;

    shuffle(words);
    if (playedWords) {
        words = words.concat(playedWords);
        playedWords = [];
    }

    colors = setColorsWithNoBigClusters();
    setCards();

    hash = generateHash();
    makeQRCode();

    logo.addEventListener("click", reset, false);

    console.log(words.length + " Wörter");
    console.log("Hash = " + hash);

    gameGrid.addEventListener("click", play, false);
    gameGrid.addEventListener("transitionend", isFinished, false);
}

function setColorsWithNoBigClusters() {
    // Basis-Array für Farben
    const colors = [];
    for (let i = 0; i < 8; i++) { colors.push("blue"); }
    for (let i = 0; i < 8; i++) { colors.push("red"); }
    for (let i = 0; i < 7; i++) { colors.push("neutral"); }
    colors.push("black");
    colors.push(startingTeam); // je nach init()

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
        card.dataset.color = colors[i];
        card.dataset.word = words[i];
        card.textContent = words[i];
    });
}

function generateHash() {
    let hash = "";
    for (let i = 0; i < colors.length; i++) {
        if (colors[i] === "blue") { hash += "0"; }
        if (colors[i] === "red") { hash += "1"; }
        if (colors[i] === "neutral") { hash += "2"; }
        if (colors[i] === "black") { hash += "3"; }
    }

    return hash;
}

function makeQRCode() {
    const modal = document.querySelector("#modal");
    modal.className = "";

    const qr = document.createElement("div");

    qr.id = "qrcode";
    modal.appendChild(qr);

    window.qrcode = new QRCode(document.querySelector("#qrcode"), {
        text: `http://tehes.github.io/codenames/spymaster.html#${hash}`,
        colorDark: "#333",
        colorLight: "#FFF",
        correctLevel: QRCode.CorrectLevel.H
    });

    modal.addEventListener("click", deleteQR, false);

    function deleteQR() {
        const modal = document.querySelector("#modal");
        modal.className = "invisible";
        document.querySelector("#qrcode").remove();
        modal.removeEventListener("click", deleteQR, false);
    }
}

function play(ev) {
    //reset if finished
    if (solved === true) {
        reset();
        return;
    }

    // select card
    if (ev.target.dataset.color) {
        ev.target.classList.add(ev.target.dataset.color);
        ev.target.textContent = "";
    }

    // increment teams count
    blueCounter.textContent = document.querySelectorAll("#GameGrid .blue").length;
    redCounter.textContent = document.querySelectorAll("#GameGrid .red").length;
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
}

function solve() {
    gameGrid.removeEventListener("transitionend", isFinished, false);

    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add(cards[i].dataset.color);
        cards[i].textContent = cards[i].dataset.word;
    }
    solved = true;
}

function reset() {
    if (solved === false) {
        gameGrid.removeEventListener("transitionend", isFinished, false);
    }
    logo.removeEventListener("click", reset, false);
    gameGrid.removeEventListener("click", play);

    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove(cards[i].dataset.color);
    }

    blueCounter.textContent = 0;
    redCounter.textContent = 0;

    playedWords = words.splice(0, 25);

    init();
}

window.codenames = {
    init,
    solve
};

window.codenames.init();
