const config = {
    tableName: 'merchants'
}

const { v4: uuidv4 } = require('uuid');

const getFields = DataTypes => ({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: uuidv4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
        'merchants',
        getFields(DataTypes),
        config
    )

    return model
}