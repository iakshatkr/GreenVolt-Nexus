import { StatusCodes } from 'http-status-codes';
import { BOOKING_STATUS, PAYMENT_STATUS, STATION_APPROVAL_STATUS } from '../constants/enums.js';
import { BookingModel } from '../models/Booking.js';
import { ChargingStationModel } from '../models/ChargingStation.js';
import { ApiError } from '../utils/apiError.js';

interface CreateBookingInput {
  userId: string;
  stationId: string;
  portNumber: number;
  startTime: string;
  endTime: string;
  energyRequestedKwh: number;
}

const createInvoiceNumber = () =>
  `GV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;

const resolveBookingStatus = (startTime: Date, endTime: Date) => {
  const now = new Date();

  if (endTime <= now) {
    return BOOKING_STATUS.COMPLETED;
  }

  if (startTime <= now && endTime > now) {
    return BOOKING_STATUS.ACTIVE;
  }

  return BOOKING_STATUS.PENDING;
};

export const bookingService = {
  async create(input: CreateBookingInput) {
    const station = await ChargingStationModel.findById(input.stationId);
    if (!station || station.approvalStatus !== STATION_APPROVAL_STATUS.APPROVED) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Approved charging station not found');
    }

    if (input.portNumber > station.chargingPorts || input.portNumber < 1) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Selected charging port does not exist');
    }

    const startTime = new Date(input.startTime);
    const endTime = new Date(input.endTime);

    if (
      Number.isNaN(startTime.getTime()) ||
      Number.isNaN(endTime.getTime()) ||
      startTime >= endTime
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid booking time range');
    }

    const overlappingBooking = await BookingModel.findOne({
      station: input.stationId,
      portNumber: input.portNumber,
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.ACTIVE] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (overlappingBooking) {
      throw new ApiError(StatusCodes.CONFLICT, 'This slot is already booked');
    }

    const estimatedAmount = Number((input.energyRequestedKwh * station.pricePerKwh).toFixed(2));

    const booking = await BookingModel.create({
      user: input.userId,
      station: input.stationId,
      portNumber: input.portNumber,
      startTime,
      endTime,
      energyRequestedKwh: input.energyRequestedKwh,
      estimatedAmount,
      status: resolveBookingStatus(startTime, endTime),
      paymentStatus: PAYMENT_STATUS.PENDING,
      invoiceNumber: createInvoiceNumber()
    });

    station.totalBookings += 1;
    await station.save();

    return BookingModel.findById(booking.id)
      .populate('station', 'name city address pricePerKwh')
      .populate('user', 'name email');
  },

  async getUserBookings(userId: string) {
    const bookings = await BookingModel.find({ user: userId })
      .populate('station', 'name city address pricePerKwh location')
      .sort({ startTime: -1 });

    await Promise.all(
      bookings.map(async (booking) => {
        const nextStatus = resolveBookingStatus(booking.startTime, booking.endTime);
        if (booking.status !== BOOKING_STATUS.CANCELLED && booking.status !== nextStatus) {
          booking.status = nextStatus;
          await booking.save();
        }
      })
    );

    return bookings;
  },

  async getOwnerBookings(ownerId: string) {
    const stations = await ChargingStationModel.find({ owner: ownerId }).select('_id');
    const stationIds = stations.map((station) => station._id);

    return BookingModel.find({ station: { $in: stationIds } })
      .populate('station', 'name city owner')
      .populate('user', 'name email city')
      .sort({ createdAt: -1 });
  },

  async markCompleted(bookingId: string) {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: BOOKING_STATUS.COMPLETED },
      { new: true }
    );

    if (!booking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found');
    }

    return booking;
  }
};

