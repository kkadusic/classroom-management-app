let Kalendar = (function() {

    let danas = new Date();
    let mjesec = danas.getMonth();
    let godina = danas.getFullYear();
    let sviMjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];

    var redovnaZauzeca;
    var vanrednaZauzeca;

    function dajMjesecImpl() {
        return mjesec;
    }

    function ocistiPodatkeImpl() {
        redovnaZauzeca = [];
        vanrednaZauzeca = [];
    }

    function ucitajPodatkeImpl(periodicna, vanredna) {
        redovnaZauzeca = periodicna;
        vanrednaZauzeca = vanredna;
    }

    function dajIndeksTrazenogDana(mjesec, dan) {
        if (mjesec == 0) {
            if (dan == 0) return 6;
            if (dan == 1) return 0;
            if (dan == 2) return 1;
            if (dan == 3) return 2;
            if (dan == 4) return 3;
        }
        if (mjesec == 1) {
            if (dan == 0) return 3;
            if (dan == 1) return 4;
            if (dan == 2) return 5;
            if (dan == 3) return 6;
            if (dan == 4) return 0;
        }
        if (mjesec == 2) {
            if (dan == 0) return 3;
            if (dan == 1) return 4;
            if (dan == 2) return 5;
            if (dan == 3) return 6;
            if (dan == 4) return 0;
        }
        if (mjesec == 3) {
            if (dan == 0) return 0;
            if (dan == 1) return 1;
            if (dan == 2) return 2;
            if (dan == 3) return 3;
            if (dan == 4) return 4;
        }
        if (mjesec == 4) {
            if (dan == 0) return 5;
            if (dan == 1) return 6;
            if (dan == 2) return 0;
            if (dan == 3) return 1;
            if (dan == 4) return 2;
        }
        if (mjesec == 5) {
            if (dan == 0) return 2;
            if (dan == 1) return 3;
            if (dan == 2) return 4;
            if (dan == 3) return 5;
            if (dan == 4) return 6;
        }
        if (mjesec == 6) {
            if (dan == 0) return 0;
            if (dan == 1) return 1;
            if (dan == 2) return 2;
            if (dan == 3) return 3;
            if (dan == 4) return 4;
        }
        if (mjesec == 7) {
            if (dan == 0) return 4;
            if (dan == 1) return 5;
            if (dan == 2) return 6;
            if (dan == 3) return 0;
            if (dan == 4) return 1;
        }
        if (mjesec == 8) {
            if (dan == 0) return 1;
            if (dan == 1) return 2;
            if (dan == 2) return 3;
            if (dan == 3) return 4;
            if (dan == 4) return 5;
        }
        if (mjesec == 9) {
            if (dan == 0) return 6;
            if (dan == 1) return 0;
            if (dan == 2) return 1;
            if (dan == 3) return 2;
            if (dan == 4) return 3;
        }
        if (mjesec == 10) {
            if (dan == 0) return 3;
            if (dan == 1) return 4;
            if (dan == 2) return 5;
            if (dan == 3) return 6;
            if (dan == 4) return 0;
        }
        if (mjesec == 11) {
            if (dan == 0) return 1;
            if (dan == 1) return 2;
            if (dan == 2) return 3;
            if (dan == 3) return 4;
            if (dan == 4) return 5;
        }
    }



    function obojiRedovnoZauzece(mjesec, dan) {
        let brojDanaMjeseca = 32 - new Date(godina, mjesec, 32).getDate();
        let prviDanMjeseca = ((new Date(godina, mjesec)).getDay() + 6) % 7;
        var duzina = document.getElementsByClassName("kalendarBroj");

        let a = dajIndeksTrazenogDana(mjesec, dan);

        for (var i = prviDanMjeseca + a; i < duzina.length; i += 7) {
            var x = document.getElementsByClassName("kalendarBroj")[i];
            var y = x.children[1].className = "zauzeta";
        }
    }

    function obojiVanrednoZauzece(odabraniMjesec, danDatum) {
        let prviDanMjeseca = ((new Date(godina, odabraniMjesec)).getDay() + 6) % 7;
        var x = document.getElementsByClassName("kalendarBroj")[danDatum + prviDanMjeseca - 1];
        var y = x.children[1].className = "zauzeta";
    }

    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {
        let semestar = "";

        if (kalendarRef != null && sala != null && pocetak != null && kraj != null &&
            sala != "" && pocetak != "" && kraj != "") {

            for (var i = 0; i < redovnaZauzeca.length; i++) {
                if (redovnaZauzeca[i].naziv == sala) {
                    semestar = redovnaZauzeca[i].semestar;
                    if (((semestar == "zimski") && (mjesec == 0 || mjesec >= 9)) ||
                        ((semestar == "ljetni") && (mjesec >= 1 && mjesec <= 5))) {
                        if ((pocetak <= redovnaZauzeca[i].kraj) &&
                            (redovnaZauzeca[i].pocetak <= kraj)) {
                            obojiRedovnoZauzece(mjesec, redovnaZauzeca[i].dan);

                        }
                    }
                }
            }


            for (var i = 0; i < vanrednaZauzeca.length; i++) {
                if (vanrednaZauzeca[i].naziv == sala) {
                    if ((pocetak <= vanrednaZauzeca[i].kraj) &&
                        (vanrednaZauzeca[i].pocetak <= kraj)) {
                        var dan = Number(vanrednaZauzeca[i].datum.substring(0, 2));
                        var odabraniMjesec = Number(vanrednaZauzeca[i].datum.substring(3, 5));
                        if (mjesec == odabraniMjesec - 1) {
                            obojiVanrednoZauzece(odabraniMjesec - 1, dan);
                        }

                    }
                }
            }

        }
    }


    function obrisi(elementID) {
        document.getElementById(elementID).innerHTML = "";
    }


    function prethodniImpl() {
        if (godina === 2019 && mjesec > 0) {
            obrisi('kalendarDatum');
            godina = (mjesec === 0) ? godina - 1 : godina;
            mjesec = (mjesec === 0) ? 11 : mjesec - 1;
            iscrtajKalendarImpl(document.getElementById("kalendarDatum"), mjesec);
            if (document.getElementById("sala").value != null &&
                document.getElementById("pocetak").value != null &&
                document.getElementById("kraj").value) {
                Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(),
                    document.getElementById("sala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value);
            }
        } else alert("Prikaz prethodne godine je onemogucen");
    }

    function sljedeciImpl() {
        if (godina === 2019 && mjesec < 11) {
            obrisi('kalendarDatum');
            godina = (mjesec === 11) ? godina + 1 : godina;
            mjesec = (mjesec + 1) % 12;
            iscrtajKalendarImpl(document.getElementById("kalendarDatum"), mjesec);
            if (document.getElementById("sala").value != null &&
                document.getElementById("pocetak").value != null &&
                document.getElementById("kraj").value) {
                Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(),
                    document.getElementById("sala").value, document.getElementById("pocetak").value, document.getElementById("kraj").value);
            }
        } else alert("Prikaz sljedece godine je onemogucen");
    }


    function iscrtajKalendarImpl(kalendarRef, mjesec) {
        let prviDanMjeseca = ((new Date(godina, mjesec)).getDay() + 6) % 7;
        let brojDanaMjeseca = 32 - new Date(godina, mjesec, 32).getDate();

        // Postavljanje naziva za mjesec
        obrisi('kalendarMjesec');
        var el = document.createElement('div');
        var domString = '<h3>' + sviMjeseci[mjesec] + '</h3>';
        el.innerHTML = domString;
        document.getElementById("kalendarMjesec").appendChild(el.firstChild);

        // Dodavanje dana iz proslog mjeseca
        for (var i = 0; i < prviDanMjeseca; i++) {
            var el = document.createElement('div');
            var domString = '<div class="kalendarBroj danBezPrikaza"></div>';
            el.innerHTML = domString;
            kalendarRef.appendChild(el.firstChild);
        }

        // Dodavanje dana iz aktuelnog mjeseca
        for (var i = 1; i <= brojDanaMjeseca; i++) {
            var el = document.createElement('div');
            var domString = '<div class="kalendarBroj"> <div class="danBroj">' + i + '</div> <div class="slobodna"></div> </div>';
            el.innerHTML = domString;
            kalendarRef.appendChild(el.firstChild);
        }
    }

    return {
        obojiZauzeca: obojiZauzecaImpl,
        ucitajPodatke: ucitajPodatkeImpl,
        iscrtajKalendar: iscrtajKalendarImpl,
        prethodni: prethodniImpl,
        sljedeci: sljedeciImpl,
        dajMjesec: dajMjesecImpl,
        ocistiPodatke: ocistiPodatkeImpl
    }
}());




