import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  userId: string;
  messages: { role: string; content: string }[];
  createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true },
  messages: [
    {
      role: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);