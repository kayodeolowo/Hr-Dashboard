export const buildFilter = (query: any, filterFields: string[]): any => {
    const filter: any = {};
    filterFields.forEach((field) => {
      if (query[field]) filter[field] = query[field];
    });
    return filter;
  };
  