export class BaseCollection {
  /**
   * @type {import("mongodb").Collection}
   */
  _collection;

  /**
   * @param {MongoService} mongoService
   * @param {string} collectionName
   */
  constructor(mongoService, collectionName) {
    mongoService
      .onConnect()
      .then(
        () => (this._collection = mongoService.database.collection(collectionName)),
      )
  }
}
