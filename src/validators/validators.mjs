import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import ajvErrors from "ajv-errors";
import { ObjectId } from "mongodb";
import { validateStringNumber } from "../utils/validate-string-number.mjs";
import { Database } from "../constants/database-constants.mjs";

export const ajv = new Ajv({
  allowUnionTypes: true,
  allErrors: true, // Required true to work with ajvErrors
  removeAdditional: "failing",
});
ajvErrors(ajv);

ajvFormats(ajv);

ajv.addFormat("objectId", (data) => ObjectId.isValid(data));
ajv.addFormat("string-number", validateStringNumber(1, 20));
ajv.addKeyword({
  keyword: "instanceOf",
  type: ["object", "string"],
  $data: true,
  error: {
    message: (context) => {
      return `must be an instance of ${context.schema.name}`;
    },
  },
  errors: true,
  validateSchema: (schema) => {
    return typeof schema === "function";
  },
  validate: function (schema, data, parentSchema, dataCxt) {
    console.log(dataCxt.parentDataProperty);
    if (data instanceof schema) return true;
    try {
      const item = new schema(data);
      dataCxt.parentData[dataCxt.parentDataProperty] = item;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});

ajv.addKeyword({
  keyword: "takeIsNumberString",
  type: "string",
  validate: validateStringNumber(Database.TAKE.MIN, Database.TAKE.MAX),
  error: {
    message: `Value must be a number in range ${Database.TAKE.MIN}, ${Database.TAKE.MAX}`,
  },
});
