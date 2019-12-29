var brojac = 1;
var ucitaneSlike = [];
var dosaoDoKraja = false;

window.onload = function() {
    Pozivi.ucitajSlike(brojac);
    namjestiButtone();
};

function onemoguciDugme(dugme, disable) {
    if (!dugme) return;
    dugme.disabled = !!disable;
}

function namjestiButtone() {
    if (brojac === 1)
        onemoguciDugme(document.getElementById("prethodnaSlikaBtn"), true);
    else
        onemoguciDugme(document.getElementById("prethodnaSlikaBtn"), false);

    if (brojac === 4)
        onemoguciDugme(document.getElementById("sljedecaSlikaBtn"), true);
    else
        onemoguciDugme(document.getElementById("sljedecaSlikaBtn"), false);
}

// Ako se klikne na dugme prethodni vraćaju se prethodno prikazane i učitane 3 slike bez slanja Ajax zahtjeva
function prethodneSlike(){
    brojac--;

    $(document).ready(function () {
        $(".slike").empty();
        var prvaSlikaBroj = ucitaneSlike[brojac-1].slika1.toString().replace(/\D/g,'') + ".jpg";
        var drugaSlikaBroj = ucitaneSlike[brojac-1].slika2.toString().replace(/\D/g,'') + ".jpg";
        var trecaSlikaBroj = ucitaneSlike[brojac-1].slika3.toString().replace(/\D/g,'') + ".jpg";

        $(".slike").append('<img src="' + ucitaneSlike[brojac-1].slika1 + '" alt="slika""></a>');
        $(".slike").append('<img src="' + ucitaneSlike[brojac-1].slika2 + '" alt="slika""></a>');
        $(".slike").append('<img src="' + ucitaneSlike[brojac-1].slika3 + '" alt="slika""></a>');
    });
    namjestiButtone();


}

function sljedeceSlike(){
    brojac++;
    if (dosaoDoKraja === false) {
        Pozivi.ucitajSlike(brojac);
        namjestiButtone();
    }
    else {
        $(document).ready(function () {
            if (brojac < 4) {

                $(".slike").empty();
                $(".slike").append('<img src="' + ucitaneSlike[brojac - 1].slika1 + '" alt="slika""></a>');
                $(".slike").append('<img src="' + ucitaneSlike[brojac - 1].slika2 + '" alt="slika""></a>');
                $(".slike").append('<img src="' + ucitaneSlike[brojac - 1].slika3 + '" alt="slika""></a>');
            }
            else {
                $(document).ready(function () {
                    $(".slike").empty();
                    $(".slike").append('<img src="' + ucitaneSlike[brojac - 1].slika1 + '" alt="slika""></a>');
                });
            }
        });
        namjestiButtone();
    }
    if (brojac === 4) dosaoDoKraja = true;
}