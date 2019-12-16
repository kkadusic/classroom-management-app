let assert = chai.assert;
describe('Kalendar', function() {
    describe('iscrtajKalendar()', function() {

        it('Pozivanje iscrtajKalendar za mjesec sa 30 dana:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10); //Novembar
            let polja = document.getElementsByClassName("slobodna");
            assert.equal(polja.length, 30, "Očekivano je da se prikaže 30 dana");
        });

        it('Pozivanje iscrtajKalendar za mjesec sa 31 dan:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 9); //Oktobar
            let polja = document.getElementsByClassName("slobodna");
            assert.equal(polja.length, 31, "Očekivano je da se prikaže 31 dan");
        });

        it('Pozivanje iscrtajKalendar za trenutni mjesec:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10); //Novembar
            let dan = document.getElementsByClassName("kalendarBroj")[4].textContent;
            assert.equal(" 1  ", dan, "Očekivano je da je 1. dan u petak");
        });

        it('Pozivanje iscrtajKalendar za trenutni mjesec:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10); //Novembar
            let dan = document.getElementsByClassName("kalendarBroj")[33].textContent;
            assert.equal(" 30  ", dan, "Očekivano je da je 30. dan u subotu");
        });

        it('Pozivanje iscrtajKalendar za januar:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 0); //Januar
            let brojDana = document.getElementsByClassName("slobodna");
            let prviDan = document.getElementsByClassName("kalendarBroj")[1].textContent;
            let zadnjiDan = document.getElementsByClassName("kalendarBroj")[31].textContent;
            assert.equal(brojDana.length, 31, "Očekivano je da se prikaže 31 dan");
            assert.equal(" 1  ", prviDan, "Očekivano je da je 1. dan u utorak");
            assert.equal(" 31  ", zadnjiDan, "Očekivano je da je 30. dan u subotu");
        });

        it('Pozivanje iscrtajKalendar za juni:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 5); //Juni
            let brojDana = document.getElementsByClassName("slobodna");
            let prviDan = document.getElementsByClassName("kalendarBroj")[5].textContent;
            let zadnjiDan = document.getElementsByClassName("kalendarBroj")[34].textContent;
            assert.equal(brojDana.length, 30, "Očekivano je da se prikaže 30 dana");
            assert.equal(" 1  ", prviDan, "Očekivano je da je 1. dan u subotu");
            assert.equal(" 30  ", zadnjiDan, "Očekivano je da je 30. dan u nedjelju");
        });

        it('Pozivanje iscrtajKalendar za septembar:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 8); //Septembar
            let brojDana = document.getElementsByClassName("slobodna");
            let prviDan = document.getElementsByClassName("kalendarBroj")[6].textContent;
            let zadnjiDan = document.getElementsByClassName("kalendarBroj")[35].textContent;
            assert.equal(brojDana.length, 30, "Očekivano je da se prikaže 30 dana");
            assert.equal(" 1  ", prviDan, "Očekivano je da je 1. dan u nedjelju");
            assert.equal(" 30  ", zadnjiDan, "Očekivano je da je 30. dan u ponedjeljak");
        });

    });


    describe('iscrtajKalendar(), ucitajPodatke()', function() {

        it('Pozivanje obojiZauzeca kada podaci nisu učitani:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";
            let mjesec = new Date().getMonth();
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), mjesec);
            let brojDanaMjeseca = 32 - new Date(2019, mjesec, 32).getDate();
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "", "", "");
            let polja = document.getElementsByClassName("slobodna");
            assert.equal(polja.length, brojDanaMjeseca, "Očekivana vrijednost da se ne oboji niti jedan dan");
        });


        it('Pozivanje obojiZauzeca gdje u zauzećima postoje duple vrijednosti za zauzeće istog termina:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";

            var redovna = [{
                    dan: 1,
                    semestar: "ljetni",
                    pocetak: "11:00",
                    kraj: "15:00",
                    naziv: "A3",
                    predavac: "John"
                },
                {
                    dan: 3,
                    semestar: "zimski",
                    pocetak: "11:00",
                    kraj: "15:00",
                    naziv: "A1",
                    predavac: "Anna"
                }
            ];

            var vanredna = [{
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                }
            ];
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            var x = document.getElementsByClassName("kalendarBroj")[30];
            var y = x.children[1].className;
            assert.equal(y, "zauzeta", "Očekivano je da se dan oboji bez obzira što postoje duple vrijednosti");

        });


        it('Pozivanje obojiZauzece kada u podacima postoji periodično zauzeće za drugi semestar:', function() {
            var redovna = [{
                dan: 2,
                semestar: "ljetni",
                pocetak: "11:00",
                kraj: "15:00",
                naziv: "A2",
                predavac: "John"
            }];

            var vanredna = [{
                datum: "25.8.2019",
                pocetak: "09:00",
                kraj: "10:00",
                naziv: "0-05",
                predavac: "John"
            }];

            Kalendar.ucitajPodatke(redovna, vanredna);
            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");

            let polja = document.getElementsByClassName("slobodna");
            assert.equal(polja.length, 30, "Očekivano je da se ne oboji zauzeće");

        });

        it('Dva puta uzastopno pozivanje obojiZauzece:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";

            var redovna = [{
                dan: 1,
                semestar: "ljetni",
                pocetak: "11:00",
                kraj: "15:00",
                naziv: "A3",
                predavac: "John"
            }];

            var vanredna = [{
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                }
            ];
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            var x = document.getElementsByClassName("kalendarBroj")[30];
            var y = x.children[1].className;
            assert.equal(y, "zauzeta", "Očekivano je da boja zauzeća ostane ista");
        });


        it('Pozivanje obojiZauzece kada su u podacima svi termini u mjesecu zauzeti:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";

            var redovna = [{
                    dan: 1,
                    semestar: "ljetni",
                    pocetak: "11:00",
                    kraj: "15:00",
                    naziv: "A3",
                    predavac: "John"
                },
                {
                    dan: 3,
                    semestar: "zimski",
                    pocetak: "11:00",
                    kraj: "15:00",
                    naziv: "A1",
                    predavac: "Anna"
                }
            ];

            var vanredna = [{
                    datum: "01.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "02.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "03.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "04.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "05.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "06.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "07.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "08.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "09.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "10.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "11.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "12.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "13.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "14.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "15.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "16.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "17.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "18.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "19.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "20.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "21.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "22.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "23.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "24.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "25.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "26.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "27.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "28.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "29.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "30.04.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                }
            ];
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 3);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), 3, "A2", "12:00", "15:00");

            let polja = document.getElementsByClassName("slobodna");
            assert.equal(polja.length, 0, "Očekivano je da se svi dani oboje");

        });


        it('Pozivanje ucitajPodatke, obojiZauzeca, ucitajPodatke - drugi podaci, obojiZauzeca:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";

            var redovna = [{
                dan: 1,
                semestar: "ljetni",
                pocetak: "11:00",
                kraj: "15:00",
                naziv: "A3",
                predavac: "John"
            }];

            var vanredna = [{
                datum: "10.06.2019",
                pocetak: "12:00",
                kraj: "15:00",
                naziv: "A2",
                predavac: "John"
            }];
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 5);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), 5, "A2", "11:00", "15:00");

            document.getElementById("kalendarDatum").innerHTML = "";
            var redovna = [{
                dan: 1,
                semestar: "ljetni",
                pocetak: "11:00",
                kraj: "15:00",
                naziv: "A3",
                predavac: "John"
            }];

            var vanredna = [{
                datum: "12.03.2019",
                pocetak: "12:00",
                kraj: "15:00",
                naziv: "0-06",
                predavac: "John"
            }];
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 2);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), 2, "0-06", "11:00", "15:00");

            var x = document.getElementsByClassName("kalendarBroj")[15];
            var y = x.children[1].className;
            assert.equal(y, "zauzeta", "Očekivano da se zauzeća iz prvih podataka ne ostanu obojena, tj. primjenjuju se samo posljednje učitani podaci");


        });



        it('Pozivanje obojiZauzece kada u podacima postoji zauzeće termina, ali u drugom mjesecu:', function() {
            var redovna = [{
                dan: 2,
                semestar: "ljetni",
                pocetak: "11:00",
                kraj: "15:00",
                naziv: "0-03",
                predavac: "John"
            }];

            var vanredna = [{
                datum: "15.09.2019",
                pocetak: "12:00",
                kraj: "15:00",
                naziv: "A1",
                predavac: "Anna"
            }];

            document.getElementById("kalendarDatum").innerHTML = "";
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 9);
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), 9, "A1", "12:00", "15:00");

            let polja = document.getElementsByClassName("slobodna");
            assert.equal(polja.length, 31, "Očekivano je da se ne oboji zauzeće");
        });



        it('Pet puta uzastopno pozivanje obojiZauzece:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";

            var redovna = [{
                dan: 1,
                semestar: "ljetni",
                pocetak: "11:00",
                kraj: "15:00",
                naziv: "A3",
                predavac: "John"
            }];

            var vanredna = [{
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                }
            ];
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            var x = document.getElementsByClassName("kalendarBroj")[30];
            var y = x.children[1].className;
            assert.equal(y, "zauzeta", "Očekivano je da boja zauzeća ostane ista");
        });



        it('Pozivanje obojiZauzeca kada u zauzećima postoje troduple vrijednosti za zauzeće istog termina:', function() {
            document.getElementById("kalendarDatum").innerHTML = "";

            var redovna = [{
                    dan: 1,
                    semestar: "ljetni",
                    pocetak: "11:00",
                    kraj: "15:00",
                    naziv: "A3",
                    predavac: "John"
                },
                {
                    dan: 3,
                    semestar: "zimski",
                    pocetak: "11:00",
                    kraj: "15:00",
                    naziv: "A1",
                    predavac: "Anna"
                }
            ];

            var vanredna = [{
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                },
                {
                    datum: "27.11.2019",
                    pocetak: "12:00",
                    kraj: "15:00",
                    naziv: "A2",
                    predavac: "John"
                }
            ];
            Kalendar.ucitajPodatke(redovna, vanredna);
            Kalendar.iscrtajKalendar(document.getElementById("kalendarDatum"), 10);
            Kalendar.obojiZauzeca(document.getElementById("kalendarMjesec"), Kalendar.dajMjesec(), "A2", "12:00", "15:00");
            var x = document.getElementsByClassName("kalendarBroj")[30];
            var y = x.children[1].className;
            assert.equal(y, "zauzeta", "Očekivano je da se dan oboji bez obzira što postoje duple vrijednosti");

        });



    });

});