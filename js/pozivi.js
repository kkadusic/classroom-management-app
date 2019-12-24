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

    return {
        ucitajJsonZauzeca: ucitajJsonZauzecaImpl
    }

}());