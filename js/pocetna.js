var brojac = 1;

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

function prethodneSlike(){
    brojac--;
    namjestiButtone();
    Pozivi.ucitajSlike(brojac);
}

function sljedeceSlike(){
    brojac++;
    namjestiButtone();
    Pozivi.ucitajSlike(brojac);
}