import { Schema, model, type Document, type Types } from 'mongoose';

export interface IEnergyUsage extends Document {
  station: Types.ObjectId;
  booking: Types.ObjectId;
  solarGeneratedKwh: number;
  gridDrawKwh: number;
  totalDeliveredKwh: number;
  carbonSavedKg: number;
  sessionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const energyUsageSchema = new Schema<IEnergyUsage>(
  {
    station: {
      type: Schema.Types.ObjectId,
      ref: 'ChargingStation',
      required: true
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    solarGeneratedKwh: {
      type: Number,
      required: true
    },
    gridDrawKwh: {
      type: Number,
      required: true
    },
    totalDeliveredKwh: {
      type: Number,
      required: true
    },
    carbonSavedKg: {
      type: Number,
      required: true
    },
    sessionDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const EnergyUsageModel = model<IEnergyUsage>('EnergyUsage', energyUsageSchema);
