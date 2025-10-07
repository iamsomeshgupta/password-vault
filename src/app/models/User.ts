import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  vaultSalt: { type: String, required: true }
});

export default models.User || model("User", UserSchema);
