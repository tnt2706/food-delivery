import mongoose from 'mongoose';
const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 }, // sửa Type -> type
    branch: { type: String, required: true },
    status: { type: String, default: 'pending' }, // pending, approved, canceled
    message: { type: String, required: false, trim: true },
    processedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    reason: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
  }
);

const reservationModel = mongoose.models.reservation ||
  mongoose.model('reservation', reservationSchema);

export default reservationModel;