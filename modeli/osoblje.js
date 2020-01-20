var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('osoblje', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ime: {
            type: Sequelize.STRING,
            allowNull: false
        },
        prezime: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        uloga: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        tableName: 'osoblje'
    });
};