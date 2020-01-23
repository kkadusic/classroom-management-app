const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');
const db = require('./db.js');


app.use('/css', express.static(path.join(__dirname + '/css')));
app.use('/slike', express.static(path.join(__dirname + '/slike')));
app.use('/js', express.static(path.join(__dirname + '/js')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


db.sequelize.sync({
    force: true
}).then(function () {
    inicijalizacija().then(function () {
        console.log("Zavrseno kreiranje tabela i ubacivanje pocetnih podataka.");
    });
});

function inicijalizacija() {
    let osobljeListaPromisea = [];
    let saleListaPromisea = [];
    let terminiListaPromisea = [];
    let rezervacijeListaPromisea = [];
    return new Promise(function (resolve) {
        // todo ubacuje po redu?
        osobljeListaPromisea.push(db.osoblje.create({
            ime: 'Neko',
            prezime: 'Nekić',
            uloga: 'profesor'
        }));
        osobljeListaPromisea.push(db.osoblje.create({
            ime: 'Drugi',
            prezime: 'Neko',
            uloga: 'asistent'
        }));
        osobljeListaPromisea.push(db.osoblje.create({
            ime: 'Test',
            prezime: 'Test',
            uloga: 'asistent'
        }));

        Promise.all(osobljeListaPromisea).then(function (osoblje) {
            let nekoNekic = osoblje.filter(function (osoba) {
                return osoba.ime === 'Neko' && osoba.prezime === 'Nekić' && osoba.uloga === 'profesor'
            })[0];
            let drugiNeko = osoblje.filter(function (osoba) {
                return osoba.ime === 'Drugi' && osoba.prezime === 'Neko' && osoba.uloga === 'asistent'
            })[0];
            let testTest = osoblje.filter(function (osoba) {
                return osoba.ime === 'Test' && osoba.prezime === 'Test' && osoba.uloga === 'asistent'
            })[0];

            saleListaPromisea.push(db.sala.create({
                naziv: '1-11',
                zaduzenaOsoba: nekoNekic.id
            }));
            saleListaPromisea.push(db.sala.create({
                naziv: '1-15',
                zaduzenaOsoba: drugiNeko.id
            }));

            Promise.all(saleListaPromisea).then(function (sale) {
                let sala1_11 = sale.filter(function (sala) {
                    return sala.naziv === '1-11' && sala.zaduzenaOsoba === 1
                })[0];
                let sala1_15 = sale.filter(function (a) {
                    return a.naziv === '1-15' && a.zaduzenaOsoba === 2
                })[0];

                terminiListaPromisea.push(db.termin.create({
                    redovni: false,
                    dan: null,
                    datum: '01.01.2020',
                    semestar: null,
                    pocetak: '12:00',
                    kraj: '13:00'
                }));
                terminiListaPromisea.push(db.termin.create({
                    redovni: true,
                    dan: 0,
                    datum: null,
                    semestar: 'zimski',
                    pocetak: '13:00',
                    kraj: '14:00'
                }));

                Promise.all(terminiListaPromisea).then(function (termini) {
                    let termin1 = termini.filter(function (termin) {
                        return termin.redovni === false && termin.dan === null && termin.datum === '01.01.2020'
                            && termin.semestar === null && termin.pocetak === '12:00' && termin.kraj === '13:00'
                    })[0];
                    let termin2 = termini.filter(function (termin) {
                        return termin.redovni === true && termin.dan === 0 && termin.datum === null
                            && termin.semestar === 'zimski' && termin.pocetak === '13:00' && termin.kraj === '14:00'
                    })[0];

                    rezervacijeListaPromisea.push(db.rezervacija.create({
                        termin: termin1.id,
                        sala: sala1_11.id,
                        osoba: nekoNekic.id
                    }));

                    rezervacijeListaPromisea.push(db.rezervacija.create({
                        termin: termin2.id,
                        sala: sala1_11.id,
                        osoba: testTest.id
                    }));

                    Promise.all(rezervacijeListaPromisea).then(function (r) {
                        resolve(r);
                    }).catch(function (err) {
                        console.log("Rezervacije greska: " + err);
                    });
                }).catch(function (err) {
                    console.log("Termini greska: " + err);
                });
            }).catch(function (err) {
                console.log("Sale greska: " + err);
            });
        }).catch(function (err) {
            console.log("Osoblje greska: " + err);
        });
    });
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/pocetna.html'));
});

app.get('/pocetna.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/pocetna.html'));
});

