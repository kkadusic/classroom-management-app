window.onload = function () {
    Pozivi.ucitajJsonZauzeca(true);
    Pozivi.ucitajOsobljeIzBaze();
};

document.getElementById("forma").addEventListener("change", unosNaFormi);

function unosNaFormi() {
    let sala = document.getElementById("sala").value;
    let periodicna = document.getElementById("periodicna").checked.valueOf();
    let pocetak = document.getElementById("pocetak").value;
    let kraj = document.getElementById("kraj").value;
    Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), sala, periodicna, pocetak, kraj);
}

function prethodni() {
    Kalendar.prethodni();
}

function sljedeci() {
    Kalendar.sljedeci();
}

function rezervisi(kliknutiDan) {
    let mjesec = parseInt(Kalendar.dajMjesec(), 10) + 1;
    let dan = kliknutiDan.textContent.trim();
    if (dan.length === 1) {
        dan = "0" + dan;
    }

    let datum = "";
    if (mjesec.toString().length === 1)
        datum = dan + ".0" + mjesec + "." + Kalendar.dajGodinu();
    else
        datum = dan + "." + mjesec + "." + Kalendar.dajGodinu();

    let datumObjekat = new Date(Kalendar.dajGodinu(), mjesec - 1, parseInt(dan, 10));
    let indeksDana = (datumObjekat.getDay() + 6) % 7;

    let semestar = "";
    if (Kalendar.dajMjesec() === 0 || Kalendar.dajMjesec() >= 9)
        semestar = "zimski";
    else if (Kalendar.dajMjesec() >= 1 && Kalendar.dajMjesec() <= 5)
        semestar = "ljetni";

    let sala = document.getElementById("sala").value;
    let periodicna = document.getElementById("periodicna").checked.valueOf();
    let pocetak = document.getElementById("pocetak").value;
    let kraj = document.getElementById("kraj").value;
    let predavac = document.getElementById("osoblje").value;


    if (sala !== "" && pocetak !== "" && kraj !== "" && kliknutiDan.children[1].className === "slobodna" && pocetak < kraj) {
        if (semestar === "" && periodicna === true)
            alert("Periodična rezervacija mora biti unutar zimskog ili ljetnog semestra.");
        else {
            var odgovor = confirm("Da li želite da rezervišete ovaj termin?");
            if (odgovor === true && periodicna === true) {
                Pozivi.dodajPeriodicnoZauzece(indeksDana, semestar, pocetak, kraj, sala, predavac);
            } else if (odgovor === true && periodicna === false) {
                Pozivi.dodajVanrednoZauzece(datum, pocetak, kraj, sala, predavac);
            }
        }
    }
    // Ako se sa klijentske strane prijavi greska o zauzecu onda nema potrebe da se dalje salje request serveru
    else if (sala !== "" && pocetak !== "" && kraj !== "" && kliknutiDan.children[1].className === "zauzeta") {
        alert("Sala je zauzeta.");
    } else {
        alert("Niste odabrali početak ili kraj zauzeća.\nIli je početak nakon kraja rezervacije.");
    }
}

function dodajOsobljeIzBaze(osobljeJson) {
    for (var i = 0; i < osobljeJson.length; i++) {
        var osobljeSelect = document.getElementById("osoblje");
        var option = document.createElement("option");
        option.value = osobljeJson[i].ime + " " + osobljeJson[i].prezime + " " + osobljeJson[i].uloga;
        option.text = osobljeJson[i].ime + " " + osobljeJson[i].prezime + " " + osobljeJson[i].uloga;
        osobljeSelect.add(option);
    }
}
