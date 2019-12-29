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


    function ucitajSlikeImpl(){
        /*$.ajax({
            url: "/pocetna.html",
            type: 'GET',
            dataType: 'html',
            async: true,
            crossDomain: 'true',
            success: function(data, status) {
                console.log("Status: "+status+"\nData: "+data);
                result = data;
                console.log(data);
                /!* creating image assuming data is the url of image *!/
                var img = $('<img id="image_id">');
                img.attr('src', 'data:image/jpg;base64,' + data);
                img.appendTo('.sadrzaj');
            }
        });*/
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                $(document).ready(function(){
                    $(".slike").append('<img src="http://localhost:8080/slika1" alt="slika1">');
                    $(".slike").append('<img src="http://localhost:8080/slika2" alt="slika2">');
                    $(".slike").append('<img src="http://localhost:8080/slika3" alt="slika3">');
                });
            }
        };
        ajax.open("GET", "/pocetna.html", true);
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