app.get('/rezervacija.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/rezervacija.html'));
});

app.get('/sale.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/sale.html'));
});

app.get('/unos.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/unos.html'));
});

app.get('/osoblje.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/osoblje.html'));
});


// todo eventualno vratiti na jednostavniju verziju
function dodajZauzeceUBazu(novoZauzece) {
    let jelRedovno = true;
    if (Object.keys(novoZauzece).length === 5)
        jelRedovno = false;
    var predavacUloga = novoZauzece.predavac.split(' ');

    let osobljeListaPromisea = [];
    let saleListaPromisea = [];
    let terminiListaPromisea = [];
    let rezervacijeListaPromisea = [];
    return new Promise(function (resolve) {
        osobljeListaPromisea.push(db.osoblje.findOne({
            where: {
                ime: predavacUloga[0],
                prezime: predavacUloga[1],
                uloga: predavacUloga[2]
            }
        }));

        Promise.all(osobljeListaPromisea).then(function (osoblje) {
            let nekoNekic = osoblje.filter(function (osoba) {
                return osoba.ime === predavacUloga[0] && osoba.prezime === predavacUloga[1] && osoba.uloga === predavacUloga[2]
            })[0];

            saleListaPromisea.push(db.sala.create({
                naziv: novoZauzece.naziv,
                zaduzenaOsoba: nekoNekic.id
            }));

            Promise.all(saleListaPromisea).then(function (sale) {
                let sala1_11 = sale.filter(function (sala) {
                    return sala.naziv === novoZauzece.naziv && sala.zaduzenaOsoba === nekoNekic.id
                })[0];

                terminiListaPromisea.push(db.termin.create({
                    redovni: jelRedovno,
                    dan: novoZauzece.dan,
                    datum: novoZauzece.datum,
                    semestar: novoZauzece.semestar,
                    pocetak: novoZauzece.pocetak,
                    kraj: novoZauzece.kraj
                }));

                Promise.all(terminiListaPromisea).then(function (termini) {
                    let termin1 = termini.filter(function (termin) {
                        return termin.redovni === jelRedovno && termin.dan === novoZauzece.dan && termin.datum === novoZauzece.datum
                            && termin.semestar === novoZauzece.semestar && termin.pocetak === novoZauzece.pocetak && termin.kraj === novoZauzece.kraj
                    })[0];

                    rezervacijeListaPromisea.push(db.rezervacija.create({
                        termin: termin1.id,
                        sala: sala1_11.id,
                        osoba: nekoNekic.id
                    }));

                    Promise.all(rezervacijeListaPromisea).then(function (r) {
                        resolve(r);
                    }).catch(function (err) {
                        console.log("Rezervacije greska: " + err);
                    });
                }).catch(function (err) {
                    console.log("Termini greska: " + err);
                });
            }).catch(function (err) {
                console.log("Sale greska: " + err);
            });
        }).catch(function (err) {
            console.log("Osoblje greska: " + err);
        });
    });
}


app.get('/osoblje', (req, res) => {
    let listaOsoblja = [];
    db.osoblje.findAll().then(function (osoblje) {
        for (var i = 0; i < osoblje.length; i++) {
            let osoba = {
                id: osoblje[i].id,
                ime: osoblje[i].ime,
                prezime: osoblje[i].prezime,
                uloga: osoblje[i].uloga
            };
            listaOsoblja.push(osoba);
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(listaOsoblja));
    });
});

