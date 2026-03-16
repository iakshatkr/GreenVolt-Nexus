import { Schema, model, type Document, type Types } from 'mongoose';
import {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  type BookingStatus,
  type PaymentStatus
} from '../constants/enums.js';

export interface IBooking extends Document {
  user: Types.ObjectId;
  station: Types.ObjectId;
  portNumber: number;
  startTime: Date;
  endTime: Date;
  energyRequestedKwh: number;
  estimatedAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    station: {
      type: Schema.Types.ObjectId,
      ref: 'ChargingStation',
      required: true
    },
    portNumber: {
      type: Number,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    energyRequestedKwh: {
      type: Number,
      required: true,
      min: 1
    },
    estimatedAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },
    invoiceNumber: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ station: 1, portNumber: 1, startTime: 1, endTime: 1 });

export const BookingModel = model<IBooking>('Booking', bookingSchema);

