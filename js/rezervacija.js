window.onload = function() {
    Pozivi.ucitajJsonZauzeca();
};

document.getElementById("forma").addEventListener("change", unosNaFormi);

function unosNaFormi() {
    let sala = document.getElementById("sala").value;
    let periodicna = document.getElementById("periodicna").checked.valueOf();
    let pocetak = document.getElementById("pocetak").value;
    let kraj = document.getElementById("kraj").value;
    Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), sala, periodicna, pocetak, kraj);
}

function prethodni() {
    Kalendar.prethodni();
}

function sljedeci() {
    Kalendar.sljedeci();
}

function odabirDana(kliknutiDan) {
    let sala = document.getElementById("sala").value;
    let periodicna = document.getElementById("periodicna").checked.valueOf();
    let pocetak = document.getElementById("pocetak").value;
    let kraj = document.getElementById("kraj").value;



    Pozivi.dodajNovoZauzece();
    //Pozivi.dodajVanrednoZauzece();

    if (sala != null && pocetak != null && kraj != null && sala !== "" && pocetak !== "" && kraj !== "" &&
        kliknutiDan.children[1].className === "slobodna"){
        var odgovor = confirm("Da li želite da rezervišete ovaj termin?");

        if (odgovor === true){
            //dodajNovoZauzece();
        }
    }
    else {
        // alert("Niste odabrali salu ili početak ili kraj");
    }
}