app.get('/sale', (req, res) => {
    let listaSala = [];
    db.sala.findAll().then(function (sale) {
        for (var i = 0; i < sale.length; i++) {
            let osoba = {
                id: sale[i].id,
                naziv: sale[i].naziv,
                zaduzenaOsoba: sale[i].zaduzenaOsoba
            };
            listaSala.push(osoba);
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(listaSala));
    });
});


let zauzeca = {
    periodicna: [],
    vanredna: []
};

app.get('/zauzeca.json', (req, res) => {
    let periodicna = [];
    let vanredna = [];
    let osobljeListaPromisea = [];
    let saleListaPromisea = [];
    let terminiListaPromisea = [];
    let rezervacijeListaPromisea = [];

    new Promise(function(resolve){
        rezervacijeListaPromisea.push(db.rezervacija.findAll().then(function (rezervacije) {
            for (let i = 0; i < rezervacije.length; i++) {
                terminiListaPromisea.push(db.termin.findOne({
                    where: {
                        id: rezervacije[i].termin
                    }
                }).then(function (termin) {
                    saleListaPromisea.push(db.sala.findOne({
                        where: {
                            id: rezervacije[i].sala
                        }
                    }).then(function (sala) {
                        osobljeListaPromisea.push(db.osoblje.findOne({
                            where: {
                                id: rezervacije[i].osoba
                            }
                        }).then(function (osoba) {
                            if (termin.redovni === true) {
                                let p = {
                                    dan: termin.dan,
                                    semestar: termin.semestar,
                                    pocetak: termin.pocetak,
                                    kraj: termin.kraj,
                                    naziv: sala.naziv,
                                    predavac: osoba.ime + " " + osoba.prezime + " " + osoba.uloga
                                };
                                periodicna.push(p);
                            } else {
                                let v = {
                                    datum: termin.datum,
                                    pocetak: termin.pocetak,
                                    kraj: termin.kraj,
                                    naziv: sala.naziv,
                                    predavac: osoba.ime + " " + osoba.prezime + " " + osoba.uloga
                                };
                                vanredna.push(v);
                            }

                        }));

                        if (i === rezervacije.length - 1){
                            Promise.all(osobljeListaPromisea).then(function (o) {
                                resolve(o);
                            }).catch(function (err) {
                                console.log("Osoblje greska: " + err);
                            });
                        }

                    }));
                }));
            }
        }))
    }).then(function () {
        zauzeca = {
            periodicna: periodicna,
            vanredna: vanredna
        };
        //console.log("ZAUZECA: " + JSON.stringify(zauzeca));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(zauzeca));
    });
});


