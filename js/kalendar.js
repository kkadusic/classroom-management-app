let Kalendar = (function() {

    let danas = new Date();
    let mjesec = danas.getMonth();
    let godina = danas.getFullYear();
    const sviMjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];

    var redovnaZauzeca = [];
    var vanrednaZauzeca = [];

    function dajMjesecImpl() {
        return mjesec;
    }

    function dajGodinuImpl(){
        return godina;
    }

    function ocistiPodatkeImpl() {
        redovnaZauzeca = [];
        vanrednaZauzeca = [];
    }

    function ucitajPodatkeImpl(periodicnaZ, vanrednaZ) {
        redovnaZauzeca = periodicnaZ;
        vanrednaZauzeca = vanrednaZ;
    }

    function dajIndeksTrazenogDana(mjesec, dan) {
        let prviDanMjeseca = ((new Date(godina, mjesec)).getDay() + 6) % 7;
        if (dan >= prviDanMjeseca)
            return dan - prviDanMjeseca;
        else
            return dan + 7 - prviDanMjeseca;
    }


    function obojiRedovnoZauzece(mjesec, dan) {
        let prviDanMjeseca = ((new Date(godina, mjesec)).getDay() + 6) % 7;
        var duzina = document.getElementsByClassName("kalendarBroj");
        let a = dajIndeksTrazenogDana(mjesec, dan);

        for (var i = prviDanMjeseca + a; i < duzina.length; i += 7) {
            var x = document.getElementsByClassName("kalendarBroj")[i];
            x.children[1].className = "zauzeta";
        }
    }

    function obojiVanrednoZauzece(odabraniMjesec, danDatum) {
        let prviDanMjeseca = ((new Date(godina, odabraniMjesec)).getDay() + 6) % 7;
        var x = document.getElementsByClassName("kalendarBroj")[danDatum + prviDanMjeseca - 1];
        x.children[1].className = "zauzeta";
    }

    function obojiZauzecaImpl(kalendarRef, mjesec, sala, periodicna, pocetak, kraj) {
        let semestar = "";
        let prviDanMjeseca = ((new Date(godina, mjesec)).getDay() + 6) % 7;
        let brojDanaMjeseca = 32 - new Date(godina, mjesec, 32).getDate();

        // Brisanje zauzetih datuma prije ucitavanja novih (refresh)
        for (var i = prviDanMjeseca; i < brojDanaMjeseca +  prviDanMjeseca; i++) {
            var x = document.getElementsByClassName("kalendarBroj")[i];
            x.children[1].className = "slobodna";
        }

        if (kalendarRef != null && sala !== "" && pocetak !== "" && kraj !== "") {
            if (periodicna === true) {
                for (var i = 0; i < redovnaZauzeca.length; i++) {
                    if (redovnaZauzeca[i].naziv === sala) {
                        semestar = redovnaZauzeca[i].semestar;
                        if (((semestar === "zimski") && (mjesec === 0 || mjesec >= 9)) ||
                            ((semestar === "ljetni") && (mjesec >= 1 && mjesec <= 5))) {
                            if ((pocetak < redovnaZauzeca[i].kraj) && (redovnaZauzeca[i].pocetak < kraj)) {
                                obojiRedovnoZauzece(mjesec, redovnaZauzeca[i].dan);
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < vanrednaZauzeca.length; i++) {
                    if (vanrednaZauzeca[i].naziv === sala) {
                        if ((pocetak < vanrednaZauzeca[i].kraj) && (vanrednaZauzeca[i].pocetak < kraj)) {
                            var dan = Number(vanrednaZauzeca[i].datum.substring(0, 2));
                            var odabraniMjesec = Number(vanrednaZauzeca[i].datum.substring(3, 5));
                            if (mjesec === odabraniMjesec - 1) {
                                obojiVanrednoZauzece(odabraniMjesec - 1, dan);
                            }
                        }
                    }
                }
            }

        }
    }

    function obrisi(elementID) {
        document.getElementById(elementID).innerHTML = "";
    }

    function namjestiDugme(dugme, disable) {
        if (!dugme) return;
        dugme.disabled = !!disable;
    }

    function prethodniImpl() {
        obrisi('kalendarDatum');
        godina = (mjesec === 0) ? godina - 1 : godina;
        mjesec = (mjesec === 0) ? 11 : mjesec - 1;
        iscrtajKalendarImpl(document.getElementById("kalendarDatum"), mjesec);
        if (document.getElementById("sala").value != null &&
            document.getElementById("pocetak").value != null &&
            document.getElementById("kraj").value != null) {
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), mjesec,
                document.getElementById("sala").value, document.getElementById("periodicna").checked.valueOf(),
                document.getElementById("pocetak").value, document.getElementById("kraj").value);
        }
    }

    function sljedeciImpl() {
        obrisi('kalendarDatum');
        godina = (mjesec === 11) ? godina + 1 : godina;
        mjesec = (mjesec + 1) % 12;
        iscrtajKalendarImpl(document.getElementById("kalendarDatum"), mjesec);
        if (document.getElementById("sala").value != null &&
            document.getElementById("pocetak").value != null &&
            document.getElementById("kraj").value != null) {
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), mjesec,
                document.getElementById("sala").value, document.getElementById("periodicna").checked.valueOf(),
                document.getElementById("pocetak").value, document.getElementById("kraj").value);
        }
    }


    function iscrtajKalendarImpl(kalendarRef, mjesec) {
        let prviDanMjeseca = ((new Date(godina, mjesec)).getDay() + 6) % 7;
        let brojDanaMjeseca = 32 - new Date(godina, mjesec, 32).getDate();

        if (mjesec === 0)
            namjestiDugme(document.getElementById("prethodniBtn"), true);
        else
            namjestiDugme(document.getElementById("prethodniBtn"), false);

        if (mjesec === 11)
            namjestiDugme(document.getElementById("sljedeciBtn"), true);
        else
            namjestiDugme(document.getElementById("sljedeciBtn"), false);


        // Postavljanje naziva za mjesec
        obrisi('kalendarMjesec');
        var el = document.createElement('div');
        el.innerHTML = '<h3>' + sviMjeseci[mjesec] + '</h3>';
        document.getElementById("kalendarMjesec").appendChild(el.firstChild);

        // Dodavanje dana iz proslog mjeseca
        for (var i = 0; i < prviDanMjeseca; i++) {
            var el = document.createElement('div');
            el.innerHTML = '<div class="kalendarBroj danBezPrikaza"></div>';
            kalendarRef.appendChild(el.firstChild);
        }

        // Dodavanje dana iz aktuelnog mjeseca
        for (var i = 1; i <= brojDanaMjeseca; i++) {
            var el = document.createElement('div');
            el.innerHTML = '<div class="kalendarBroj" onclick="rezervisi(this)" style="cursor: pointer;"> ' +
                '<div class="danBroj">' + i + '</div> <div class="slobodna"></div> </div>';
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
        dajGodinu: dajGodinuImpl,
        ocistiPodatke: ocistiPodatkeImpl
    }

}());

