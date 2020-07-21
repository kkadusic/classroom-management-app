var Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('sala', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        naziv: {
            type: Sequelize.STRING,
            allowNull: false
        },
        zaduzenaOsoba: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'sala'
    });
};