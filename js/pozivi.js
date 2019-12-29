let Pozivi = (function(){

    let periodicna = [];
    let vanredna = [];

    function ucitajJsonZauzecaImpl() {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let zauzecaJson = JSON.parse(this.responseText);
                for (var i = 0; i < zauzecaJson.periodicna.length; i++)
                    periodicna.push(zauzecaJson.periodicna[i]);
                for (var i = 0; i < zauzecaJson.vanredna.length; i++)
                    vanredna.push(zauzecaJson.vanredna[i]);
                Kalendar.ucitajPodatke(periodicna, vanredna);
                Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), Kalendar.dajMjesec());
            }
        };
        ajax.open("GET", "../zauzeca.json", true);
        ajax.send();
    }

    function ucitajObojiJsonZauzecaImpl(sala, per, poc, kraj) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let zauzecaJson = JSON.parse(this.responseText);
                for (var i = 0; i < zauzecaJson.periodicna.length; i++)
                    periodicna.push(zauzecaJson.periodicna[i]);
                for (var i = 0; i < zauzecaJson.vanredna.length; i++)
                    vanredna.push(zauzecaJson.vanredna[i]);
                document.getElementById("kalendarDatum").innerHTML = "";
                Kalendar.ucitajPodatke(periodicna, vanredna);
                Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), Kalendar.dajMjesec());
                Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), sala, per, poc, kraj);
            }
        };
        ajax.open("GET", "../zauzeca.json", true);
        ajax.send();
    }

    function dodajPeriodicnoZauzeceImpl(dan, semestar, pocetak, kraj, naziv, predavac){
        let periodicno = {dan: dan, semestar: semestar, pocetak: pocetak, kraj: kraj, naziv: naziv, predavac: predavac};
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4 && ajax.status === 200){
                ucitajObojiJsonZauzecaImpl(naziv, true, pocetak, kraj);
                if (this.responseText !== "Uspjesno upisano")
                    alert("Rezervacija sale " +  naziv + " periodično za dan " + Kalendar.dajImeDana(dan) + ", " + semestar +
                        " semestar, u periodu od " + pocetak + " do " + kraj + " nije moguća.");
            }
        };
        ajax.open("POST", "/rezervacija.html", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(periodicno));
    }


    function dodajVanrednoZauzeceImpl(datum, pocetak, kraj, naziv, predavac){
        let vanredno = {datum: datum, pocetak: pocetak, kraj: kraj, naziv: naziv, predavac: predavac};
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4 && ajax.status === 200){
                ucitajObojiJsonZauzecaImpl(naziv, false, pocetak, kraj);
                if (this.responseText !== "Uspjesno upisano")
                    alert("Nije moguće rezervisati salu " + naziv + " za navedeni datum " +
                        datum.toString().replace(/\./g, "/") + " i termin od " + pocetak + " do " + kraj + "!");
            }
        };
        ajax.open("POST", "/rezervacija.html", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(vanredno));
    }

    function ucitajSlikeImpl(setSlika) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let podaci = JSON.parse(ajax.responseText);
                if (setSlika !== 4) {
                    $(document).ready(function () {
                        $(".slike").empty();
                        $(".slike").append('<img src="' + podaci.slika1 + '" alt="slika"">');
                        $(".slike").append('<img src="' + podaci.slika2 + '" alt="slika"">');
                        $(".slike").append('<img src="' + podaci.slika3 + '" alt="slika"">');
                    });
                }
                else {
                    $(document).ready(function () {
                        $(".slike").empty();
                        $(".slike").append('<img src="' + podaci.slika1 + '" alt="slika"">');
                    });
                }
            }
        };
        ajax.open("GET", "slike" + setSlika, true);
        ajax.send();
    }

    return {
        ucitajJsonZauzeca: ucitajJsonZauzecaImpl,
        ucitajObojiJsonZauzeca: ucitajObojiJsonZauzecaImpl,
        dodajPeriodicnoZauzece: dodajPeriodicnoZauzeceImpl,
        dodajVanrednoZauzece: dodajVanrednoZauzeceImpl,
        ucitajSlike: ucitajSlikeImpl
    }

}());


