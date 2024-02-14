import { Sequelize } from "sequelize";

/**
 * Establishes a connection to SQLite database using Sequelize.
 @returns {Sequelize} A connected Sequelize instance.
 */
export function sequelizeConnect() {
  const db = new Sequelize("database", "username", "password", {
    host: process.env.NODE_ENV === "TEST" ? "./test.sqlite" : "./dev.sqlite",
    dialect: "sqlite",
    logging: false,
  });
  return db;
}
