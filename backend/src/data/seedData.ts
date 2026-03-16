export const demoUsers = [
  {
    key: 'admin',
    name: 'Aarav Admin',
    email: 'admin@greenvoltnexus.com',
    password: 'Admin@123',
    city: 'Jaipur',
    role: 'admin',
    phone: '+91 9876500001'
  },
  {
    key: 'owner',
    name: 'Siya Station Owner',
    email: 'owner@greenvoltnexus.com',
    password: 'Owner@123',
    city: 'Jaipur',
    role: 'station_owner',
    phone: '+91 9876500002'
  },
  {
    key: 'user',
    name: 'Kabir Driver',
    email: 'user@greenvoltnexus.com',
    password: 'User@123',
    city: 'Jaipur',
    role: 'user',
    phone: '+91 9876500003'
  }
];

export const demoStations = [
  {
    name: 'Solar Hub Central',
    description: 'Downtown solar EV charging station with fast charging and cafe amenities.',
    city: 'Jaipur',
    address: 'MI Road, Jaipur, Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    solarCapacityKw: 180,
    chargingPorts: 8,
    connectorTypes: ['CCS2', 'Type 2', 'CHAdeMO'],
    pricePerKwh: 18,
    amenities: ['Cafe', 'Restroom', 'WiFi'],
    operatingHours: { open: '06:00', close: '23:00' },
    availability: [
      { day: 'Mon-Fri', startTime: '06:00', endTime: '23:00' },
      { day: 'Sat-Sun', startTime: '07:00', endTime: '22:00' }
    ],
    approvalStatus: 'approved'
  },
  {
    name: 'GreenVolt Airport Link',
    description: 'High-throughput charging station designed for airport transfers and fleet EVs.',
    city: 'Jaipur',
    address: 'Sanganer Airport Road, Jaipur, Rajasthan',
    latitude: 26.8286,
    longitude: 75.8057,
    solarCapacityKw: 240,
    chargingPorts: 10,
    connectorTypes: ['CCS2', 'Type 2'],
    pricePerKwh: 21,
    amenities: ['Lounge', 'Surveillance', 'Parking'],
    operatingHours: { open: '00:00', close: '23:59' },
    availability: [{ day: 'Daily', startTime: '00:00', endTime: '23:59' }],
    approvalStatus: 'approved'
  },
  {
    name: 'SunGrid Tech Park',
    description: 'Upcoming station serving office commuters with strong solar storage capacity.',
    city: 'Jaipur',
    address: 'Malviya Nagar, Jaipur, Rajasthan',
    latitude: 26.8543,
    longitude: 75.8242,
    solarCapacityKw: 120,
    chargingPorts: 6,
    connectorTypes: ['CCS2', 'Type 2'],
    pricePerKwh: 17,
    amenities: ['Workspace', 'Coffee Bar'],
    operatingHours: { open: '08:00', close: '21:00' },
    availability: [{ day: 'Daily', startTime: '08:00', endTime: '21:00' }],
    approvalStatus: 'pending'
  }
];

