let Pozivi = (function () {

    function ucitajOsobljeIzBazeImpl() {
        console.log("ucitajOsobljeIzBaze");
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let osobljeJson = JSON.parse(this.responseText);
                dodajOsobljeIzBaze(osobljeJson);
            }
        };
        ajax.open("GET", "/osoblje", true);
        ajax.send();
    }

    function ucitajOsobljeSaTrenutnimSalamaImpl() {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                prikaziOsobljeSaTrenutnimSalamaNaStranici(JSON.parse(this.responseText));
            }
        };
        ajax.open("GET", "/osobljeSala", true);
        ajax.send();
    }


    function ucitajJsonZauzecaImpl(iscrtaj) {
        console.log("ucitajJSonZauzeca");
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let zauzecaJson = JSON.parse(this.responseText);
                Kalendar.ucitajPodatke(zauzecaJson.periodicna, zauzecaJson.vanredna);
                if (iscrtaj === true)
                    Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), Kalendar.dajMjesec());
            }
        };
        ajax.open("GET", "../zauzeca.json", true);
        ajax.send();
    }

    function ucitajObojiJsonZauzecaImpl(sala, per, poc, kraj) {
        console.log("ucitajObojiJSonZauzeca");
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let zauzecaJson = JSON.parse(this.responseText);
                document.getElementById("kalendarDatum").innerHTML = "";
                Kalendar.ucitajPodatke(zauzecaJson.periodicna, zauzecaJson.vanredna);
                Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), Kalendar.dajMjesec());
                Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), sala, per, poc, kraj);
            }
        };
        ajax.open("GET", "../zauzeca.json", true);
        ajax.send();

    }

    function dodajPeriodicnoZauzeceImpl(dan, semestar, pocetak, kraj, naziv, predavac) {
        let periodicno = {dan: dan, semestar: semestar, pocetak: pocetak, kraj: kraj, naziv: naziv, predavac: predavac};
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                // uzas
                ucitajObojiJsonZauzecaImpl(naziv, true, pocetak, kraj);
                ucitajObojiJsonZauzecaImpl(naziv, true, pocetak, kraj);
                if (this.responseText !== "Uspjesno upisano")
                    alert("Rezervacija sale " + naziv + " periodično za dan " + Kalendar.dajImeDana(dan) + ", " + semestar +
                        " semestar, u periodu od " + pocetak + " do " + kraj + " nije moguća." + " Podaci o osobi:\n"
                        + "Ime: " + JSON.parse(this.responseText).ime + "\nPrezime: " + JSON.parse(this.responseText).prezime
                        + "\nUloga: " + JSON.parse(this.responseText).uloga);
            }
        };
        ajax.open("POST", "/rezervacija.html", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(periodicno));
    }


    function dodajVanrednoZauzeceImpl(datum, pocetak, kraj, naziv, predavac) {
        console.log("dodajVanrednoZauzeceImpl");
        let vanredno = {datum: datum, pocetak: pocetak, kraj: kraj, naziv: naziv, predavac: predavac};
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                // uzas
                ucitajObojiJsonZauzecaImpl(naziv, false, pocetak, kraj);
                ucitajObojiJsonZauzecaImpl(naziv, false, pocetak, kraj);
                if (this.responseText !== "Uspjesno upisano") {
                    alert("Nije moguće rezervisati salu " + naziv + " za navedeni datum "
                        + datum.toString().replace(/\./g, "/") + " i termin od " + pocetak + " do " + kraj + "."
                        + " Podaci o osobi:\n" + "Ime: " + JSON.parse(this.responseText).ime + "\nPrezime: "
                        + JSON.parse(this.responseText).prezime + "\nUloga: " + JSON.parse(this.responseText).uloga);
                }
            }
        };
        ajax.open("POST", "/rezervacija.html", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(vanredno));
    }

    function ucitajSlikeImpl(setSlikaIndeks) {
        if (dosaoDoKraja === true) return 0;
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                let podaci = JSON.parse(ajax.responseText);
                ucitaneSlike.push(podaci);

                if (setSlikaIndeks !== 4) {
                    $(document).ready(function () {
                        // var prvaSlikaBroj = podaci.slika1.toString().replace(/\D/g,'') + ".jpg";
                        // var drugaSlikaBroj = podaci.slika2.toString().replace(/\D/g,'') + ".jpg";
                        // var trecaSlikaBroj = podaci.slika3.toString().replace(/\D/g,'') + ".jpg";
                        // $(".img").append('<a href="http://localhost:8080/slika' + prvaSlikaBroj + '"> <img src="'
                        // + podaci.slika1 + '" alt="slika""></a>');
                        $(".img").empty();
                        $(".img").append('<img src="' + podaci.slika1 + '" alt="slika""></a>');
                        $(".img").append('<img src="' + podaci.slika2 + '" alt="slika""></a>');
                        $(".img").append('<img src="' + podaci.slika3 + '" alt="slika""></a>');
                    });
                } else {
                    $(document).ready(function () {
                        // var prvaSlikaBroj = podaci.slika1.toString().replace(/\D/g,'') + ".jpg";
                        $(".img").empty();
                        $(".img").append('<img src="' + podaci.slika1 + '" alt="slika""></a>');
                    });
                }
            }
        };
        if (dosaoDoKraja === false) {
            ajax.open("GET", "img" + setSlikaIndeks, true);
            ajax.send();
        }
    }

    return {
        ucitajJsonZauzeca: ucitajJsonZauzecaImpl,
        ucitajObojiJsonZauzeca: ucitajObojiJsonZauzecaImpl,
        dodajPeriodicnoZauzece: dodajPeriodicnoZauzeceImpl,
        dodajVanrednoZauzece: dodajVanrednoZauzeceImpl,
        ucitajSlike: ucitajSlikeImpl,
        ucitajOsobljeIzBaze: ucitajOsobljeIzBazeImpl,
        ucitajOsobljeSaTrenutnimSalama: ucitajOsobljeSaTrenutnimSalamaImpl
    }

}());


