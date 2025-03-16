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
    const blueColors = Array.from({ length: 8 }, () => "blue");
    const redColors = Array.from({ length: 8 }, () => "red");
    const neutralColors = Array.from({ length: 7 }, () => "neutral");
    const colors = [...blueColors, ...redColors, ...neutralColors, "black", startingTeam];

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
    const hash = colors
        .map((color) => {
            if (color === "blue") return "0";
            if (color === "red") return "1";
            if (color === "neutral") return "2";
            if (color === "black") return "3";
        })
        .join("");
    return hash;
}

function makeQRCode() {
    const modal = document.querySelector("#modal");
    modal.className = "";

    // Erstelle einen Container für den QR-Code
    const qrContainer = document.createElement("div");
    qrContainer.id = "qrcode";
    modal.appendChild(qrContainer);

    // Erzeuge den QR-Code mit kjua.js
    const qr = window.kjua({
        text: `http://tehes.github.io/codenames/spymaster.html#${hash}`,
        render: "svg",      // Ausgabe als SVG für Skalierbarkeit
        size: 256,          // Grundgröße (SVG skaliert dann automatisch)
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

    cards.forEach((card) => {
        card.classList.add(card.dataset.color);
        card.textContent = card.dataset.word;
    });
    solved = true;
}

function reset() {
    if (solved === false) {
        gameGrid.removeEventListener("transitionend", isFinished, false);
    }
    logo.removeEventListener("click", reset, false);
    gameGrid.removeEventListener("click", play);

    cards.forEach((card) => {
        card.classList.remove(card.dataset.color);
    });

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
