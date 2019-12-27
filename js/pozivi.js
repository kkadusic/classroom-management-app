let Pozivi = (function(){

    let periodicna = [];
    let vanredna = [];

    function ucitajJsonZauzecaImpl() {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let jsonZauzeca = JSON.parse(this.responseText);
                for (var i = 0; i < jsonZauzeca.periodicna.length; i++)
                    periodicna.push(jsonZauzeca.periodicna[i]);
                for (var i = 0; i < jsonZauzeca.vanredna.length; i++)
                    vanredna.push(jsonZauzeca.vanredna[i]);

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
                let jsonZauzeca = JSON.parse(this.responseText);
                for (var i = 0; i < jsonZauzeca.periodicna.length; i++)
                    periodicna.push(jsonZauzeca.periodicna[i]);
                for (var i = 0; i < jsonZauzeca.vanredna.length; i++)
                    vanredna.push(jsonZauzeca.vanredna[i]);
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
            }
        };
        ajax.open("POST", "/rezervacija.html", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(vanredno));
    }

    return {
        ucitajJsonZauzeca: ucitajJsonZauzecaImpl,
        ucitajObojiJsonZauzeca: ucitajObojiJsonZauzecaImpl,
        dodajPeriodicnoZauzece: dodajPeriodicnoZauzeceImpl,
        dodajVanrednoZauzece: dodajVanrednoZauzeceImpl
    }

}());