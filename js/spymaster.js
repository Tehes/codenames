spymaster = function () {
    function makeBoard() {
        const hash = location.hash.substring(1);

        // for testing purposes
        // var hash = "0002001101231010201212122";

        const colorIndex = hash.split("");

        const colors = ["blue", "red", "neutral", "black", "green"];
        const cards = document.querySelectorAll(".card");

        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add(colors[colorIndex[i]]);
        }
    }

    function nameStarter() {
        const blueCards = document.querySelectorAll(".blue");
        const redCards = document.querySelectorAll(".red");

        const startingTeam = (blueCards.length === 0 && redCards.length === 0) ? false : ((blueCards.length > redCards.length) ? "Blau" : "Rot");

        const teamVariable = document.querySelector("h1 span");
        teamVariable.textContent = (startingTeam === false) ? "" : startingTeam;
    }

    function init() {
        makeBoard();
        nameStarter();
    }

    return {
        init: init
    };
}();

spymaster.init();
