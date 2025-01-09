import  Document  from 'mongoose';

// Define an interface for the Property model
export interface PropertyTypes extends Document {
  property_name: string;
  address: string;
  price: number;
  property_type: 'House' | 'Condo' | 'Apartment' | 'Land';
  image: string;
}