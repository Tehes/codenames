function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*-------------------------------------*/

var colors = [];

for (var i = 0; i < 8; i++) {
	colors.push("blue");
}
for (var i = 0; i < 7; i++) {
	colors.push("red");
}
for (var i = 0; i < 9; i++) {
	colors.push("neutral");
}
colors.push("black");

shuffle(colors);

var cards = document.querySelectorAll(".card");

for (var i = 0; i < cards.length; i++) {
	cards[i].dataset.color = colors[i];
	cards[i].addEventListener("click", function() { this.classList.add(this.dataset.color); }, false)
}