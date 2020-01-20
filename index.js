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
        console.log("Zavrseno kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicijalizacija() {
    let osobljeListaPromisea = [];
    let rezervacijeListaPromisea = [];
    let terminiListaPromisea = [];
    let saleListaPromisea = [];

    return new Promise(function (resolve, reject) {
        osobljeListaPromisea.push(db.osoblje.create({
            ime: 'Neko',
            prezime: 'Nekic',
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
            kraj: '12:00'
        }));

        saleListaPromisea.push(db.sala.create({
            naziv: '1-11',
            zaduzenaOsoba: 1
        }));
        saleListaPromisea.push(db.sala.create({
            naziv: '1-15',
            zaduzenaOsoba: 2
        }));

        rezervacijeListaPromisea.push(db.rezervacija.create({
            termin: 1,
            sala: 1,
            osoba: 1
        }));
        rezervacijeListaPromisea.push(db.rezervacija.create({
            termin: 2,
            sala: 1,
            osoba: 3
        }));

        /*
        Promise.all(osobljeListaPromisea).then(function(osoblja){
            var nekoNekic = osoblja.filter(function(o){
                return (o.ime === 'Neko' && o.prezime ==='Nekic' && o.uloga === 'profesor');
            });
            var drugiNeko = osoblja.filter(function(o){
                return (o.ime === 'Drugi' && o.prezime ==='Neko' && o.uloga === 'asistent');
            });
            var testTest = osoblja.filter(function(o){
                return (o.ime === 'Test' && o.prezime ==='Test' && o.uloga === 'asistent');
            });

            saleListaPromisea.push(db.sala.create({
                naziv: '1-11',
                zaduzenaOsoba: 1
            }).then(function(s){
                s.setOsobljeSala([nekoNekic]);
                return new Promise(function(resolve, reject) {
                    resolve(s);
                });
            }));

            osobljeListaPromisea.push(db.osoblje.create({
                ime: 'Neko',
                prezime: 'Nekic',
                uloga: 'profesor'
            }).then(function(s){
                s.setOsobljeSala([nekaSala]);
                return new Promise(function(resolve, reject) {
                    resolve(s);
                });
            }));

        });
         */

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

app.get('/osobe.html', (req, res) => {
    var niz = [];
    db.osoblje.findAll().then(function (podaci) {
        for (var i = 0; i < podaci.length; i++) {
            var objekat = {
                id: podaci[i].id,
                ime: podaci[i].ime,
                prezime: podaci[i].prezime,
                uloga: podaci[i].uloga
            };
            niz.push(objekat);
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(niz));
    });
});

app.get('/zauzeca.json', (req, res) => {
    fs.readFile('zauzeca.json', (err, podaci) => {
        if (err) {
            res.writeHead(504, {'Content-Type': 'application/json'});
            throw err;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(podaci);
    });
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


app.post('/rezervacija.html', function (req, res) {
    let novoZauzece = req.body;
    fs.readFile('zauzeca.json', 'utf-8', function (err, data) {
        if (err) throw err;
        var zauzecaJson = JSON.parse(data);

        if (validirajNaServeru(zauzecaJson, novoZauzece) === true) {
            if (Object.keys(novoZauzece).length === 6)
                zauzecaJson.periodicna.push(novoZauzece);
            else
                zauzecaJson.vanredna.push(novoZauzece);

            fs.writeFile('zauzeca.json', JSON.stringify(zauzecaJson), 'utf-8', function (err) {
                if (err) throw err;
                console.log('Upisano novo zauzece!');
            });
            res.send("Uspjesno upisano");
        }
        // Ako je zauzeće upisano, kao odgovor sa servera vratite podatke o svim zauzećima uključujući i posljednje
        else {
            res.send({zauzecaJson: zauzecaJson, novoZauzece: novoZauzece});
        }
    })
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

app.listen(8080);
