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

var codenames = {

    words: ["Matte", "Essen", "Blüte", "Kerze", "Bein", "Tempo", "Quartett", "Siegel", "Torte", "Kater", " Berliner", "Loch Ness", "Bart", "Blatt", "Kanal", "Europa", "Peking", "Feder", "Börse", "Birne", "Erde", "Wurm", "Kasino", "Hamburger", "Drache", "Auto", "Zitrone", "Auflauf", "Bund", "Watt", "Mandel", "Läufer", "Film", "Riemen", "Morgenstern", "Weide", "Gang", "Horst", "Rom", "Shakespeare", "Verband", "Niete", "Vorsatz", "Hering", "Strom", "Stift", "Hut", "Feuer", "Lakritze", "Mutter", "Loge", "Oper", "Hollywood", "Ton", "Rock", "Lippe", "Kraft", "Tafel", "Kippe", "Adler", "Strasse", "Pistole", "Boot", "Wanze", "Prinzessin", "Millionär", "Hund", "Jet", "Botschaft", "Schuh", "Krankheit", "Note", "Brötchen", "Stuhl", "Kiwi", "Gold", "Königin", "China", "Flügel", "Funken", "Ladung", "Australien", "Mangel", "Muschel", "Rute", "Quelle", "Rost", "Bock", "Ägypten", "Bindung", "Fisch", "Soldat", "Mittel", "Skelett", "Seite", "Flöte", "Zeit", "Dinosaurier", "Pferd", "Fackel", "Gabel", "Strudel", "Alpen", "König", "Lehrer", "Daumen", "Schnee", "Pilot", "Tag", "Ring", "Stern", "Schiff", "Flasche", "Glas", "Deutschland", "Flur", "Schuppen", "Tor", "Pension", "Nadel", "Schirm", "Tanz", "Linie", "Steuer", "Karte", "Korb", "Horn", "Löwe", "Fleck", "Spiel", "Herz", "Schnur", "Orange", "Himalaja", "Raute", "Bett", "Anwalt", "Känguruh", "Grad", "Futter", "Taucher", "Melone", "Strauss", "Koks", "Römer", "Brand", "Gut", "Stamm", "Hotel", "Gras", "Uhr", "Tisch", "Fessel", "Schale", "Mund", "Nagel", "Dame", "Drucker", "Messe", "Ketchup", "Geschirr", "Theater", "Osten", "Tod", "Fuss", "Blau", "Turm", "Chor", "Rolle", "Bombe", "Bergsteiger", "Polizei", "Leben", "Erika", "Taste", "Stock", "Auge", "Brücke", "Verein", "Frankreich", "Mine", "Schotten", "Oktopus", "Gürtel", "Zwerg", "Olymp", "Krankenhaus", "Strand", "Riese", "Stadion", "Wal", "Ball", "Kreis", "Toast", "Bremse", "Limousine", "Gesicht", "Katze", "Bär", "Ritter"],

    cards: document.querySelectorAll(".card"),
    GameGrid: document.querySelector("#GameGrid"),

    init: function() {
        this.startingTeam = (Math.round(Math.random()) === 0) ? "blue" : "red";
        this.blueCount = (this.startingTeam === "blue") ? 9 : 8;
        this.redCount = (this.startingTeam === "red") ? 9 : 8;

        shuffle(this.words);
        if (this.playedWords) {
            this.words = this.words.concat(this.playedWords);
            this.playedWords = [];
        }

        this.colors = this.setColors();
        this.setCards();

        this.hash = this.generateHash();
        this.makeQRCode();

        console.log(this.words.length + " Wörter");
        console.log("Hash = " + this.hash);

        this.playHandler = this.play.bind(this);
        this.GameGrid.addEventListener("click", this.playHandler, false);
    },
    setColors: function() {
        var colors, i;
    	 colors = [];

    	for (i = 0; i < 8; i++) { colors.push("blue"); }
    	for (i = 0; i < 8; i++) { colors.push("red"); }
    	for (i = 0; i < 7; i++) { colors.push("neutral"); }
    	colors.push("black");
    	colors.push(this.startingTeam);

    	shuffle(colors);

    	return colors;
    },
    setCards: function() {
    	for (var i = 0; i < this.cards.length; i++) {
    	    this.cards[i].dataset.color = this.colors[i];
    	    this.cards[i].dataset.word = this.words[i];
    	    this.cards[i].textContent = this.words[i];
    	}
    },
    generateHash: function() {
        var hash, i;

        hash = "";
    	for (i = 0; i < this.colors.length; i++) {
    	    if (this.colors[i] === "blue") { hash += "0"; }
    	    if (this.colors[i] === "red") { hash += "1"; }
    	    if (this.colors[i] === "neutral") { hash += "2"; }
    	    if (this.colors[i] === "black") { hash += "3"; }
    	}

    	return hash;
    },
    makeQRCode: function() {
        var modal;

        this.qrcode = new QRCode(document.querySelector("#qrcode"), {
    	    text: "http://tehes.github.com/codenames/spymaster.html#" + this.hash,
    	    width: 300,
    	    height: 300,
    	    colorDark: "#333",
    	    colorLight: "#FFF",
    	    correctLevel: QRCode.CorrectLevel.H
    	});

    	modal = document.querySelector("#modal");
    	modal.addEventListener("click", function() {
            this.className = "invisible";
    	}, false);
    },
    play: function() {
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

        setTimeout(this.isFinished.bind(this), 0);
    },
    isFinished: function() {
        if ( document.querySelectorAll("#GameGrid .black").length === 1) {
            alert("Spiel beendet");
            this.solve();
        }
        else if ( this.blueCount === document.querySelectorAll("#GameGrid .blue").length ) {
            alert("Blau gewinnt");
            this.solve();
        }
        else if ( this.redCount === document.querySelectorAll("#GameGrid .red").length ) {
            alert("Rot gewinnt");
            this.solve();
        }
    },
    solve: function() {
        var i;
        this.GameGrid.removeEventListener("click", this.playHandler);

        for (i = 0; i < this.cards.length; i++) {
            this.cards[i].classList.add(this.cards[i].dataset.color);
            this.cards[i].textContent = this.cards[i].dataset.word;
        }
    },
    reset: function() {
        var i;

        for (i = 0; i < this.cards.length; i++) {
            this.cards[i].classList.remove(this.cards[i].dataset.color);
        }

        var blueCounter = document.querySelector(".blue span");
        var redCounter = document.querySelector(".red span");
        blueCounter.textContent = 0;
        redCounter.textContent = 0;

        this.playedWords = this.words.splice(0,25);

        this.init();
    }

};

codenames.init();
