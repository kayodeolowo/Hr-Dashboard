import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Property from "../models/propertiesModels"
import { paginate, search } from "../helpers/paginate";

// Define the types for the request body
interface PropertyRequestBody {
  property_name: string;
  address: string;
  price: number;
  property_type: string;
  image?: string;
}

// Create a property
const createProperties = asyncHandler(async (req: Request, res: Response) => {
  const { property_name, address, price, property_type, image }: PropertyRequestBody = req.body;

  // Array to collect missing fields
  let missingFields: string[] = [];

  if (!property_name) missingFields.push("property_name");
  if (!address) missingFields.push("address");
  if (!price) missingFields.push("price");
  if (!property_type) missingFields.push("property_type");

  // Check for missing fields
  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`The following fields are required: ${missingFields.join(", ")}`);
  }

  // Create a new property
  const property = await Property.create({
    property_name,
    address,
    price,
    property_type,
    image,
  });

  res.status(201).json({
    status: "success",
    message: "Property created successfully",
    data: property,
  });
});

// Get properties
const getProperties = asyncHandler(async (req: Request, res: Response) => {
  // Extract query parameters with default values
  let {
    page = 1,
    pageSize = 10,
    search: searchTerm = "",
    propertyType,
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
    propertyType?: string;
  } = req.query;

  // Fetch all properties
  const allProperties = await Property.find().select("-__v").sort({ createdAt: -1 });

  // Filter by propertyType if provided
  const filteredProperties = propertyType
    ? allProperties.filter((property) => property.property_type === propertyType)
    : allProperties;

  // Apply search (by property_name and address)
  const searchedProperties = search(filteredProperties, searchTerm, ["property_name", "address"]);

  // Apply pagination
  const paginatedProperties = paginate(searchedProperties, page, pageSize);

  // Send response
  res.status(200).json({
    status: "success",
    message: "Properties fetched successfully",
    data: {
      properties: paginatedProperties.data,
      totalItems: paginatedProperties.totalItems,
      totalPages: paginatedProperties.totalPages,
      currentPage: paginatedProperties.currentPage,
    },
  });
});

// Get a property by ID
const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the property by ID
  const property = await Property.findById(id);

  // If the property is not found, return a 404 error
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Return the found property
  res.status(200).json({
    status: "success",
    message: "Property fetched successfully",
    data: property,
  });
});

export { createProperties, getProperties, getPropertyById };
