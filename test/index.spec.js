const supertest = require("supertest");
const app = require("../index.js");

/**
 * Za pokretanje testova -> npm test (u root direktoriju)
 */

function odlozi(interval) {
    return it('Cekanje da se baza napuni', done => {
        setTimeout(() => done(), interval)
    }).timeout(interval + 100) // +100ms za garanciju da nece test pasti zbog "exceeded timeout"
}

odlozi(500);


describe("GET /osoblje", function () {
    it("GET /osoblje - citanje osoblja iz baze (status code 200)", function (done) {
        supertest(app)
            .get("/osoblje")
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
});

describe("POST /rezervacija.html", function () {
    it("POST /rezervacija.html - slanje zauzeca (status code 200)", function (done) {
        supertest(app)
            .post("/rezervacija.html")
            .send({
                datum: "15.11.2019",
                pocetak: "12:00",
                kraj: "15:00",
                naziv: "0-01",
                predavac: "Test Testic asistent"
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
});

describe("GET /zauzeca.json", function () {
    it("GET /zauzeca.json - citanje zauzeca iz baze (status code 200)", function (done) {
        supertest(app)
            .get("/zauzeca.json")
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
});

describe("POST /rezervacija.html", function () {
    it("POST /rezervacija.html - uspjesno upisivanje zauzeca u bazu", function (done) {
        supertest(app)
            .post("/rezervacija.html")
            .send({
                datum: "15.11.2019",
                pocetak: "12:00",
                kraj: "15:00",
                naziv: "0-01",
                predavac: "Test Testic asistent"
            })
            .expect(function (res) {
                res.body = 'Uspjesno upisano';
            })
            .expect(200, "Uspjesno upisano", done);
    });
});

describe("GET /sale", function () {
    it("GET /sale - dohvatanje svih sala (status code 200)", function (done) {
        supertest(app)
            .get("/sale")
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
});

describe("POST /rezervacija.html", function () {
    it("POST /rezervacija.html - preklapanje prilikom dodavanja vanrednog zauzeca", function (done) {
        supertest(app)
            .post("/rezervacija.html")
            .send({
                datum: "01.01.2020",
                pocetak: "09:00",
                kraj: "19:00",
                naziv: "1-11",
                predavac: "Neko Nekic profesor"
            })
            .expect(function (res) {
                res.body = {
                    ime: "Neko",
                    prezime: "Nekić",
                    uloga: "profesor"
                };
            })
            .expect(200, {
                ime: "Neko",
                prezime: "Nekić",
                uloga: "profesor"
            }, done);
    });
});


describe("POST /rezervacija.html", function () {
    it("POST /rezervacija.html - preklapanje prilikom dodavanja periodicnog zauzeca", function (done) {
        supertest(app)
            .post("/rezervacija.html")
            .send({
                dan: 0,
                semestar: "zimski",
                pocetak: "09:00",
                kraj: "19:00",
                naziv: "1-11",
                predavac: "Test Test asistent"
            })
            .expect(function (res) {
                res.body = {
                    ime: "Neko",
                    prezime: "Nekić",
                    uloga: "profesor"
                };
            })
            .expect(200, {
                ime: "Neko",
                prezime: "Nekić",
                uloga: "profesor"
            }, done);
    });
});


describe("GET /osoblje", function () {
    it("GET /osoblje - citanje osoblja iz baze, JSON niz (status code 200)", function (done) {
        supertest(app)
            .get("/osoblje")
            .expect(function (res) {
                res.body = [{
                    id: 1,
                    ime: 'Neko',
                    prezime: 'Nekić',
                    uloga: 'profesor'
                }, {
                    id: 2,
                    ime: "Drugi",
                    prezime: "Neko",
                    uloga: "asistent"
                }, {
                    id: 3,
                    ime: "Test",
                    prezime: "Test",
                    uloga: "asistent"
                }];
            })
            .expect(200, [{
                id: 1,
                ime: 'Neko',
                prezime: 'Nekić',
                uloga: 'profesor'
            }, {
                id: 2,
                ime: "Drugi",
                prezime: "Neko",
                uloga: "asistent"
            }, {
                id: 3,
                ime: "Test",
                prezime: "Test",
                uloga: "asistent"
            }], done);
    });
});

describe("GET /sale", function () {
    it("GET /sale - dohvatanje svih sala JSON objekat (status code 200)", function (done) {
        supertest(app)
            .get("/sale")
            .expect(function (res) {
                res.body = [{"id":1,"naziv":"1-11","zaduzenaOsoba":1},{"id":2,"naziv":"1-15","zaduzenaOsoba":2}];
            })
            .expect(200, [{"id":1,"naziv":"1-11","zaduzenaOsoba":1},{"id":2,"naziv":"1-15","zaduzenaOsoba":2}], done);
    });
});

describe("GET /zauzecea", function () {
    it("GET /zauzeca - dohvatanje svih zauzeca JSON objekat (status code 200)", function (done) {
        supertest(app)
            .get("/zauzeca.json")
            .expect(function (res) {
                res.body = {"periodicna":[{"dan":0,"semestar":"zimski","pocetak":"13:00:00","kraj":"14:00:00","naziv":"1-11","predavac":"Test Test asistent"}],
                    "vanredna":[{"datum":"01.01.2020","pocetak":"12:00:00","kraj":"13:00:00","naziv":"1-11","predavac":"Neko Nekić profesor"}]}
            })
            .expect(200, {"periodicna":[{"dan":0,"semestar":"zimski","pocetak":"13:00:00","kraj":"14:00:00","naziv":"1-11","predavac":"Test Test asistent"}],
                "vanredna":[{"datum":"01.01.2020","pocetak":"12:00:00","kraj":"13:00:00","naziv":"1-11","predavac":"Neko Nekić profesor"}]}, done);
    });
});
