spymaster = function () {
    function makeBoard() {
        //const hash = location.hash.substring(1);

        // for testing purposes
        //const hash = "2232244342222442434244222";
        //const hash = "3100122210010112102021020";

        const colorIndex = hash.split("");

        const colors = ["blue", "red", "neutral", "black", "green"];
        const cards = document.querySelectorAll(".card");

        cards.forEach((card, i) => {
            card.classList.add(colors[colorIndex[i]]);
        });
    }

    function nameStarter() {
        const blueCards = document.querySelectorAll(".blue");
        const redCards = document.querySelectorAll(".red");
        const greenCards = document.querySelectorAll(".green");

        const startingTeam = (blueCards.length > redCards.length) ? "Blau" : "Rot";

        const teamVariable = document.querySelector("h1 span");
        if (greenCards.length > 0) {
            teamVariable.textContent = "";
        } else {
            teamVariable.textContent = startingTeam;
        }
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
