function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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

function init() {

var words = ["Matte", "Essen", "Blüte", "Kerze", "Bein", "Tempo", "Quartett", "Siegel", "Torte", "Kater", " Berliner", "Loch Ness", "Bart", "Blatt", "Kanal", "Europa", "Peking", "Feder", "Börse", "Birne", "Erde", "Wurm", "Kasino", "Hamburger", "Drache", "Auto", "Zitrone", "Auflauf", "Bund", "Watt", "Mandel", "Läufer", "Film", "Riemen", "Morgenstern", "Weide", "Gang", "Horst", "Rom", "Shakespeare", "Verband", "Niete", "Vorsatz", "Hering", "Strom", "Stift", "Hut", "Feuer", "Lakritze", "Mutter", "Loge", "Oper", "Hollywood", "Ton", "Rock", "Lippe", "Kraft", "Tafel", "Kippe", "Adler", "Strasse", "Pistole", "Boot", "Wanze", "Prinzessin", "Millionär", "Hund", "Jet", "Botschaft", "Schuh", "Krankheit", "Note", "Brötchen", "Stuhl", "Kiwi", "Gold", "Königin", "China", "Flügel", "Funken", "Ladung", "Australien", "Mangel", "Muschel", "Rute", "Quelle", "Rost", "Bock", "Ägypten", "Bindung", "Fisch", "Soldat", "Mittel", "Skelett", "Seite", "Flöte", "Zeit", "Dinosaurier", "Pferd", "Fackel", "Gabel", "Strudel", "Alpen", "König", "Lehrer", "Daumen", "Schnee", "Pilot", "Tag", "Ring", "Stern", "Schiff", "Flasche", "Glas", "Deutschland", "Flur", "Schuppen", "Tor", "Pension", "Nadel", "Schirm", "Tanz", "Linie", "Steuer", "Karte", "Korb", "Horn", "Löwe", "Fleck", "Spiel", "Herz", "Schnur", "Orange", "Himalaja", "Raute", "Bett", "Anwalt", "Känguruh", "Grad", "Futter", "Taucher", "Melone", "Strauss", "Koks", "Römer", "Brand", "Gut", "Stamm", "Hotel", "Gras", "Uhr", "Tisch", "Fessel", "Schale", "Mund", "Nagel", "Dame", "Drucker", "Messe", "Ketchup", "Geschirr", "Theater", "Osten", "Tod", "Fuss", "Blau", "Turm", "Chor", "Rolle", "Bombe", "Bergsteiger", "Polizei", "Leben", "Erika", "Taste", "Stock", "Auge", "Brücke", "Verein", "Frankreich", "Mine", "Schotten", "Oktopus", "Gürtel", "Zwerg", "Olymp", "Krankenhaus", "Strand", "Riese", "Stadion", "Wal", "Ball", "Kreis", "Toast", "Bremse", "Limousine", "Gesicht", "Katze", "Bär", "Ritter"];
var startingTeam = (Math.round(Math.random()) === 0) ? "blue" : "red";
var blueCount = (startingTeam === "blue") ? 9 : 8;
var redCount = (startingTeam === "red") ? 9 : 8;
var colors = setColors(startingTeam);
var hash = makeHash(colors);
var GameGrid = document.querySelector("#GameGrid");

shuffle(words);
makeQRCode(hash);
setCards(colors, words);

GameGrid.addEventListener("click", function() { play(blueCount,redCount) }, false);

console.log(words.length + " Wörter");
console.log("Hash = " + hash);

}

function setColors(startingTeam) {

	var colors = [];
	
	for (var i = 0; i < 8; i++) { colors.push("blue"); }
	for (var i = 0; i < 8; i++) { colors.push("red"); }
	for (var i = 0; i < 7; i++) { colors.push("neutral"); }
	colors.push("black");
	colors.push(startingTeam);
	
	shuffle(colors);
	
	return colors;

}

function makeHash(colors) {

	var hash = "";
	for (var i = 0; i < colors.length; i++) {
	    if (colors[i] === "blue") { hash += "0"; }
	    if (colors[i] === "red") { hash += "1"; }
	    if (colors[i] === "neutral") { hash += "2"; }
	    if (colors[i] === "black") { hash += "3"; }
	}
	
	return hash;
}

function makeQRCode(hash) {

	var qrcode = new QRCode(document.querySelector("#qrcode"), {
	    text: "http://tehes.github.com/codenames/spymaster.html#" + hash,
	    width: 300,
	    height: 300,
	    colorDark: "#333",
	    colorLight: "#FFF",
	    correctLevel: QRCode.CorrectLevel.H
	});
	
	var modal = document.querySelector("#modal");
	modal.addEventListener("click", function() {
    	this.className = "invisible";
	}, false);
}

function setCards(colors, words) {

	var cards = document.querySelectorAll(".card");
	
	for (var i = 0; i < cards.length; i++) {
	    cards[i].dataset.color = colors[i];
	    cards[i].dataset.word = words[i];
	    cards[i].textContent = words[i];
	}

}

function play(blueCount,redCount) {
    // select card
    if (event.target.dataset.color) {
        event.target.classList.add(event.target.dataset.color);
        event.target.textContent = "";
    }
    
    // increment teams count
    var blueCounter = document.querySelector(".blue span");
    var redCounter = document.querySelector(".red span");
    blueCounter.textContent = document.querySelectorAll("#GameGrid .blue").length;
    redCounter.textContent = document.querySelectorAll("#GameGrid .red").length;
    
    //check for win/lose
    if ( event.target.dataset.color === "black" ) { console.log("Game ended") }
    if ( blueCount === document.querySelectorAll("#GameGrid .blue").length ) { console.log("blue wins") }
    if ( redCount === document.querySelectorAll("#GameGrid .red").length ) { console.log("red wins") }
    
}

init();
