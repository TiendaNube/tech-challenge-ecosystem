import { DataTypes, Model, Sequelize } from "sequelize";
import { PGDatabase } from "./connection";

export class TransactionModel extends Model {
  static load() {
    const sequelize: Sequelize = PGDatabase.databaseInstance().sequelize;

    TransactionModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.STRING,
          field: "payment_method",
          allowNull: false,
        },
        cardNumber: {
          type: DataTypes.STRING,
          field: "card_number",
          allowNull: false,
        },
        cardHolder: {
          type: DataTypes.STRING,
          field: "card_holder",
          allowNull: false,
        },
        cardExpirationDate: {
          type: DataTypes.STRING,
          field: "card_expiration_date",
          allowNull: false,
        },
        cardCVV: {
          type: DataTypes.STRING,
          field: "card_cvv",
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "transactions",
        createdAt: false,
        updatedAt: false,
        modelName: "Transaction",
      }
    );
  }
}
