import mongoose, { Schema, Document, Model } from 'mongoose';
import { PropertyTypes } from 'interface/property.intrface';


// Define the schema with proper types
const propertySchema: Schema<PropertyTypes> = new mongoose.Schema(
  {
    property_name: {
      type: String,
      required: [true, "Please add the property name"],
    },
    address: {
      type: String,
      required: [true, "Please add the address"],
    },
    price: {
      type: Number,
      required: [true, "Please add the price"],
    },
    property_type: {
      type: String,
      enum: ["House", "Condo", "Apartment", "Land"],
      required: [true, "Please add the property type"],
    },
    image: {
      type: String,
      required: [true, "Please add an image URL"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the Property model with proper typing
const Property: Model<PropertyTypes> = mongoose.model<PropertyTypes>('Property', propertySchema);

export default Property;
