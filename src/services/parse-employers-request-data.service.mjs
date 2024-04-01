class ParseEmployersRequestDataService {
  /**
   * @param {Object.<string, unknown>} filters
   */
  parseFiltersToAggregateMatchObj(filters) {
    const parsedFilters = {};

    if(filters.age) {
      parsedFilters.age = filters.age;
    }

    if(filters.name) {
      parsedFilters.name = { $regex: filters.name, $options: "i" };
    }

    if(filters.department) {
      parsedFilters["department.name"] = { $regex: filters.department, $options: "i" };
    }

    if(filters.position) {
      parsedFilters["position.name"] = { $regex: filters.position, $options: "i" };
    }

    return parsedFilters;
  }
  /**
   * @param {Object.<string, unknown>} sort
   */
  parseSortToAggregateSortObj(sort) {
    const parsedSort = {
          ...(sort.age && { age: sort.age } ),
          ...(sort.name && { name: sort.name } ),
          ...(sort.position && { "position.name": sort.position } ),
          ...(sort.department && { "department.name": sort.department } ),
    };
    return parsedSort;
  }
}

export const parseEmployersRequestDataService = new ParseEmployersRequestDataService();
