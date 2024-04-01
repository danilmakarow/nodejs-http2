import { MongoClient } from "mongodb";
import { DATABASE_NAME } from "../constants/database-constants.mjs";

class MongoService extends MongoClient {
  #dbName = DATABASE_NAME;
  /** @type {import("mongodb").Db} */
  database;

  constructor(url) {
    super(url);
    this.connect()
      .then(() => {
        this.database = this.db(this.#dbName);
        this.emit("connectionReady");
      })
      .catch((err) => console.log("MongoClient connection error:", err));
  }

  onConnect() {
    return new Promise((resolve) => {
      this.once("connectionReady", () => resolve());
    });
  }
}

export const mongoService = new MongoService("mongodb://127.0.0.1:27017");
