const urlParams = new URLSearchParams(window.location.search);
const colorParam = urlParams.get("color");
const activePlayer = urlParams.get("player");

function makeBoard() {

    // for testing purposes
    //const hash = "2232244342222442434244222";
    //const hash = "3100122210010112102021020";

    const colorIndex = colorParam.split("");

    const colors = ["blue", "red", "neutral", "black", "green"];
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, i) => {
        card.classList.add(colors[colorIndex[i]]);
    });
}

function nameStarter() {
    const mapping = {
        left: "Links",
        right: "Rechts",
        blue: "Team Blau",
        red: "Team Rot"
    };

    const startingTeam = mapping[activePlayer];

    const teamVariable = document.querySelector("h1 span");
    teamVariable.textContent = startingTeam;
}

function init() {
    makeBoard();
    nameStarter();
}

window.spymaster = {
    init
};

window.spymaster.init();
