import { ajv } from "./validators.mjs";
import {Database} from "../constants/database-constants.mjs";

const postLoadEmployersOptionsBodySchema = {
  type: "object",
  nullable: true,
  properties: {
    take: { type: "number", minimum: Database.TAKE.MIN, maximum: Database.TAKE.MAX },
    reset: { type: "boolean" },
    sort: {
      type: "object",
      additionalProperties: { type: "number", enum: [-1, 1] },
    },
    filters: {
      type: "object",
      additionalProperties: {
        anyOf: [
          { type: "number" },
          { type: "boolean" },
          { type: "string" },
          {
            type: "object",
            minProperties: 1,
            properties: {
              $lte: { type: "number" },
              $gte: { type: "number" },
            },
            additionalProperties: false,
          },
        ],
      },
    },
  },
  additionalProperties: false,
};

export const postLoadEmployersOptionsBodyValidator = ajv.compile(postLoadEmployersOptionsBodySchema);