// Podaci za ucitavanje
var redovna = [{
        dan: 3,
        semestar: "zimski",
        pocetak: "12:00",
        kraj: "15:00",
        naziv: "A3",
        predavac: "John"
    },
    {
        dan: 1,
        semestar: "zimski",
        pocetak: "12:00",
        kraj: "15:00",
        naziv: "A3",
        predavac: "John"
    }
];

var vanredna = [{
        datum: "15.11.2019",
        pocetak: "12:00",
        kraj: "15:00",
        naziv: "A2",
        predavac: "Taylor"
    },
    {
        datum: "27.11.2019",
        pocetak: "15:00",
        kraj: "18:00",
        naziv: "1-08",
        predavac: "Ben"
    }
];

window.onload = function() {
    let trenutniMjesec = new Date().getMonth();
    Kalendar.ucitajPodatke(redovna, vanredna);
    Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), trenutniMjesec);
};

document.getElementById("forma").addEventListener("change", myFunction);

function myFunction() {
    //alert("Promjena na formi");
    //Kalendar.ucitajPodatke(redovna, vanredna);
    //Kalendar.obrisi("kalendarDatum");
    //Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 3);
    //Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), trenutniMjesec);
    var odabranaSala = document.getElementById("sala").value;
    var pocetak = document.getElementById("pocetak").value;
    var kraj = document.getElementById("kraj").value;
    Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), odabranaSala, pocetak, kraj);
    Kalendar.obrisi("kalendarDatum");
}


//primjer korištenja modula
//Kalendar.obojiZauzeca(document.getElementById("kalendar"),1,"A3","12:00","13:30");