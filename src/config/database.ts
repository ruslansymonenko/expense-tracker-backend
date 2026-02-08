import { Sequelize } from "sequelize-typescript";
import { config } from "./config";
import { User, Category, Expense } from "../models";

export const sequelize = new Sequelize({
  dialect: "mysql",
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  models: [User, Category, Expense],
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    socketPath: config.database.socketPath,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");

    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synchronized");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};
