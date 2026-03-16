import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { demoStations, demoUsers } from '../data/seedData.js';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/enums.js';
import { BookingModel } from '../models/Booking.js';
import { ChargingStationModel } from '../models/ChargingStation.js';
import { EnergyUsageModel } from '../models/EnergyUsage.js';
import { PaymentModel } from '../models/Payment.js';
import { UserModel } from '../models/User.js';

const seed = async () => {
  await connectDatabase();

  await Promise.all([
    EnergyUsageModel.deleteMany({}),
    PaymentModel.deleteMany({}),
    BookingModel.deleteMany({}),
    ChargingStationModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);

  const hashedUsers = await Promise.all(
    demoUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 12)
    }))
  );

  const users = await UserModel.create(hashedUsers);
  const userMap = new Map(users.map((user, index) => [demoUsers[index].key, user]));
  const owner = userMap.get('owner');
  const driver = userMap.get('user');

  if (!owner || !driver) {
    throw new Error('Seed users were not created correctly');
  }

  const stations = await ChargingStationModel.create(
    demoStations.map((station) => ({
      owner: owner._id,
      name: station.name,
      description: station.description,
      city: station.city,
      address: station.address,
      location: {
        type: 'Point',
        coordinates: [station.longitude, station.latitude]
      },
      solarCapacityKw: station.solarCapacityKw,
      chargingPorts: station.chargingPorts,
      connectorTypes: station.connectorTypes,
      pricePerKwh: station.pricePerKwh,
      amenities: station.amenities,
      operatingHours: station.operatingHours,
      availability: station.availability,
      approvalStatus: station.approvalStatus,
      totalBookings: 0
    }))
  );

  const now = new Date();
  const bookingStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const bookingEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000);
  const pastStart = new Date(now.getTime() - 72 * 60 * 60 * 1000);
  const pastEnd = new Date(now.getTime() - 70 * 60 * 60 * 1000);

  const bookings = await BookingModel.create([
    {
      user: driver._id,
      station: stations[0]._id,
      portNumber: 2,
      startTime: bookingStart,
      endTime: bookingEnd,
      energyRequestedKwh: 22,
      estimatedAmount: 396,
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.SUCCEEDED,
      invoiceNumber: 'GV-2026-120001'
    },
    {
      user: driver._id,
      station: stations[1]._id,
      portNumber: 1,
      startTime: pastStart,
      endTime: pastEnd,
      energyRequestedKwh: 18,
      estimatedAmount: 378,
      status: BOOKING_STATUS.COMPLETED,
      paymentStatus: PAYMENT_STATUS.SUCCEEDED,
      invoiceNumber: 'GV-2026-120002'
    }
  ]);

  await PaymentModel.create(
    bookings.map((booking, index) => ({
      booking: booking._id,
      user: driver._id,
      station: booking.station,
      amount: booking.estimatedAmount,
      currency: 'INR',
      status: PAYMENT_STATUS.SUCCEEDED,
      provider: 'stripe-mock',
      providerSessionId: `sess_seed_${index + 1}`,
      method: 'card',
      invoiceNumber: booking.invoiceNumber,
      paidAt: new Date(booking.startTime)
    }))
  );

  await EnergyUsageModel.create([
    {
      station: stations[0]._id,
      booking: bookings[0]._id,
      solarGeneratedKwh: 15.84,
      gridDrawKwh: 6.16,
      totalDeliveredKwh: 22,
      carbonSavedKg: 12.99,
      sessionDate: bookingStart
    },
    {
      station: stations[1]._id,
      booking: bookings[1]._id,
      solarGeneratedKwh: 12.96,
      gridDrawKwh: 5.04,
      totalDeliveredKwh: 18,
      carbonSavedKg: 10.63,
      sessionDate: pastStart
    }
  ]);

  stations[0].totalBookings = 1;
  stations[1].totalBookings = 1;
  await Promise.all([stations[0].save(), stations[1].save()]);

  console.log('Seed completed successfully');
};

seed()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
