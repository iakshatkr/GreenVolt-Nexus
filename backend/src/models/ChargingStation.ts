import { Schema, model, type Document, type Types } from 'mongoose';
import {
  STATION_APPROVAL_STATUS,
  type StationApprovalStatus
} from '../constants/enums.js';

interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

interface IOperatingHours {
  open: string;
  close: string;
}

interface IAvailabilityWindow {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IChargingStation extends Document {
  owner: Types.ObjectId;
  name: string;
  description: string;
  city: string;
  address: string;
  location: ILocation;
  solarCapacityKw: number;
  chargingPorts: number;
  connectorTypes: string[];
  pricePerKwh: number;
  amenities: string[];
  operatingHours: IOperatingHours;
  availability: IAvailabilityWindow[];
  approvalStatus: StationApprovalStatus;
  totalBookings: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const stationSchema = new Schema<IChargingStation>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    solarCapacityKw: {
      type: Number,
      required: true,
      min: 0
    },
    chargingPorts: {
      type: Number,
      required: true,
      min: 1
    },
    connectorTypes: {
      type: [String],
      default: []
    },
    pricePerKwh: {
      type: Number,
      required: true,
      min: 0
    },
    amenities: {
      type: [String],
      default: []
    },
    operatingHours: {
      open: { type: String, required: true },
      close: { type: String, required: true }
    },
    availability: [
      {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ],
    approvalStatus: {
      type: String,
      enum: Object.values(STATION_APPROVAL_STATUS),
      default: STATION_APPROVAL_STATUS.PENDING
    },
    totalBookings: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5
    }
  },
  {
    timestamps: true
  }
);

stationSchema.index({ location: '2dsphere' });

export const ChargingStationModel = model<IChargingStation>('ChargingStation', stationSchema);

