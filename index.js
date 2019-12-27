const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');


app.use('/css', express.static(path.join(__dirname + '/css')));
app.use('/slike', express.static(path.join(__dirname + '/slike')));
app.use('/js', express.static(path.join(__dirname + '/js')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


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

app.post('/rezervacija.html', function (req, res) {
    let novoZauzece = req.body;
    fs.readFile('zauzeca.json', 'utf-8', function(err, data) {
        if (err) throw err;
        var zauzecaJson = JSON.parse(data);
        if (Object.keys(novoZauzece).length === 6)
            zauzecaJson.periodicna.push(novoZauzece);
        else
            zauzecaJson.vanredna.push(novoZauzece);

        fs.writeFile('zauzeca.json', JSON.stringify(zauzecaJson), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Upisano novo zauzece!');
        });
        res.send("Uspjesno upisano");
        // todo - moguce je rezervisati periodicno van semestra - ISPRAVITI!
    })

});

app.listen(8080);

