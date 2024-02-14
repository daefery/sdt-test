import { DataTypes } from "sequelize";
import { sequelizeConnect } from "../configs/connect.js";

// Database connection
const db = sequelizeConnect();

// User model definition
export default () => {
  const User = db.define(
    "Users", // Table name in the database
    {
      id: {
        type: DataTypes.INTEGER, // Integer data type
        primaryKey: true, // Primary key of the table
        autoIncrement: true, // Auto-increment the id
      },
      first_name: {
        type: DataTypes.STRING, // String data type
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING, // String data type
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING, // String data type
        allowNull: false,
      },
      timezone: {
        type: DataTypes.STRING, // String data type
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING, // String data type
        allowNull: false,
      },
      event_date: {
        type: DataTypes.JSON, // JSON data type for flexibel need
      },
    }
  );

  // Sync the User model with the database
  User.sync({ force: process.env.NODE_ENV === "test" ? true : false });

  return User;
};
