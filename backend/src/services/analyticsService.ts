import { BookingModel } from '../models/Booking.js';
import { ChargingStationModel } from '../models/ChargingStation.js';
import { EnergyUsageModel } from '../models/EnergyUsage.js';
import { PaymentModel } from '../models/Payment.js';
import { UserModel } from '../models/User.js';

export const analyticsService = {
  async ownerOverview(ownerId: string) {
    const ownerStations = await ChargingStationModel.find({ owner: ownerId }).select('_id name city');
    const stationIds = ownerStations.map((station) => station._id);

    const [bookingCount, paymentStats, energySessions] = await Promise.all([
      BookingModel.countDocuments({ station: { $in: stationIds } }),
      PaymentModel.aggregate([
        { $match: { station: { $in: stationIds } } },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$amount' },
            payments: { $sum: 1 }
          }
        }
      ]),
      EnergyUsageModel.aggregate([
        { $match: { station: { $in: stationIds } } },
        {
          $group: {
            _id: '$station',
            solarGeneratedKwh: { $sum: '$solarGeneratedKwh' },
            totalDeliveredKwh: { $sum: '$totalDeliveredKwh' },
            carbonSavedKg: { $sum: '$carbonSavedKg' }
          }
        }
      ])
    ]);

    const energyByStation = ownerStations.map((station) => {
      const metrics = energySessions.find((entry) => String(entry._id) === String(station._id));
      return {
        stationId: station._id,
        stationName: station.name,
        city: station.city,
        solarGeneratedKwh: metrics?.solarGeneratedKwh ?? 0,
        totalDeliveredKwh: metrics?.totalDeliveredKwh ?? 0,
        carbonSavedKg: metrics?.carbonSavedKg ?? 0
      };
    });

    return {
      stations: ownerStations.length,
      bookings: bookingCount,
      revenue: paymentStats[0]?.revenue ?? 0,
      successfulPayments: paymentStats[0]?.payments ?? 0,
      energyByStation
    };
  },

  async adminOverview() {
    const [users, stations, pendingStations, bookings, payments, energyUsage] = await Promise.all([
      UserModel.countDocuments(),
      ChargingStationModel.countDocuments(),
      ChargingStationModel.countDocuments({ approvalStatus: 'pending' }),
      BookingModel.countDocuments(),
      PaymentModel.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' }
          }
        }
      ]),
      EnergyUsageModel.aggregate([
        {
          $group: {
            _id: null,
            solarGeneratedKwh: { $sum: '$solarGeneratedKwh' },
            totalDeliveredKwh: { $sum: '$totalDeliveredKwh' },
            carbonSavedKg: { $sum: '$carbonSavedKg' }
          }
        }
      ])
    ]);

    return {
      users,
      stations,
      pendingStations,
      bookings,
      totalRevenue: payments[0]?.totalRevenue ?? 0,
      solarGeneratedKwh: energyUsage[0]?.solarGeneratedKwh ?? 0,
      totalDeliveredKwh: energyUsage[0]?.totalDeliveredKwh ?? 0,
      carbonSavedKg: energyUsage[0]?.carbonSavedKg ?? 0
    };
  }
};

