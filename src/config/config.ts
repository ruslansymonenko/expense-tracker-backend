import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number.parseInt(process.env.PORT || "3000"),
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-in-production",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string | number,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "expense_tracker",
  },
};
