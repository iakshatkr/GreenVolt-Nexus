export type UserRole = 'user' | 'station_owner' | 'admin';
export type StationApprovalStatus = 'pending' | 'approved' | 'rejected';
export type BookingStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  city: string;
  phone?: string;
  role: UserRole;
}

export interface Station {
  _id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
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
  approvalStatus: StationApprovalStatus;
  totalBookings: number;
  rating: number;
  owner?: {
    name: string;
    email: string;
    city: string;
  };
}

export interface Booking {
  _id: string;
  station: Station;
  user?: Pick<AuthUser, 'name' | 'email' | 'city'>;
  portNumber: number;
  startTime: string;
  endTime: string;
  energyRequestedKwh: number;
  estimatedAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  invoiceNumber: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  station: Pick<Station, '_id' | 'name' | 'city' | 'address'>;
  booking: Pick<Booking, '_id' | 'startTime' | 'endTime' | 'energyRequestedKwh'>;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerSessionId: string;
  method: string;
  invoiceNumber: string;
  paidAt?: string;
  createdAt: string;
}

export interface OwnerAnalytics {
  stations: number;
  bookings: number;
  revenue: number;
  successfulPayments: number;
  energyByStation: Array<{
    stationId: string;
    stationName: string;
    city: string;
    solarGeneratedKwh: number;
    totalDeliveredKwh: number;
    carbonSavedKg: number;
  }>;
}

export interface AdminAnalytics {
  users: number;
  stations: number;
  pendingStations: number;
  bookings: number;
  totalRevenue: number;
  solarGeneratedKwh: number;
  totalDeliveredKwh: number;
  carbonSavedKg: number;
}

export interface IntegrationStatus {
  frontendOrigin: string;
  api: {
    status: string;
  };
  database: {
    mode: 'atlas' | 'memory' | 'disconnected';
    readyState: number;
    state: string;
    databaseName: string | null;
    collections: {
      users: number;
      stations: number;
      bookings: number;
      payments: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
