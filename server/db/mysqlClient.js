'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = process.appConfig;
var dbClient;

function createDbClient() {
    if (!dbClient || typeof dbClient !== 'object') {
        dbClient = new Client(config.database);
    }
    return dbClient;
}


function Client(opts) {
    var _this = this;
    var db = {};
    var sequelize = new Sequelize(opts.database, opts.username, opts.password, opts);

    //read mysql entity table sync
    fs
        .readdirSync(__dirname + '/models')
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(function (file) {
            var model = sequelize['import'](path.join(__dirname + '/models', file));
            db[model.name] = model;
        });



    //build association
    Object.keys(db).forEach(function (modelName) {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    //sync model to mysql databse
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    db.sequelize.sync().then(function (result) {
        // Todo
    });

    return db;
}
module.exports = createDbClient;