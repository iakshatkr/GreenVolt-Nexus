import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { apiClient } from '../../api/client';
import { MetricCard } from '../../components/shared/MetricCard';
import { SectionCard } from '../../components/shared/SectionCard';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import type { ApiResponse, Booking, OwnerAnalytics, Station } from '../../types';

const emptyForm = {
  name: '',
  description: '',
  city: 'Jaipur',
  address: '',
  latitude: 26.9124,
  longitude: 75.7873,
  solarCapacityKw: 120,
  chargingPorts: 6,
  connectorTypes: 'CCS2,Type 2',
  pricePerKwh: 18,
  amenities: 'Cafe,WiFi',
  open: '06:00',
  close: '22:00'
};

export const OwnerDashboardPage = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const loadDashboard = async () => {
    const stationResponse = await apiClient.get<ApiResponse<Station[]>>('/stations/owner/list');
    const bookingResponse = await apiClient.get<ApiResponse<Booking[]>>('/bookings/owner');
    const analyticsResponse = await apiClient.get<ApiResponse<OwnerAnalytics>>('/analytics/owner');

    setStations(stationResponse.data.data);
    setBookings(bookingResponse.data.data);
    setAnalytics(analyticsResponse.data.data);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const submitStation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    try {
      await apiClient.post('/stations', {
        name: form.name,
        description: form.description,
        city: form.city,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        solarCapacityKw: Number(form.solarCapacityKw),
        chargingPorts: Number(form.chargingPorts),
        connectorTypes: form.connectorTypes.split(',').map((item) => item.trim()),
        pricePerKwh: Number(form.pricePerKwh),
        amenities: form.amenities.split(',').map((item) => item.trim()),
        operatingHours: { open: form.open, close: form.close },
        availability: [{ day: 'Daily', startTime: form.open, endTime: form.close }]
      });
      setMessage('Station submitted for admin approval.');
      setForm(emptyForm);
      await loadDashboard();
    } catch {
      setMessage('Unable to submit station right now.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Stations" value={String(analytics?.stations ?? 0)} hint="Stations owned by your account." />
        <MetricCard label="Bookings" value={String(analytics?.bookings ?? 0)} hint="Total sessions across all owned stations." />
        <MetricCard label="Revenue" value={formatCurrency(analytics?.revenue ?? 0)} hint="Simulated payment revenue." />
        <MetricCard label="Payments" value={String(analytics?.successfulPayments ?? 0)} hint="Successful completed payments." />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Register a charging station" subtitle="New stations enter an admin approval workflow.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submitStation}>
            <input className="input" placeholder="Station name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            <input className="input" placeholder="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} required />
            <input className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
            <input className="input md:col-span-2" placeholder="Address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} required />
            <input className="input" type="number" step="0.0001" placeholder="Latitude" value={form.latitude} onChange={(event) => setForm((current) => ({ ...current, latitude: Number(event.target.value) }))} required />
            <input className="input" type="number" step="0.0001" placeholder="Longitude" value={form.longitude} onChange={(event) => setForm((current) => ({ ...current, longitude: Number(event.target.value) }))} required />
            <input className="input" type="number" placeholder="Solar capacity kW" value={form.solarCapacityKw} onChange={(event) => setForm((current) => ({ ...current, solarCapacityKw: Number(event.target.value) }))} required />
            <input className="input" type="number" placeholder="Charging ports" value={form.chargingPorts} onChange={(event) => setForm((current) => ({ ...current, chargingPorts: Number(event.target.value) }))} required />
            <input className="input" placeholder="Connector types" value={form.connectorTypes} onChange={(event) => setForm((current) => ({ ...current, connectorTypes: event.target.value }))} required />
            <input className="input" type="number" placeholder="Price per kWh" value={form.pricePerKwh} onChange={(event) => setForm((current) => ({ ...current, pricePerKwh: Number(event.target.value) }))} required />
            <input className="input md:col-span-2" placeholder="Amenities" value={form.amenities} onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))} />
            <input className="input" type="time" value={form.open} onChange={(event) => setForm((current) => ({ ...current, open: event.target.value }))} />
            <input className="input" type="time" value={form.close} onChange={(event) => setForm((current) => ({ ...current, close: event.target.value }))} />
            <div className="md:col-span-2">
              <button className="btn-primary" type="submit">
                Submit station
              </button>
            </div>
          </form>
          {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
        </SectionCard>

        <SectionCard title="Energy performance" subtitle="Solar generation and delivered power by station.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.energyByStation ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stationName" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solarGeneratedKwh" fill="#219f66" radius={[8, 8, 0, 0]} />
                <Bar dataKey="totalDeliveredKwh" fill="#082032" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Station portfolio" subtitle="Track approval state and pricing across your network.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Station</th>
                <th className="pb-3">Approval</th>
                <th className="pb-3">Capacity</th>
                <th className="pb-3">Pricing</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station._id} className="border-t border-slate-100">
                  <td className="py-4">
                    <p className="font-semibold text-night">{station.name}</p>
                    <p className="text-slate-500">{station.city}</p>
                  </td>
                  <td className="py-4">
                    <StatusBadge value={station.approvalStatus} />
                  </td>
                  <td className="py-4 text-slate-600">
                    {station.solarCapacityKw} kW / {station.chargingPorts} ports
                  </td>
                  <td className="py-4 text-slate-600">{formatCurrency(station.pricePerKwh)}/kWh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Incoming bookings" subtitle="Recent charging reservations across your approved stations.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Driver</th>
                <th className="pb-3">Station</th>
                <th className="pb-3">Schedule</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-slate-100">
                  <td className="py-4">
                    <p className="font-semibold text-night">{booking.user?.name}</p>
                    <p className="text-slate-500">{booking.user?.email}</p>
                  </td>
                  <td className="py-4 text-slate-600">{booking.station.name}</td>
                  <td className="py-4 text-slate-600">
                    <p>{formatDateTime(booking.startTime)}</p>
                    <p>{formatDateTime(booking.endTime)}</p>
                  </td>
                  <td className="py-4">
                    <StatusBadge value={booking.status} />
                  </td>
                  <td className="py-4 font-semibold text-night">{formatCurrency(booking.estimatedAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};
