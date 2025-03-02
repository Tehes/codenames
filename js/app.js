codenames = function () {

    /* -------------------- Helper functions -------------------- */

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

    /* -------------------- Variables -------------------- */

    var words = ["Matte", "Essen", "Blüte", "Kerze", "Bein", "Tempo", "Quartett", "Siegel", "Torte", "Kater", " Berliner", "Loch Ness", "Bart", "Blatt", "Kanal", "Europa", "Peking", "Feder", "Börse", "Birne", "Erde", "Wurm", "Kasino", "Hamburger", "Drache", "Auto", "Zitrone", "Auflauf", "Bund", "Watt", "Mandel", "Läufer", "Film", "Riemen", "Morgenstern", "Weide", "Gang", "Horst", "Rom", "Shakespeare", "Verband", "Niete", "Vorsatz", "Hering", "Strom", "Stift", "Hut", "Feuer", "Lakritze", "Mutter", "Loge", "Oper", "Hollywood", "Ton", "Rock", "Lippe", "Kraft", "Tafel", "Kippe", "Adler", "Strasse", "Pistole", "Boot", "Wanze", "Prinzessin", "Millionär", "Hund", "Jet", "Botschaft", "Schuh", "Krankheit", "Note", "Brötchen", "Stuhl", "Kiwi", "Gold", "Königin", "China", "Flügel", "Funken", "Ladung", "Australien", "Mangel", "Muschel", "Rute", "Quelle", "Rost", "Bock", "Ägypten", "Bindung", "Fisch", "Soldat", "Mittel", "Skelett", "Seite", "Flöte", "Zeit", "Dinosaurier", "Pferd", "Fackel", "Gabel", "Strudel", "Alpen", "König", "Lehrer", "Daumen", "Schnee", "Pilot", "Tag", "Ring", "Stern", "Schiff", "Flasche", "Glas", "Deutschland", "Flur", "Schuppen", "Tor", "Pension", "Nadel", "Schirm", "Tanz", "Linie", "Steuer", "Karte", "Korb", "Horn", "Löwe", "Fleck", "Spiel", "Herz", "Schnur", "Orange", "Himalaja", "Raute", "Bett", "Anwalt", "Känguruh", "Grad", "Futter", "Taucher", "Melone", "Strauss", "Koks", "Römer", "Brand", "Gut", "Stamm", "Hotel", "Gras", "Uhr", "Tisch", "Fessel", "Schale", "Mund", "Nagel", "Dame", "Drucker", "Messe", "Ketchup", "Geschirr", "Theater", "Osten", "Tod", "Fuss", "Blau", "Turm", "Chor", "Rolle", "Bombe", "Bergsteiger", "Polizei", "Leben", "Erika", "Taste", "Stock", "Auge", "Brücke", "Verein", "Frankreich", "Mine", "Schotten", "Oktopus", "Gürtel", "Zwerg", "Olymp", "Krankenhaus", "Strand", "Riese", "Stadion", "Wal", "Ball", "Kreis", "Toast", "Bremse", "Limousine", "Gesicht", "Katze", "Bär", "Ritter"];

    var logo = document.querySelector("h1");
    var gameGrid = document.querySelector("#GameGrid");
    var cards = document.querySelectorAll(".card");
    var blueCounter = document.querySelector(".blue span");
    var redCounter = document.querySelector(".red span");

    var startingTeam, blueCount, redCount, solved, playedWords, colors, hash;

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

        colors = setColors();
        setCards();

        hash = generateHash();
        makeQRCode();

        logo.addEventListener("click", reset, false);

        console.log(words.length + " Wörter");
        console.log("Hash = " + hash);

        gameGrid.addEventListener("click", play, false);
        gameGrid.addEventListener("transitionend", isFinished, false);
    }

    function setColors() {
        var colors, i;
        colors = [];

        for (i = 0; i < 8; i++) { colors.push("blue"); }
        for (i = 0; i < 8; i++) { colors.push("red"); }
        for (i = 0; i < 7; i++) { colors.push("neutral"); }
        colors.push("black");
        colors.push(startingTeam);

        shuffle(colors);

        return colors;
    }

    function setCards() {
        for (var i = 0; i < cards.length; i++) {
            cards[i].dataset.color = colors[i];
            cards[i].dataset.word = words[i];
            cards[i].textContent = words[i];
        }
    }

    function generateHash() {
        var hash, i;

        hash = "";
        for (i = 0; i < colors.length; i++) {
            if (colors[i] === "blue") { hash += "0"; }
            if (colors[i] === "red") { hash += "1"; }
            if (colors[i] === "neutral") { hash += "2"; }
            if (colors[i] === "black") { hash += "3"; }
        }

        return hash;
    }

    function makeQRCode() {
        var modal, qr;

        modal = document.querySelector("#modal");
        modal.className = "";

        qr = document.createElement("div");

        qr.id = "qrcode";
        modal.appendChild(qr);

        qrcode = new QRCode(document.querySelector("#qrcode"), {
            text: "http://tehes.github.io/codenames/spymaster.html#" + hash,
            colorDark: "#333",
            colorLight: "#FFF",
            correctLevel: QRCode.CorrectLevel.H
        });

        modal.addEventListener("click", deleteQR, false);

        function deleteQR() {
            var modal = document.querySelector("#modal");
            modal.className = "invisible";
            document.querySelector("#qrcode").remove();
            modal.removeEventListener("click", deleteQR, false);
        }
    }

    function play() {
        //reset if finished
        if (solved === true) {
            reset();
            return;
        }

        // select card
        if (event.target.dataset.color) {
            event.target.classList.add(event.target.dataset.color);
            event.target.textContent = "";
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
        var i;

        gameGrid.removeEventListener("transitionend", isFinished, false);

        for (i = 0; i < cards.length; i++) {
            cards[i].classList.add(cards[i].dataset.color);
            cards[i].textContent = cards[i].dataset.word;
        }
        solved = true;
    }

    function reset() {
        var i;

        if (solved === false) {
            gameGrid.removeEventListener("transitionend", isFinished, false);
        }
        logo.removeEventListener("click", reset, false);
        gameGrid.removeEventListener("click", play);

        for (i = 0; i < cards.length; i++) {
            cards[i].classList.remove(cards[i].dataset.color);
        }

        blueCounter.textContent = 0;
        redCounter.textContent = 0;

        playedWords = words.splice(0, 25);

        init();
    }

    /* -------------------- Public -------------------- */
    return {
        init: init,
        solve: solve
    };
}();

codenames.init();
