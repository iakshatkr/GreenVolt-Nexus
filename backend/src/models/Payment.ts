import { Schema, model, type Document, type Types } from 'mongoose';
import { PAYMENT_STATUS, type PaymentStatus } from '../constants/enums.js';

export interface IPayment extends Document {
  booking: Types.ObjectId;
  user: Types.ObjectId;
  station: Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerSessionId: string;
  method: string;
  invoiceNumber: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },
    provider: {
      type: String,
      default: 'stripe-mock'
    },
    providerSessionId: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: 'card'
    },
    invoiceNumber: {
      type: String,
      required: true
    },
    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const PaymentModel = model<IPayment>('Payment', paymentSchema);

