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

// Ako se klikne na dugme prethodni vraćaju se prethodno prikazane i učitane 3 img bez slanja Ajax zahtjeva
function prethodneSlike(){
    brojac--;
    $(document).ready(function () {
        $(".img").empty();
        var prvaSlikaBroj = ucitaneSlike[brojac-1].slika1.toString().replace(/\D/g,'') + ".jpg";
        var drugaSlikaBroj = ucitaneSlike[brojac-1].slika2.toString().replace(/\D/g,'') + ".jpg";
        var trecaSlikaBroj = ucitaneSlike[brojac-1].slika3.toString().replace(/\D/g,'') + ".jpg";
        $(".img").append('<img src="' + ucitaneSlike[brojac-1].slika1 + '" alt="slika""></a>');
        $(".img").append('<img src="' + ucitaneSlike[brojac-1].slika2 + '" alt="slika""></a>');
        $(".img").append('<img src="' + ucitaneSlike[brojac-1].slika3 + '" alt="slika""></a>');
        namjestiButtone();
    });
}

function sljedeceSlike(){
    brojac++;
    console.log(ucitaneSlike.toString());
    if (dosaoDoKraja === false) {
        Pozivi.ucitajSlike(brojac);
        namjestiButtone();
    }
    else {
        $(document).ready(function () {
            if (brojac < 4) {
                $(".img").empty();
                $(".img").append('<img src="' + ucitaneSlike[brojac - 1].slika1 + '" alt="slika""></a>');
                $(".img").append('<img src="' + ucitaneSlike[brojac - 1].slika2 + '" alt="slika""></a>');
                $(".img").append('<img src="' + ucitaneSlike[brojac - 1].slika3 + '" alt="slika""></a>');
                namjestiButtone();
            }
            else {
                $(document).ready(function () {
                    $(".img").empty();
                    $(".img").append('<img src="' + ucitaneSlike[brojac - 1].slika1 + '" alt="slika""></a>');
                });
                namjestiButtone();
            }
        });
    }
    if (brojac === 4) dosaoDoKraja = true;
}