import { BaseCollection } from "./base.collection.mjs";
import { mongoService } from "../services/mongo.service.mjs";
import { parseEmployersRequestDataService } from "../services/parse-employers-request-data.service.mjs";
import { Collections } from "../constants/collections-constants.mjs";

class EmployersCollection extends BaseCollection {
  /**
   * @type {ParseEmployersRequestDataService}
   */
  #parseEmployersRequestDataService;

  #aggregateBasePipeline = [
    {
      $lookup: {
        from: "positions",
        localField: "positionId",
        foreignField: "_id",
        as: "position",
      },
    },
    {
      $unwind: "$position",
    },
    {
      $lookup: {
        from: "departments",
        localField: "position.departmentId",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $unwind: "$department",
    },
  ];

  /**
   * @param {MongoService} mongoService
   * @param {ParseEmployersRequestDataService} parseEmployersRequestDataService
   */
  constructor(mongoService, parseEmployersRequestDataService) {
    super(mongoService, Collections.EMPLOYERS);
    this.#parseEmployersRequestDataService = parseEmployersRequestDataService;
  }

  /**
   * @param {TParsedEmployersCursorOptions} cursorConfig
   * @return {import("mongodb").AggregationCursor}
   */
  createEmployersCursor(cursorConfig) {
    const aggregatePipelines = [...this.#aggregateBasePipeline];

    if (cursorConfig.filters) {
      const parsedFilters =
        this.#parseEmployersRequestDataService.parseFiltersToAggregateMatchObj(
          cursorConfig.filters,
        );
      aggregatePipelines.push({
        $match: parsedFilters,
      });
    }

    if (cursorConfig.sort) {
      const parsedSort =
        this.#parseEmployersRequestDataService.parseSortToAggregateSortObj(
          cursorConfig.sort,
        );
      aggregatePipelines.push({
        $sort: parsedSort,
      });
    }

    aggregatePipelines.push({
      $project: {
        _id: 1,
        name: 1,
        age: 1,
        position: "$position.name",
        department: "$department.name",
      },
    });

    return this._collection.aggregate(aggregatePipelines);
  }

  /**
   * @param {import("mongodb").AggregationCursor} cursor
   * @param {TParsedEmployersCursorOptions} cursorConfig
   * @return {import("mongodb").AggregationCursor}
   */
  updateEmployersCursor(cursor, cursorConfig) {
    try {
      if (cursorConfig.reset) {
        if (!cursor.closed) {
          cursor.rewind();
        } else {
          return this.createEmployersCursor(cursorConfig);
        }
      }

      if (cursorConfig.filters) {
        cursor.match(
          this.#parseEmployersRequestDataService.parseFiltersToAggregateMatchObj(
            cursorConfig.filters,
          ),
        );
      }

      if (cursorConfig.sort) {
        cursor.sort(
          this.#parseEmployersRequestDataService.parseSortToAggregateSortObj(
            cursorConfig.sort,
          ),
        );
      }

      return cursor;
    } catch (e) {
      return this.createEmployersCursor(cursorConfig);
    }
  }
}

export const employersCollection = new EmployersCollection(
  mongoService,
  parseEmployersRequestDataService,
);
