import { StatusCodes } from 'http-status-codes';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/enums.js';
import { BookingModel } from '../models/Booking.js';
import { EnergyUsageModel } from '../models/EnergyUsage.js';
import { PaymentModel } from '../models/Payment.js';
import { ApiError } from '../utils/apiError.js';

const randomSessionId = () => `sess_${Math.random().toString(36).slice(2, 12)}`;

export const paymentService = {
  async checkout(bookingId: string, userId: string) {
    const booking = await BookingModel.findById(bookingId);
    if (!booking || booking.user.toString() !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found');
    }

    const existingPayment = await PaymentModel.findOne({ booking: bookingId });
    if (existingPayment?.status === PAYMENT_STATUS.SUCCEEDED) {
      return existingPayment;
    }

    const payment =
      existingPayment ??
      (await PaymentModel.create({
        booking: booking._id,
        user: booking.user,
        station: booking.station,
        amount: booking.estimatedAmount,
        currency: 'INR',
        provider: 'stripe-mock',
        providerSessionId: randomSessionId(),
        method: 'card',
        invoiceNumber: booking.invoiceNumber
      }));

    payment.status = PAYMENT_STATUS.SUCCEEDED;
    payment.paidAt = new Date();
    await payment.save();

    booking.paymentStatus = PAYMENT_STATUS.SUCCEEDED;
    booking.status = booking.startTime <= new Date() ? BOOKING_STATUS.ACTIVE : BOOKING_STATUS.PENDING;
    await booking.save();

    const solarDelivered = Number((booking.energyRequestedKwh * 0.72).toFixed(2));
    const gridDelivered = Number((booking.energyRequestedKwh - solarDelivered).toFixed(2));

    const usageExists = await EnergyUsageModel.findOne({ booking: booking.id });
    if (!usageExists) {
      await EnergyUsageModel.create({
        station: booking.station,
        booking: booking._id,
        solarGeneratedKwh: solarDelivered,
        gridDrawKwh: gridDelivered,
        totalDeliveredKwh: booking.energyRequestedKwh,
        carbonSavedKg: Number((solarDelivered * 0.82).toFixed(2)),
        sessionDate: booking.startTime
      });
    }

    return payment;
  },

  async history(userId: string) {
    return PaymentModel.find({ user: userId })
      .populate('station', 'name city address')
      .populate('booking', 'startTime endTime energyRequestedKwh')
      .sort({ createdAt: -1 });
  }
};
