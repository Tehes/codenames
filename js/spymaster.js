spymaster = function() {
    function makeBoard() {
        var hash = location.hash.substr(1);

        // for testing purposes
        // var hash = "0002001101231010201212122";

        var colorIndex = hash.split("");

        var colors = ["blue", "red", "neutral", "black"];
        var cards = document.querySelectorAll(".card");

        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.add(colors[colorIndex[i]]);
        }
    }

    function nameStarter() {
        var blueCards = document.querySelectorAll(".blue");
        var redCards = document.querySelectorAll(".red");

        var startingTeam = (blueCards.length > redCards.length) ? "Blau" : "Rot";

        var teamVariable = document.querySelector("h1 span");
        teamVariable.textContent = startingTeam;
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
