export const USER_ROLES = {
  USER: 'user',
  OWNER: 'station_owner',
  ADMIN: 'admin'
} as const;

export const STATION_APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type StationApprovalStatus =
  (typeof STATION_APPROVAL_STATUS)[keyof typeof STATION_APPROVAL_STATUS];
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

