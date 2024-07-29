const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config()
const {
    forEachObjIndexed,
} = require('ramda')


const models = {}
module.exports.models = models

const {
    DATABASE_DATABASE,
    DATABASE_DIALECT,
    DATABASE_HOST,
    DATABASE_PASSWORD,
    DATABASE_USERNAME,
} = process.env

const sequelizeConfig = {
    database: DATABASE_DATABASE,
    dialect: DATABASE_DIALECT,
    host: DATABASE_HOST,
    logging: false,
    define: {
        timestamps: false, // Disable timestamps globally
        createdAt: false, // Disable createdAt globally
        updatedAt: false, // Disable updatedAt globally
        deletedAt: 'deleted_at',
    },
    password: DATABASE_PASSWORD,
    pool: {
        acquire: 20000,
        handleDisconnects: true,
        idle: 60000,
    },
    username: DATABASE_USERNAME,
}
const sequelize = new Sequelize(
    DATABASE_DATABASE,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    sequelizeConfig
);

const modelDefinitions = require('./models');
forEachObjIndexed(
    (entity, name) => {
        const model = entity(sequelize, DataTypes);
        models[name] = model;
    },
    modelDefinitions
);

forEachObjIndexed((entity) => {
    if (entity.associate) {
        entity.associate(models);
    }
}, models);

module.exports.operators = Sequelize.Op;
module.exports.sequelize = sequelize;
module.exports.connect = (logger) => {
    return sequelize.authenticate()
        .then(() => console.log('Successfully connected to database'))
        .catch((error) => console.log('Failed to connect to postgres', error));
};