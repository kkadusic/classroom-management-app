let Pozivi = (function(){

    let periodicna = [];
    let vanredna = [];

    function ucitajJsonZauzecaImpl() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let jsonZauzeca = JSON.parse(this.responseText);

                for (var i = 0; i < jsonZauzeca.periodicna.length; i++){
                    periodicna.push(jsonZauzeca.periodicna[i]);
                }
                for (var i = 0; i < jsonZauzeca.vanredna.length; i++){
                    vanredna.push(jsonZauzeca.vanredna[i]);
                }

                Kalendar.ucitajPodatke(periodicna, vanredna);
                Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), new Date().getMonth());
            }
        };
        xhttp.open("GET", "../zauzeca.json", true);
        xhttp.send();
    }

    function dodajNovoZauzeceImpl(){
        $.ajax({
            url: "/rezervacija.html",
            type: "POST",
            data: {
                datum: "15.11.2019",
                pocetak: "12:00",
                kraj: "15:00",
                naziv: "A2",
                predavac: "Taylor"
            },
            success: function (data, status, settings) {

            },
            error: function (ajaxrequest, ajaxOptions, thrownError) {

            }
        });
    }

    function dodajVanrednoZauzeceImpl(datum, pocetak, kraj, naziv, predavac){
        $.ajax({
            url: "/rezervacija.html",
            type: "POST",
            data: {
                datum: datum,
                pocetak: pocetak,
                kraj: kraj,
                naziv: naziv,
                predavac: predavac
            },
            success: function (data, status, settings) {

            },
            error: function (ajaxrequest, ajaxOptions, thrownError) {

            }
        });
    }

    return {
        ucitajJsonZauzeca: ucitajJsonZauzecaImpl,
        dodajNovoZauzece: dodajNovoZauzeceImpl,
        dodajVanrednoZauzece: dodajVanrednoZauzeceImpl
    }

}());