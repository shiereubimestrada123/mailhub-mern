import mongoose from "mongoose";

const instance = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
    },
    mailbox: {
      inbox: [{ type: mongoose.Schema.Types.ObjectId, ref: "Email" }],
      outbox: [{ type: mongoose.Schema.Types.ObjectId, ref: "Email" }],
      drafts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Email" }],
      trash: [{ type: mongoose.Schema.Types.ObjectId, ref: "Email" }],
    },
  },
  {
    timestamps: true,
  }
);

const modelName = "Account";

export default mongoose.model(modelName, instance);