function validirajNaServeru(zauzecaJson, novoZauzece) {
    //console.log("SVA ZAUZECA: " + JSON.stringify(zauzecaJson));
    if (Object.keys(novoZauzece).length === 6) { // novoZauzece je periodicno
        for (var i = 0; i < zauzecaJson.periodicna.length; i++) {
            if (novoZauzece.naziv === zauzecaJson.periodicna[i].naziv &&
                novoZauzece.semestar === zauzecaJson.periodicna[i].semestar &&
                novoZauzece.dan === zauzecaJson.periodicna[i].dan &&
                (novoZauzece.pocetak < zauzecaJson.periodicna[i].kraj) && (zauzecaJson.periodicna[i].pocetak < novoZauzece.kraj)) {
                console.log("nesto2---->" + zauzecaJson.periodicna[i].predavac);
                return zauzecaJson.periodicna[i].predavac;
            }
            // Provjera preklapanja periodicnog-novoZauzece zauzeca sa vanrednim
            for (var i = 0; i < zauzecaJson.vanredna.length; i++) {
                let dan = parseInt(zauzecaJson.vanredna[i].datum.substr(0, 2), 10);
                let mjesec = parseInt(zauzecaJson.vanredna[i].datum.substr(3, 2), 10);
                let godina = parseInt(zauzecaJson.vanredna[i].datum.substr(6, 10), 10);
                let datum = new Date(godina, mjesec - 1, dan);
                let indeksDana = (datum.getDay() + 6) % 7;
                let semestarVanrednog = "";
                if (mjesec - 1 === 0 || mjesec - 1 >= 9)
                    semestarVanrednog = "zimski";
                else if (mjesec - 1 >= 1 && mjesec - 1 <= 5)
                    semestarVanrednog = "ljetni";
                if (semestarVanrednog === novoZauzece.semestar && indeksDana === novoZauzece.dan &&
                    novoZauzece.pocetak < zauzecaJson.vanredna[i].kraj && zauzecaJson.vanredna[i].pocetak < novoZauzece.kraj &&
                    novoZauzece.naziv === zauzecaJson.vanredna[i].naziv) {
                    return zauzecaJson.vanredna[i].predavac;
                }
            }
        }
    } else {
        let dan = parseInt(novoZauzece.datum.substr(0, 2), 10);
        let mjesec = parseInt(novoZauzece.datum.substr(3, 2), 10);
        let godina = parseInt(novoZauzece.datum.substr(6, 10), 10);
        let datum = new Date(godina, mjesec - 1, dan);
        let indeksDana = (datum.getDay() + 6) % 7;
        let semestarVanrednog = "";
        if (mjesec - 1 === 0 || mjesec - 1 >= 9)
            semestarVanrednog = "zimski";
        else if (mjesec - 1 >= 1 && mjesec - 1 <= 5)
            semestarVanrednog = "ljetni";

        for (var i = 0; i < zauzecaJson.vanredna.length; i++) {
            if (novoZauzece.naziv === zauzecaJson.vanredna[i].naziv &&
                novoZauzece.datum === zauzecaJson.vanredna[i].datum &&
                (novoZauzece.pocetak < zauzecaJson.vanredna[i].kraj) && (zauzecaJson.vanredna[i].pocetak < novoZauzece.kraj)) {
                return zauzecaJson.vanredna[i].predavac;
            }
        }
        // Provjera preklapanja vanrednog-novoZauzece zauzeca sa periodicnim
        for (var i = 0; i < zauzecaJson.periodicna.length; i++) {
            if (semestarVanrednog === zauzecaJson.periodicna[i].semestar && indeksDana === zauzecaJson.periodicna[i].dan &&
                novoZauzece.pocetak < zauzecaJson.periodicna[i].kraj && zauzecaJson.periodicna[i].pocetak < novoZauzece.kraj &&
                novoZauzece.naziv === zauzecaJson.periodicna[i].naziv) {
                return zauzecaJson.periodicna[i].predavac;
            }
        }
    }
    return true;
}


app.post('/rezervacija.html', function (req, res) {
    let novoZauzece = req.body;
    let odgovor = validirajNaServeru(zauzeca, novoZauzece);
    if (odgovor === true) {
        dodajZauzeceUBazu(novoZauzece);
        res.send("Uspjesno upisano");
    } else {
        let osobaPodaci = odgovor.split(' ');
        let osoba = {
            ime: osobaPodaci[0],
            prezime: osobaPodaci[1],
            uloga: osobaPodaci[2]
        };
        res.send(JSON.stringify(osoba));
    }
});

function formirajDatum(){
    let danas = new Date();

    let sati = danas.getHours();
    let minute = danas.getMinutes();
    if (sati.toString().length === 1)
        sati = "0" + sati;
    if (minute.toString().length === 1)
        minute = "0" + minute;
    let vrijeme = sati + ":" + minute + ":00";

    let indeksDana = (danas.getDay() + 6) % 7;
    let mjesec = danas.getMonth() + 1;
    if (mjesec.toString().length === 1)
        mjesec = "0" + mjesec;

    let dan = danas.getDate().toString();
    if (dan.toString().length === 1){
        dan = "0" + dan;
    }

    let datum = "";
    datum = dan + "." + mjesec + "." + danas.getFullYear();

    return {
        indeksDana: indeksDana,
        vrijeme: vrijeme,
        datum: datum
    };
}

