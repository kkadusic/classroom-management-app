const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');
const db = require('./db.js');
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "DBWT19"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
});


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
        console.log("Zavrseno kreiranje tabela i ubacivanje pocetnih podataka!");
    });
});

function inicijalizacija() {
    return new Promise(function () {
        db.osoblje.create({
            ime: 'Neko',
            prezime: 'Nekic',
            uloga: 'profesor'
        });
        db.osoblje.create({
            ime: 'Drugi',
            prezime: 'Neko',
            uloga: 'asistent'
        });
        db.osoblje.create({
            ime: 'Test',
            prezime: 'Test',
            uloga: 'asistent'
        });

        db.termin.create({
            redovni: false,
            dan: null,
            datum: '01.01.2020',
            semestar: null,
            pocetak: '12:00',
            kraj: '13:00'
        });
        db.termin.create({
            redovni: true,
            dan: 0,
            datum: null,
            semestar: 'zimski',
            pocetak: '13:00',
            kraj: '12:00'
        });

        db.sala.create({
            naziv: '1-11',
            zaduzenaOsoba: 1
        });
        db.sala.create({
            naziv: '1-15',
            zaduzenaOsoba: 2
        });

        db.rezervacija.create({
            termin: 1,
            sala: 1,
            osoba: 1
        });
        db.rezervacija.create({
            termin: 2,
            sala: 1,
            osoba: 3
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

/*
app.get('/osoblje.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/osoblje.html'));
});
 */


app.get('/osoblje', (req, res) => {
    var osoblje = [];
    db.osoblje.findAll().then(function (podaci) {
        for (var i = 0; i < podaci.length; i++) {
            var osoba = {
                id: podaci[i].id,
                ime: podaci[i].ime,
                prezime: podaci[i].prezime,
                uloga: podaci[i].uloga
            };
            osoblje.push(osoba);
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(osoblje));
    });
});

function provjeriVrijeme(zauzeca){
    var danas = new Date();
    let vrijeme = danas.getHours() + ":" + danas.getMinutes();
    let indeksDana = (danas.getDay() + 6) % 7;
    let mjesec = Kalendar.dajMjesec() + 1;
    let dan = danas.getDate().toString();
    if (dan.toString().length === 1){
        dan = "0" + dan;
    }
    let datum = "";
    if (mjesec.toString().length === 1)
        datum = dan + ".0" + mjesec + "." + Kalendar.dajGodinu();
    else
        datum = dan + "." + mjesec + "." + Kalendar.dajGodinu();
    //let datumObjekat = new Date(Kalendar.dajGodinu(), mjesec-1, parseInt(dan, 10));
    console.log("WWWWWWWWW->" + Kalendar.dajPeriodicnaZauzeca().length);
}

app.get('/osoblje.html', (req, res) => {
    console.log("GETT");
    console.log(JSON.stringify(zauzeca));

    var sql = "SELECT o.ime, o.prezime, o.uloga, s.naziv " +
        "FROM osoblje o LEFT JOIN sala s " +
        "ON s.zaduzenaOsoba = o.id";
    con.query(sql, function(err, result) {
        if (err) throw err;
        res.render(path.join(__dirname, '/html/nesto.ejs'), {
            redovi: result
        });
    });
});

let zauzeca = {
    periodicna: [],
    vanredna: []
};
let osobaPodaci = [];

app.get('/zauzeca.json', (req, res) => {
    console.log("GET zauzeca");
    let periodicna = [];
    let vanredna = [];
    db.rezervacija.findAll().then(function (rezervacije) {
        //console.log("REZERVACIJE: " + JSON.stringify(rezervacije));
            for (let i = 0; i < rezervacije.length; i++) {
                db.termin.findOne({
                    where: {
                        id: rezervacije[i].termin
                    }
                }).then(function (termin) {
                    db.sala.findOne({
                        where: {
                            id: rezervacije[i].sala
                        }
                    }).then(function (sala) {
                        db.osoblje.findOne({
                            where: {
                                id: rezervacije[i].osoba
                            }
                        }).then(function (osoba) {
                            osobaPodaci = osoba;
                            if (termin.redovni === true){
                                let p = {
                                    dan: termin.dan,
                                    semestar: termin.semestar,
                                    pocetak: termin.pocetak,
                                    kraj: termin.kraj,
                                    naziv: sala.naziv,
                                    predavac: osoba.naziv
                                };
                                periodicna.push(p);
                            }
                            else {
                                let v = {
                                    datum: termin.datum,
                                    pocetak: termin.pocetak,
                                    kraj: termin.kraj,
                                    naziv: sala.naziv,
                                    predavac: osoba.naziv
                                };
                                vanredna.push(v);
                            }
                        });
                    });
                });
            }
        });

    zauzeca = {
        periodicna: periodicna,
        vanredna: vanredna
    };

    setTimeout(function () {
        //console.log("vanredna: " + JSON.stringify(vanredna));
        //console.log("redovna: " + JSON.stringify(periodicna));
        //console.log("SVA ZAUZECA: " + JSON.stringify(zauzeca));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(zauzeca));
    }, 100);
});


function validirajNaServeru(zauzecaJson, novoZauzece) {
    if (Object.keys(novoZauzece).length === 6) { // novoZauzece je periodicno
        for (var i = 0; i < zauzecaJson.periodicna.length; i++) {
            if (JSON.stringify(zauzecaJson.periodicna[i]) === JSON.stringify(novoZauzece)) {
                return false;
            }
            if (novoZauzece.naziv === zauzecaJson.periodicna[i].naziv &&
                novoZauzece.semestar === zauzecaJson.periodicna[i].semestar &&
                novoZauzece.dan === zauzecaJson.periodicna[i].dan &&
                (novoZauzece.pocetak < zauzecaJson.periodicna[i].kraj) && (zauzecaJson.periodicna[i].pocetak < novoZauzece.kraj)) {
                return false;
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
                    return false;
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
            if (JSON.stringify(zauzecaJson.vanredna[i]) === JSON.stringify(novoZauzece)) {
                return false;
            }
            if (novoZauzece.naziv === zauzecaJson.vanredna[i].naziv &&
                novoZauzece.datum === zauzecaJson.vanredna[i].datum &&
                (novoZauzece.pocetak < zauzecaJson.vanredna[i].kraj) && (zauzecaJson.vanredna[i].pocetak < novoZauzece.kraj)) {
                return false;
            }
        }
        // Provjera preklapanja vanrednog-novoZauzece zauzeca sa periodicnim
        for (var i = 0; i < zauzecaJson.periodicna.length; i++) {
            if (semestarVanrednog === zauzecaJson.periodicna[i].semestar && indeksDana === zauzecaJson.periodicna[i].dan &&
                novoZauzece.pocetak < zauzecaJson.periodicna[i].kraj && zauzecaJson.periodicna[i].pocetak < novoZauzece.kraj &&
                novoZauzece.naziv === zauzecaJson.periodicna[i].naziv) {
                return false;
            }
        }
    }
    return true;
}


function dodajZauzeceUBazu(novoZauzece) {
    //console.log("DODAJ zauzece u bazu");
    let jelRedovno = true;
    if (Object.keys(novoZauzece).length === 5)
        jelRedovno = false;

    var predavacUloga = novoZauzece.predavac.split(' ');
    return new Promise(function () {
        try {
            db.termin.create({
                redovni: jelRedovno,
                dan: novoZauzece.dan,
                datum: novoZauzece.datum,
                semestar: novoZauzece.semestar,
                pocetak: novoZauzece.pocetak,
                kraj: novoZauzece.kraj
            }).then(function (termin) {
                db.osoblje.findOne({
                    where: {
                        ime: predavacUloga[0],
                        prezime: predavacUloga[1],
                        uloga: predavacUloga[2]
                    }
                }).then(function (osoba) {
                    db.sala.create({
                        naziv: novoZauzece.naziv,
                        zaduzenaOsoba: osoba.id
                    }).then(function (sala) {
                        db.rezervacija.create({
                            termin: termin.id,
                            sala: sala.id,
                            osoba: osoba.id
                        });
                    });

                });
            });
        } catch (e) {
            console.log(e);
        }
    });
}

app.post('/rezervacija.html', function (req, res) {
    console.log("POST zauzeca");
    let novoZauzece = req.body;
    if (validirajNaServeru(zauzeca, novoZauzece) === true) {
        if (Object.keys(novoZauzece).length === 6) {    // PERIODICNO ZAUZECE
            dodajZauzeceUBazu(novoZauzece);
        } else {                                          // VANREDNO ZAUZECE
            dodajZauzeceUBazu(novoZauzece);
        }
        res.send("Uspjesno upisano");
    }
    else {
        // todo da pravu osobu nadje
        res.send(JSON.stringify(osobaPodaci));
    }
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
    console.log('Express server na portu 3000');
});
