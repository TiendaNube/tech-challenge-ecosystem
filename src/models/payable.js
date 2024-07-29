const config = {
    tableName: 'payables'
}
const { v4: uuidv4 } = require('uuid');

const getFields = DataTypes => ({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: uuidv4
    },
    merchant_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    fee: {
        type: DataTypes.DECIMAL(10, 2),
    },
    status: {
        type: DataTypes.CHAR(255),
        allowNull: false
    },
    payment_date: DataTypes.DATE,
    created_at: DataTypes.DATE
})

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
        'payables',
        getFields(DataTypes),
        config
    )

    return model
}
