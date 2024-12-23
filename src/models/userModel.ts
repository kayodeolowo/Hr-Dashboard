import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the User interface to represent the structure of the document
interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Please add the username"],
    },
    firstName: {
      type: String,
      required: [true, "Please add the first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add the last name"],
    },
    email: {
      type: String,
      required: [true, "Please add the email"],
      unique: [true, "Email address already registered"],
    },
    password: {
      type: String,
      required: [true, "Please add the password"],
    },
  confirmPassword: {
      type: String,
     
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the Mongoose model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
