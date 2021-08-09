window.onload = function () {
    Pozivi.ucitajJsonZauzeca(false);
    Pozivi.ucitajOsobljeSaTrenutnimSalama();
};

function prikaziOsobljeSaTrenutnimSalamaNaStranici(podaci) {
    document.getElementById("listaOsoblja").innerHTML = "";
    var para = document.createElement("p");
    for (let i = 0; i < podaci.length; i++) {
        para.append(i + 1 + ". " + podaci[i].ime + " " + podaci[i].prezime + " - " + podaci[i].sala);
        let linebreak = document.createElement("br");
        para.appendChild(linebreak);
    }
    document.getElementById("listaOsoblja").appendChild(para);
}

setInterval(function () {
    Pozivi.ucitajOsobljeSaTrenutnimSalama()
}, 30000);
