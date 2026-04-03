import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../entity/Task";
import * as dotenv from "dotenv";

dotenv.config();

const isProd = Boolean(process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: "postgres",
  ...(isProd
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "taskuser",
        password: process.env.DB_PASSWORD || "taskpassword",
        database: process.env.DB_DATABASE || "taskdb",
      }),
  ssl: isProd ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [Task],
  migrations: [],
  subscribers: [],
});
