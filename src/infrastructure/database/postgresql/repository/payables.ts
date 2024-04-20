import { DataTypes, Model, Sequelize } from "sequelize";
import { PGDatabase } from "./connection";
import { TransactionModel } from "./transactions";

export class PayableModel extends Model {
  static load() {
    const sequelize: Sequelize = PGDatabase.databaseInstance().sequelize;

    PayableModel.init(
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        transactionId: {
          type: DataTypes.BIGINT,
          field: "transaction_id",
          references: {
            model: "Transaction",
            key: "id",
          },
        },
        merchantId: {
          type: DataTypes.STRING,
          field: "merchant_id",
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        subtotal: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        discount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        total: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        createDate: {
          type: DataTypes.DATE,
          field: "create_date",
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "payables",
        createdAt: false,
        updatedAt: false,
        modelName: "PAYABLE",
      }
    );
    PayableModel.hasMany(TransactionModel);
  }
}
