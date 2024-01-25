import mongoose from 'mongoose';

const instance = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const modelName = 'Account';

export default mongoose.model(modelName, instance);
