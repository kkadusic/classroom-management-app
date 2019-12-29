window.onload = function() {
    Pozivi.ucitajJsonZauzeca();
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
    if (dan.length === 1){
        dan = "0" + dan;
    }

    let datum = "";
    if (mjesec.toString().length === 1)
        datum = dan + ".0" + mjesec + "." + Kalendar.dajGodinu();
    else
        datum = dan + "." + mjesec + "." + Kalendar.dajGodinu();

    let datumObjekat = new Date(Kalendar.dajGodinu(), mjesec-1, parseInt(dan, 10));
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

    // todo namjestiti da indeks dana mora biti 0-4
    if (sala !== "" && pocetak !== "" && kraj !== "" && kliknutiDan.children[1].className === "slobodna"){
        if (semestar === "" && periodicna === true) // todo da mora pocetak prije kraja, napraviti posebnu f-ju za validiranje
            alert("Periodična rezervacija mora biti unutar zimskog ili ljetnog semestra.");
        else {
            var odgovor = confirm("Da li želite da rezervišete ovaj termin?");
            if (odgovor === true && periodicna === true){
                Pozivi.dodajPeriodicnoZauzece(indeksDana, semestar, pocetak, kraj, sala, "");
            }
            else if (odgovor === true && periodicna === false){
                Pozivi.dodajVanrednoZauzece(datum, pocetak, kraj, sala, "");
            }
        }
    }
    // Ako se sa klijentske strane prijavi greska o zauzecu onda nema potrebe da se dalje salje request serveru
    else if (sala !== "" && pocetak !== "" && kraj !== "" && kliknutiDan.children[1].className === "zauzeta"){
        alert("Sala je zauzeta.");
    }
    else {
        alert("Niste odabrali početak ili kraj zauzeća.");
    }
}



