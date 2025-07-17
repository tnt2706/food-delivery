import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    sentBy: { type: String, enum: ['user', 'bot', 'admin'], required: true },
    content: { type: String, default: '' },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default MessageModel;
