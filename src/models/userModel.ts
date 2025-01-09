import mongoose, { Schema,  Model } from 'mongoose';
import { UserTypes } from 'interface/user.interface';

const userSchema: Schema<UserTypes> = new Schema<UserTypes>(
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
const User: Model<UserTypes> = mongoose.model<UserTypes>('User', userSchema);
export default User;
