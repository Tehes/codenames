var hash = location.hash.substr(1);

// for testing purposes
// var hash = "2020220110212200121032011";

var colorIndex = hash.split("");

var colors = ["blue", "red", "neutral", "black"];
var cards = document.querySelectorAll(".card");

for (var i = 0; i < cards.length; i++) {
    cards[i].classList.add(colors[colorIndex[i]]);
}
