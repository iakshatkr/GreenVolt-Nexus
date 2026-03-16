import { StatusCodes } from 'http-status-codes';
import { STATION_APPROVAL_STATUS, USER_ROLES } from '../constants/enums.js';
import { ChargingStationModel } from '../models/ChargingStation.js';
import { ApiError } from '../utils/apiError.js';

interface StationFilters {
  city?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  ownerId?: string;
  approvalStatus?: string;
}

interface CreateStationInput {
  ownerId: string;
  name: string;
  description: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  solarCapacityKw: number;
  chargingPorts: number;
  connectorTypes: string[];
  pricePerKwh: number;
  amenities: string[];
  operatingHours: {
    open: string;
    close: string;
  };
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
}

export const stationService = {
  async list(filters: StationFilters) {
    const query: Record<string, unknown> = {};

    if (filters.city) {
      query.city = new RegExp(filters.city, 'i');
    }

    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { address: new RegExp(filters.search, 'i') },
        { city: new RegExp(filters.search, 'i') }
      ];
    }

    if (filters.ownerId) {
      query.owner = filters.ownerId;
    }

    if (filters.approvalStatus) {
      query.approvalStatus = filters.approvalStatus;
    } else if (!filters.ownerId) {
      query.approvalStatus = STATION_APPROVAL_STATUS.APPROVED;
    }

    if (typeof filters.lat === 'number' && typeof filters.lng === 'number') {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [filters.lng, filters.lat]
          },
          $maxDistance: (filters.radiusKm ?? 20) * 1000
        }
      };
    }

    return ChargingStationModel.find(query)
      .populate('owner', 'name email city')
      .sort({ createdAt: -1 });
  },

  async getById(stationId: string) {
    const station = await ChargingStationModel.findById(stationId).populate(
      'owner',
      'name email city'
    );

    if (!station) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Charging station not found');
    }

    return station;
  },

  async create(input: CreateStationInput) {
    const station = await ChargingStationModel.create({
      owner: input.ownerId,
      name: input.name,
      description: input.description,
      city: input.city,
      address: input.address,
      location: {
        type: 'Point',
        coordinates: [input.longitude, input.latitude]
      },
      solarCapacityKw: input.solarCapacityKw,
      chargingPorts: input.chargingPorts,
      connectorTypes: input.connectorTypes,
      pricePerKwh: input.pricePerKwh,
      amenities: input.amenities,
      operatingHours: input.operatingHours,
      availability: input.availability,
      approvalStatus: STATION_APPROVAL_STATUS.PENDING
    });

    return station;
  },

  async update(
    stationId: string,
    userId: string,
    role: string,
    payload: Partial<CreateStationInput>
  ) {
    const station = await ChargingStationModel.findById(stationId);
    if (!station) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Charging station not found');
    }

    const canManage = role === USER_ROLES.ADMIN || station.owner.toString() === userId;
    if (!canManage) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You cannot update this station');
    }

    if (payload.latitude !== undefined && payload.longitude !== undefined) {
      station.location = {
        type: 'Point',
        coordinates: [payload.longitude, payload.latitude]
      };
    }

    Object.assign(station, {
      name: payload.name ?? station.name,
      description: payload.description ?? station.description,
      city: payload.city ?? station.city,
      address: payload.address ?? station.address,
      solarCapacityKw: payload.solarCapacityKw ?? station.solarCapacityKw,
      chargingPorts: payload.chargingPorts ?? station.chargingPorts,
      connectorTypes: payload.connectorTypes ?? station.connectorTypes,
      pricePerKwh: payload.pricePerKwh ?? station.pricePerKwh,
      amenities: payload.amenities ?? station.amenities,
      operatingHours: payload.operatingHours ?? station.operatingHours,
      availability: payload.availability ?? station.availability
    });

    if (role !== USER_ROLES.ADMIN) {
      station.approvalStatus = STATION_APPROVAL_STATUS.PENDING;
    }

    await station.save();
    return station;
  },

  async changeApproval(stationId: string, approvalStatus: string) {
    const station = await ChargingStationModel.findByIdAndUpdate(
      stationId,
      { approvalStatus },
      { new: true }
    );

    if (!station) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Charging station not found');
    }

    return station;
  }
};

