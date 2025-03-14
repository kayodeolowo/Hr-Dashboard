import { Model, Document } from "mongoose";

interface PaginatedResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
  data: T[];
}

// Generic function for pagination
export const paginateQuery = async <T extends Document>(
  model: Model<T>,
  filter: any = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResult<T>> => {
  const skip = (page - 1) * pageSize;

  // Fetch paginated data
  const data = await model.find(filter).skip(skip).limit(pageSize);

  // Count total documents matching the filter
  const totalItems = await model.countDocuments(filter);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Check if there's a previous or next page
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    hasPrev,
    hasNext,
    data,
  };
};
