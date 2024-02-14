import { DataTypes } from "sequelize";
import { sequelizeConnect } from "../configs/connect.js";

// Database connection
const db = sequelizeConnect();

// User model definition
export default () => {
  const EmailQueue = db.define(
    "Email_Queues", // Table name in the database
    {
      id: {
        type: DataTypes.INTEGER, // Integer data type
        primaryKey: true, // Primary key of the table
        autoIncrement: true, // Auto-increment the id
      },
      user_id: {
        type: DataTypes.INTEGER, // Integer data type
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT, // Text data type
        allowNull: false,
      },
    }
  );

  // Sync the User model with the database
  EmailQueue.sync({ force: process.env.NODE_ENV === "test" ? true : false });

  return EmailQueue;
};