app.get('/osobljeSala', function(req, res) {
    let podaci = formirajDatum();
    let indeksDana = podaci.indeksDana;
    let vrijeme = podaci.vrijeme;
    let datum = podaci.datum;
    let listaOsoblja = [];

    db.osoblje.findAll().then(function(osobe) {
        db.rezervacija.findAll().then(function(rez) {
            db.termin.findAll().then(function(ter) {
                db.sala.findAll().then(function(sala) {
                    let kontrola = false;
                    for(let i = 0; i < osobe.length; i++) {
                        kontrola = false;
                        for(let j = 0; j < rez.length; j++) {
                            if(osobe[i].id === rez[j].osoba && rez[j].termin === ter[rez[j].termin - 1].id &&
                                ter[rez[j].termin - 1].pocetak < vrijeme && ter[rez[j].termin - 1].kraj > vrijeme
                                && (ter[rez[j].termin - 1].datum === datum || ter[rez[j].termin - 1].dan === indeksDana)) {

                                let uposlenik = {
                                    ime: osobe[i].ime,
                                    prezime: osobe[i].prezime,
                                    sala: sala[rez[j].sala - 1].naziv
                                };
                                let kontrola1 = false;
                                for(let k = 0; k < listaOsoblja.length; ++k) {
                                    kontrola = false;
                                    if(uposlenik.ime === listaOsoblja[k].ime && uposlenik.prezime === listaOsoblja[k].prezime) {
                                        kontrola1 = true;
                                        break;
                                    }
                                }
                                if(!kontrola1) {
                                    listaOsoblja.push(uposlenik);
                                }
                                kontrola = true;
                                break;
                            }
                        }
                        if(!kontrola) {
                            let uposlenik = {
                                ime: osobe[i].ime,
                                prezime: osobe[i].prezime,
                                sala: "u kancelariji"
                            };
                            listaOsoblja.push(uposlenik);
                        }
                    }
                    res.send(listaOsoblja);
                });
            });
        });
    });
});





app.get('/slika1.jpg', (req, res) => {
    fs.readFile('slike/sala1.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika2.jpg', (req, res) => {
    fs.readFile('slike/sala2.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika3.jpg', (req, res) => {
    fs.readFile('slike/sala3.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika4.jpg', (req, res) => {
    fs.readFile('slike/sala4.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika5.jpg', (req, res) => {
    fs.readFile('slike/sala5.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika6.jpg', (req, res) => {
    fs.readFile('slike/sala6.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika7.jpg', (req, res) => {
    fs.readFile('slike/sala7.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika8.jpg', (req, res) => {
    fs.readFile('slike/sala8.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika9.jpg', (req, res) => {
    fs.readFile('slike/sala9.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slika10.jpg', (req, res) => {
    fs.readFile('slike/sala10.jpg', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'image/jpg'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.end(podaci);
    });
});

app.get('/slike1', (req, res) => {
    let putanje = {slika1: "/slike/sala1.jpg", slika2: "/slike/sala2.jpg", slika3: "/slike/sala3.jpg"};
    res.write(JSON.stringify(putanje));
    res.send();
});

app.get('/slike2', (req, res) => {
    let putanje = {slika1: "/slike/sala4.jpg", slika2: "/slike/sala5.jpg", slika3: "/slike/sala6.jpg"};
    res.write(JSON.stringify(putanje));
    res.send();
});

app.get('/slike3', (req, res) => {
    let putanje = {slika1: "/slike/sala7.jpg", slika2: "/slike/sala8.jpg", slika3: "/slike/sala9.jpg"};
    res.write(JSON.stringify(putanje));
    res.send();
});

app.get('/slike4', (req, res) => {
    let putanje = {slika1: "/slike/sala10.jpg"};
    res.write(JSON.stringify(putanje));
    res.send();
});

app.listen(8080, function () {
    console.log('Express server na portu 3000.');
});

module.exports = app;