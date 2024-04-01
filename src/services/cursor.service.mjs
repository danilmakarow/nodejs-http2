import { Database } from "../constants/database-constants.mjs";

class CursorService {
  /**
   * @param {import("mongodb").AggregationCursor} cursor
   * @param {number?} takeAmount
   * @return {Promise<*[]>}
   */
  async takeFromCursor(cursor, takeAmount) {
    if (cursor.closed) {
      return null;
    }

    let take = takeAmount;
    if (!take || take > Database.TAKE.MAX) {
      take = Database.TAKE.DEFAULT;
    }

    const data = [];

    while (data.length < take) {
      const document = await cursor.next();
      if (!document) {
        await cursor.close();
        break;
      }
      data.push(document);
    }

    return data;
  }
}

export const cursorService = new CursorService();
