import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: String,
    subject: String,
    message: String,
    read: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    threadId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);

export default Email;
