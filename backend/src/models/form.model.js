import mongoose, { Schema } from "mongoose";

const formSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
    },
    zip: {
      type: String,
      required: [true, "ZIP code is required"],
      match: [/^\d{5,6}$/, "Please enter a valid ZIP code"],
    },
    agree: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Form", formSchema);
