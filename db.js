const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19", "root", "root", {
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false
});
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import modela
db.osoblje = sequelize.import(__dirname + '/modeli/osoblje.js');
db.rezervacija = sequelize.import(__dirname + '/modeli/rezervacija.js');
db.termin = sequelize.import(__dirname + '/modeli/termin.js');
db.sala = sequelize.import(__dirname + '/modeli/sala.js');

// Relacije
db.osoblje.hasMany(db.rezervacija, {
    as: 'rezervacijaOsoblje',
    foreignKey: 'osoba'
});

db.rezervacija.belongsTo(db.termin, {
    as: 'terminRezervacija',
    foreignKey: 'termin'
});

db.sala.hasMany(db.rezervacija, {
    as: 'rezervacijaSala',
    foreignKey: 'sala'
});

db.sala.belongsTo(db.osoblje, {
    as: 'osobljeSala',
    foreignKey: 'zaduzenaOsoba'
});

module.exports = db;