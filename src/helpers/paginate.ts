type PaginateResult = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    data: any[];
  };
  
  const paginate = (data: any[], page: number, pageSize: number): PaginateResult => {
    page = parseInt(page.toString());
    pageSize = parseInt(pageSize.toString());
  
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (page - 1) * pageSize;
    const paginatedData = data.slice(skip, skip + pageSize);
  
    return {
      totalItems,
      totalPages,
      currentPage: page,
      data: paginatedData
    };
  };
  
  const search = (data: any[], searchTerm: string, fields: string[]): any[] => {
    if (!searchTerm) return data;
  
    const regex = new RegExp(searchTerm, 'i');
    return data.filter(item =>
      fields.some(field => regex.test(item[field]?.toString() || ''))
    );
  };
  
  export { paginate, search };
  