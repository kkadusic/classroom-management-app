var Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('termin', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        redovni: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        dan: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        datum: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        semestar: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pocetak: {
            type: Sequelize.TIME,
            allowNull: false,
        },
        kraj: {
            type: Sequelize.TIME,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        tableName: 'termin'
    });
};
