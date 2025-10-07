import { Schema, model, models } from "mongoose";

const VaultItemSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String }
  },
  { timestamps: true }
);

export default models.VaultItem || model("VaultItem", VaultItemSchema);
