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

/*-----------------------------------------------*/

var colors = [];

for (var i = 0; i < 7; i++) {
	colors.push("blue");
}
for (var i = 0; i < 7; i++) {
	colors.push("red");
}
for (var i = 0; i < 9; i++) {
	colors.push("neutral");
}
colors.push("black");

var coinToss = Math.round(Math.random());
var startingTeam = (coinToss === 0) ? "blue" : "red"; 
colors.push(startingTeam);

shuffle(colors);

var hash = "";
for (var i = 0; i < colors.length; i++) {
	if (colors[i] === "blue")		{ hash += "0"; }
	if (colors[i] === "red")		{ hash += "1"; }
	if (colors[i] === "neutral")	{ hash += "2"; }
	if (colors[i] === "black")		{ hash += "3"; }
}

var qrcode = new QRCode(document.querySelector("#qrcode"), {
    text: "http://tehes.github.com/codenames/spymaster.html#"+hash,
    width: 300,
    height: 300,
    colorDark : "#333",
    colorLight : "#FFF",
    correctLevel : QRCode.CorrectLevel.H
});
console.log(hash);

/*-----------------------------------------------*/

var words = ["Absatz", "Abzug", "Ader", "Akt", "Amerikaner", "Anhänger", "Auflauf", "Ball", "Band", "Bank", "Bar", "Bau", "Becken", "Bein", "Berliner", "Bett", "Birne", "Blase", "Blatt", "Block", "Blüte", "Bogen", "Boxen", "Bulle", "Drache", "Druck", "Ente", "Erde", "Fach", "Fahne", "Fall","Fassung", "Feder", "Flügel", "Frankfurter", "Futter", "Gang", "Gericht", "Glas", "Golf", "Grund", "Hahn", "Hamburger", "Heide", "Hering", "Horn", "Kapelle", "Karte", "Kater", "Klasse", "Knete", "Koks", "Krebs", "Kreuz", "Krone", "Laster", "Läufer", "Leiter", "Lösung", "Maß", "Mast", "Maus", "Menü", "Messe", "Moos", "Mühle", "Mutter", "Nagel", "Netz", "Niete", "Note", "Pass", "Pfeife", "Pflaster", "Pickel", "Platte", "Pony", "Preis", "Presse", "Pumpe", "Rahmen", "Rasen", "Reich", "Rock", "Rolle", "Satz", "Scheibe", "Schein", "Schimmel", "Schirm", "Schiene", "Schild", "Schlange", "Schloss", "Scholle", "Schuppen", "Schwester", "Sirene", "Spange", "Speicher", "Spiegel", "Spion", "Sprung", "Stab", "Stamm", "Stand", "Stärke", "Steuer", "Stift", "Stock", "Stoff", "Stollen", "Strauss", "Strom", "Strudel", "Stuhl", "Tafel", "Tau", "Toast", "Ton", "Umschlag", "Umzug", "Veilchen", "Verband", "Wanze", "Wirbel", "Wirtschaft", "Wurf", "Zelle", "Zopf", "Zug", "Zweig", "Zylinder",];

shuffle(words);

/*-----------------------------------------------*/

var cards = document.querySelectorAll(".card");

for (var i = 0; i < cards.length; i++) {
	cards[i].dataset.color = colors[i];
	cards[i].dataset.word = words[i];
	cards[i].textContent = words[i];
}

/*-----------------------------------------------*/

var GameGrid = document.querySelector("#GameGrid");
GameGrid.addEventListener("click", function() { 
		if (event.target.dataset.color) {
			event.target.classList.add(event.target.dataset.color); 
			event.target.textContent = "";
			}
	}, false)
	
var modal = document.querySelector("#modal");
modal.addEventListener("click", function() {
			this.className = "invisible";
	}, false)