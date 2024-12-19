import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Property model
interface IProperty extends Document {
  property_name: string;
  address: string;
  price: number;
  property_type: 'House' | 'Condo' | 'Apartment' | 'Land';
  image: string;
}

// Define the schema with proper types
const propertySchema: Schema<IProperty> = new mongoose.Schema(
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
const Property: Model<IProperty> = mongoose.model<IProperty>('Property', propertySchema);

export default Property;
