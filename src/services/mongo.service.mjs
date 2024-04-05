import {MongoClient, ServerApiVersion} from "mongodb";
import { DATABASE_NAME } from "../constants/database-constants.mjs";
import {Env} from "../constants/env.mjs";

class MongoService extends MongoClient {
  #dbName = DATABASE_NAME;
  /** @type {import("mongodb").Db} */
  database;

  constructor(url) {
    super(url, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    this.connect()
      .then(() => {
        console.log("MongoDB connected!")
        this.database = this.db(this.#dbName);
        this.emit("connection");
      })
      .catch((err) => console.log("MongoClient connection error:", err));
  }

  onConnect() {
    return new Promise((resolve) => {
      this.once("connection", () => resolve());
    });
  }
}

export const mongoService = new MongoService(Env.DATABASE_URL);

