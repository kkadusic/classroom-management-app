var Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('rezervacija', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        termin: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        sala: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        osoba: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        tableName: 'rezervacija'
    });
};
