import { Dialect, Sequelize } from "sequelize";

export class PGDatabase {
  _sequelize: Sequelize;
  static _databaseInstance: PGDatabase | null = null;

  constructor(sequelize: Sequelize) {
    this._sequelize = sequelize;
  }

  get sequelize() {
    return this._sequelize;
  }

  static databaseInstance() {
    if (PGDatabase._databaseInstance != null) {
      return PGDatabase._databaseInstance;
    }

    const hostName = process.env.DB_HOST;
    const hostPort = Number(process.env.DB_PORT);
    const userName = process.env.DB_USER as string;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB as string;
    const dialect = process.env.DB_DIALECT as string;

    const sequelize = new Sequelize(database, userName, password, {
      host: hostName,
      port: hostPort,
      dialect: dialect as Dialect,
      pool: {
        max: 10,
        min: 0,
        acquire: 20000,
        idle: 5000,
      },
    });

    PGDatabase._databaseInstance = new PGDatabase(sequelize);

    return PGDatabase._databaseInstance;
  }
}
