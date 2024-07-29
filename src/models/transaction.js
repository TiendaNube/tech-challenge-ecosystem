
const { v4: uuidv4 } = require('uuid');

const config = {
  tableName: 'transactions'
}

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
  description: {
    type: DataTypes.STRING,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  card_number: {
    type: DataTypes.CHAR(19),
    allowNull: false
  },
  card_holder: {
    type: DataTypes.CHAR(255),
    allowNull: false
  },
  card_expiration: {
    type: DataTypes.CHAR(7),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  card_cvv: {
    type: DataTypes.CHAR(3),
    allowNull: false
  },
  created_at: DataTypes.DATE
})

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'transactions',
    getFields(DataTypes),
    config
  )

  return model
}