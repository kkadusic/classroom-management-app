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
});


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

function validirajNaServeru(zauzecaJson, novoZauzece){
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
            for (var i = 0; i < zauzecaJson.vanredna.length; i++){
                let dan = parseInt(zauzecaJson.vanredna[i].datum.substr(0,2), 10);
                let mjesec = parseInt(zauzecaJson.vanredna[i].datum.substr(3,2), 10);
                let godina = parseInt(zauzecaJson.vanredna[i].datum.substr(6, 10), 10);
                let datum = new Date(godina, mjesec-1, dan);
                let indeksDana = (datum.getDay() + 6) % 7;
                let semestarVanrednog = "";
                if (mjesec-1 === 0 || mjesec-1 >= 9)
                    semestarVanrednog = "zimski";
                else if (mjesec-1 >= 1 && mjesec-1 <= 5)
                    semestarVanrednog = "ljetni";
                if (semestarVanrednog === novoZauzece.semestar && indeksDana === novoZauzece.dan &&
                    novoZauzece.pocetak < zauzecaJson.vanredna[i].kraj && zauzecaJson.vanredna[i].pocetak < novoZauzece.kraj &&
                    novoZauzece.naziv === zauzecaJson.vanredna[i].naziv){
                    return false;
                }
            }
        }
    }
    else {
        let dan = parseInt(novoZauzece.datum.substr(0,2), 10);
        let mjesec = parseInt(novoZauzece.datum.substr(3,2), 10);
        let godina = parseInt(novoZauzece.datum.substr(6, 10), 10);
        let datum = new Date(godina, mjesec-1, dan);
        let indeksDana = (datum.getDay() + 6) % 7;
        let semestarVanrednog = "";
        if (mjesec-1 === 0 || mjesec-1 >= 9)
            semestarVanrednog = "zimski";
        else if (mjesec-1 >= 1 && mjesec-1 <= 5)
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
        for (var i = 0; i < zauzecaJson.periodicna.length; i++){
            if (semestarVanrednog === zauzecaJson.periodicna[i].semestar && indeksDana === zauzecaJson.periodicna[i].dan &&
                novoZauzece.pocetak < zauzecaJson.periodicna[i].kraj && zauzecaJson.periodicna[i].pocetak < novoZauzece.kraj &&
                novoZauzece.naziv === zauzecaJson.periodicna[i].naziv){
                return false;
            }
        }
    }
    return true;
}


app.post('/rezervacija.html', function (req, res) {
    let novoZauzece = req.body;
    fs.readFile('zauzeca.json', 'utf-8', function(err, data) {
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
