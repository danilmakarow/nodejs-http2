import { ajv } from "./validators.mjs";

const loadEmployersQuerySchema = {
  type: "object",
  nullable: true,
  properties: {
    take: {
      type: "string",
      takeIsNumberString: true
    },
  },
  additionalProperties: false,
};

export const loadEmployersQueryValidator = ajv.compile(
  loadEmployersQuerySchema,
);
